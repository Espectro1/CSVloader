import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const [users, setUsers] = useState(false);

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
        setUsers(JSON.parse(response.data));
      });
    }
  }, [isPosted]);

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Enviar</button>
      </form>
      <div>Numero de Personas en el registro: {users.count}</div>
      <div>Numero filas con datos duplicados: {users.numDuplicatedIds}</div>
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
            {users &&
              users.data.map((user, id) => (
                <tr
                  key={id}
                  className={`${
                    users.duplicatedIds.includes(user.id.toString())
                      ? "red"
                      : ``
                  }`}
                >
                  <td>{user.id}</td>
                  <td>{user.Nombre}</td>
                  <td
                    className={`${
                      users.invalidEmailsIds.includes(user.id) ? "yellow" : ""
                    }`}
                  >
                    {user.email}
                  </td>
                  <td
                    className={`${
                      users.invalidPhonesIds.includes(user.id) ? "yellow" : ""
                    }`}
                  >
                    {user.phone}
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
