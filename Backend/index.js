const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mysql = require("mysql2/promise");
const csv = require("fast-csv");

const app = express();

app.use(cors());
app.use(cors({ origin: "*" }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function findDuplicateIds(arr) {
  const duplicateValues = {};

  // Loop through each object in the array
  for (let i = 0; i < arr.length; i++) {
    const obj1 = arr[i];

    // Loop through each subsequent object to compare with the current object
    for (let j = i + 1; j < arr.length; j++) {
      const obj2 = arr[j];

      // Check for duplicates in each key except "id"
      for (const key in obj1) {
        if (key !== "id" && obj1[key] === obj2[key]) {
          // Add the duplicate id to the object if it hasn't been added yet
          if (!duplicateValues[obj1.id]) {
            duplicateValues[obj1.id] = true;
          }
          if (!duplicateValues[obj2.id]) {
            duplicateValues[obj2.id] = true;
          }
        }
      }
    }
  }

  // Return an array of the duplicate ids
  return Object.keys(duplicateValues);
}

app.post("/api/upload", upload.single("file"), async (req, res) => {
  const file = req.file.buffer.toString();
  const results = [];

  csv
    .parseString(file, { headers: true })
    .on("error", (error) => {
      console.error(error);
      res
        .status(500)
        .json({ message: "Ocurrió un error al procesar el archivo." });
    })
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Admin",
        database: "CSVDATA",
      });

      await connection.execute("DELETE FROM usuarios");

      for (const result of results) {
        const name = result["Nombre"];
        let phone = result["Telefono"];
        let email = result["Correo Electronico"];

        if (!email) {
          email = "";
        }
        if (!phone) {
          phone = "";
        }

        await connection.execute(
          "INSERT INTO Usuarios (Nombre, email, phone) VALUES (?, ?, ?)",
          [name, email, phone]
        );
      }

      try {
        const sql = `
          DELETE FROM Usuarios
          WHERE id NOT IN (
            SELECT id FROM (
              SELECT MAX(id) AS id
              FROM Usuarios
              GROUP BY Nombre, email, phone
            ) AS Temp
          )
        `;
        const [results] = await connection.execute(sql);
        console.log("result", results);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Ocurrió un error al eliminar registros duplicados.",
        });
      }

      connection.end();
      res.json({ message: "Datos guardados correctamente." });
    });
});

app.get("/api/users", async (req, res) => {
  const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Admin",
    database: "CSVDATA",
  });

  try {
    const [rows, fields] = await connection.execute("SELECT * FROM Usuarios");

    const duplicateValues = findDuplicateIds(rows, [
      "Nombre",
      "email",
      "phone",
    ]);
    console.log("duplicateValues", duplicateValues);
    const users = {
      data: rows,
      count: rows.length,
      duplicatedIds: duplicateValues,
      numDuplicatedIds: duplicateValues.length,
    };
    res.json(JSON.stringify(users));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al obtener los usuarios." });
  } finally {
    connection.end();
  }
});

const port = 3000;

app.listen(port, () => console.log(`Servidor iniciado en el puerto ${port}`));
