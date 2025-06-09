-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: clinvet
-- ------------------------------------------------------
-- Server version	8.0.42

-- Criação do banco dados
CREATE DATABASE IF NOT EXISTS clinvet;
USE clinvet;

-- Tabela `pacientes`
DROP TABLE IF EXISTS pacientes;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



