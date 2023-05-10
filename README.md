Dependencias

------ MySQL -----
Ejecutar el siguiente Script SQL en un query

CREATE DATABASE CSVDATA;

USE CSVDATA;

CREATE TABLE Usuarios (
  id INT NOT NULL AUTO_INCREMENT,
  Nombre VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  PRIMARY KEY (id)
);


password de base de datos
Ir a la carpeta Backend > index.js > linea 10 y cambiar el password por la tuya, por defecto esta en "Admin"


---- Instalación  -------


Backend :
npm i 
npm run start

Front end (carpeta CSVLoader)
npm i
nom run dev
