from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import unittest
import time

class TesteValidacaoCPF(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Edge()
        self.driver.get("http://localhost:3001/frontend/Login/login.html")

    def test_cpf_invalido(self):
        driver = self.driver
        campo_cpf = driver.find_element(By.ID, "cpfLogin")
        campo_cpf.clear()
        campo_cpf.send_keys("123")  # CPF inválido

        # Força o blur focando em outro campo
        campo_senha = driver.find_element(By.XPATH, '//input[@placeholder="Senha"]')
        campo_senha.click()
        time.sleep(1)  # Aguarda JS rodar

        classe = campo_cpf.get_attribute("class") or ""
        aria_invalid = campo_cpf.get_attribute("aria-invalid") or ""
        self.assertTrue(
            "erro" in classe or aria_invalid == "true",
            f"O campo não sinalizou erro para CPF inválido. Classe: {classe}, aria-invalid: {aria_invalid}"
        )

    def test_cpf_valido(self):
        driver = self.driver
        campo_cpf = driver.find_element(By.ID, "cpfLogin")
        campo_cpf.clear()
        campo_cpf.send_keys("123.456.789-09")  # CPF válido formatado

        # Força o blur focando em outro campo
        campo_senha = driver.find_element(By.XPATH, '//input[@placeholder="Senha"]')
        campo_senha.click()
        time.sleep(1)  # Aguarda JS rodar

        classe = campo_cpf.get_attribute("class") or ""
        aria_invalid = campo_cpf.get_attribute("aria-invalid") or ""
        self.assertFalse(
            "erro" in classe or aria_invalid == "true",
            f"O campo sinalizou erro para CPF válido. Classe: {classe}, aria-invalid: {aria_invalid}"
        )

    def test_senha_invalida(self):
        driver = self.driver
        campo_cpf = driver.find_element(By.ID, "cpfLogin")
        campo_senha = driver.find_element(By.ID, "senhaLogin")
        campo_cpf.clear()
        campo_cpf.send_keys("123.456.789-09")  # CPF válido
        campo_senha.clear()
        campo_senha.send_keys("")  # Senha inválida (vazia)

        # Força o blur focando no campo CPF
        campo_cpf.click()
        time.sleep(1)  # Aguarda JS rodar

        classe = campo_senha.get_attribute("class") or ""
        aria_invalid = campo_senha.get_attribute("aria-invalid") or ""
        self.assertTrue(
            "erro" in classe or aria_invalid == "true",
            f"O campo não sinalizou erro para senha inválida. Classe: {classe}, aria-invalid: {aria_invalid}"
        )

    def test_senha_valida(self):
        driver = self.driver
        campo_cpf = driver.find_element(By.ID, "cpfLogin")
        campo_senha = driver.find_element(By.ID, "senhaLogin")
        campo_cpf.clear()
        campo_cpf.send_keys("123.456.789-09")  # CPF válido
        campo_senha.clear()
        campo_senha.send_keys("senhaSegura123")  # Senha válida

        # Força o blur focando no campo CPF
        campo_cpf.click()
        time.sleep(1)  # Aguarda JS rodar

        classe = campo_senha.get_attribute("class") or ""
        aria_invalid = campo_senha.get_attribute("aria-invalid") or ""
        self.assertFalse(
            "erro" in classe or aria_invalid == "true",
            f"O campo sinalizou erro para senha válida. Classe: {classe}, aria-invalid: {aria_invalid}"
        )

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
