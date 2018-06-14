DROP DATABASE IF EXISTS humptydumpty;

CREATE DATABASE humptydumpty;

USE humptydumpty;

CREATE TABLE users (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  high_score INTEGER,
  mode VARCHAR(10)
);
