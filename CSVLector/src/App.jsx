import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const [procesedFile, setProcesedFile] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/upload",
        formData
      );
      setIsPosted(true);
      console.log("respuesta:", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isPosted) {
      axios.get("http://localhost:3000/api/users").then((response) => {
        setProcesedFile(JSON.parse(response.data));
      });
    }
  }, [isPosted]);

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
  }

  function validatePhone(telefono) {
    const regexTelefono = /^[0-9]{10}$/;
    return regexTelefono.test(telefono);
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Enviar</button>
      </form>
      <div>Numero de Personas en el registro: {procesedFile.count}</div>
      <div>
        Numero filas con datos duplicados: {procesedFile.numDuplicatedIds}
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {procesedFile &&
              procesedFile.data.map((usuario, id) => (
                <tr
                  key={id}
                  className={`${
                    procesedFile.duplicatedIds.includes(usuario.id.toString())
                      ? "red"
                      : ``
                  }`}
                >
                  <td>{usuario.id}</td>
                  <td>{usuario.Nombre}</td>
                  <td
                    className={`${
                      validateEmail(usuario.email) ? "" : "yellow"
                    }`}
                  >
                    {usuario.email}
                  </td>
                  <td
                    className={`${
                      validatePhone(usuario.phone) ? "" : "yellow"
                    }`}
                  >
                    {usuario.phone}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
