import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random

class TestCadastroPaciente(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Use o caminho do seu driver, ex: chromedriver.exe
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.driver.get("http://localhost:3001/frontend/Pacientes/index.html")  # ajuste a porta se necessário

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_cadastrar_paciente(self):
        driver = self.driver
        nome_unico = f"Rex Selenium {random.randint(1000,9999)}"

        # Abrir modal de cadastro
        btn_novo = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "btnNovoPaciente"))
        )
        btn_novo.click()

        # Preencher formulário
        form = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "dialog.modal-cadastrar form.form-cadastro"))
        )
        form.find_element(By.NAME, "nome").send_keys(nome_unico)
        form.find_element(By.NAME, "raca").send_keys("SRD")
        form.find_element(By.NAME, "especie").send_keys("Canina")
        form.find_element(By.NAME, "sexo").send_keys("M")
        form.find_element(By.NAME, "idade").send_keys("5")
        form.find_element(By.NAME, "tutor").send_keys("João Selenium")
        form.find_element(By.NAME, "telefone").send_keys("(11) 91234-5678")

        # Submeter formulário
        form.find_element(By.CSS_SELECTOR, "button.btn-adicionar").click()

        # Esperar alerta de sucesso
        WebDriverWait(driver, 10).until(EC.alert_is_present())
        alert = Alert(driver)
        self.assertIn("sucesso", alert.text.lower())
        alert.accept()

        # Esperar modal fechar e tabela atualizar
        WebDriverWait(driver, 10).until(
            EC.invisibility_of_element_located((By.CSS_SELECTOR, "dialog.modal-cadastrar[open]"))
        )
        time.sleep(1)  # Aguarda atualização da tabela

        # Verifica se paciente aparece na tabela
        tabela = driver.find_element(By.ID, "pacientesTableBody")
        self.assertIn(nome_unico, tabela.text)

if __name__ == "__main__":
    unittest.main()