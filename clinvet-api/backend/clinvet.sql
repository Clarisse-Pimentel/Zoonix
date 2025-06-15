-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: clinvet
-- ------------------------------------------------------
-- Server version	8.0.42

-- Criação do banco dados
CREATE DATABASE IF NOT EXISTS clinvet;
USE clinvet;

-- Tabela `pacientes`
DROP TABLE IF EXISTS pacientes, atendimentos, administradores, veterinarios, funcionarios;

CREATE TABLE pacientes (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  raca VARCHAR(50),
  especie VARCHAR(50) NOT NULL,
  sexo ENUM('F','M') NOT NULL,
  idade INT,
  tutor VARCHAR(100) NOT NULL,
  telefone_tutor VARCHAR(20),
  PRIMARY KEY (id)
);

CREATE TABLE funcionarios (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  telefone VARCHAR(20),
  cargo VARCHAR(50) NOT NULL,
  cpf VARCHAR(11) NOT NULL,
  email VARCHAR(100) UNIQUE,
  senha VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE veterinarios (
  id_funcionarios INT NOT NULL,
  crmv VARCHAR(20) NOT NULL UNIQUE,
  especialidade VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_funcionarios), -- refencia a tabela funcionarios
  FOREIGN KEY (id_funcionarios) REFERENCES funcionarios(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE administradores (
  id_funcionarios INT NOT NULL,
  PRIMARY KEY (id_funcionarios), -- refencia a tabela funcionarios
  FOREIGN KEY (id_funcionarios) REFERENCES funcionarios(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE atendimentos(
  id INT NOT NULL AUTO_INCREMENT,
  id_pacientes INT NOT NULL,
  id_funcionarios INT NOT NULL,
  id_veterinario INT NOT NULL,
  data DATE NOT NULL,
  tratamento TEXT NOT NULL,
  diagnostico TEXT NOT NULL,
  FOREIGN KEY (id_pacientes) REFERENCES pacientes(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_funcionarios) REFERENCES funcionarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_veterinario) REFERENCES veterinarios(id_funcionarios) ON DELETE CASCADE ON UPDATE CASCADE
  PRIMARY KEY (id)
);
