import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random

class TestEditarPaciente(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.driver.get("http://localhost:3001/frontend/Pacientes/index.html")  # ajuste a porta se necessário

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_editar_paciente(self):
        driver = self.driver
        wait = WebDriverWait(driver, 10)

        # Aguarda a tabela carregar
        wait.until(EC.presence_of_element_located((By.ID, "pacientesTableBody")))

        # Localiza o primeiro botão de editar
        btn_editar = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button.acao-btn.editar"))
        )
        btn_editar.click()

        # Aguarda o modal de edição abrir
        form = wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "dialog.modal-editar form.form-edicao"))
        )

        # Edita o nome do paciente
        novo_nome = f"Paciente Editado {random.randint(1000,9999)}"
        nome_input = form.find_element(By.NAME, "nome")
        nome_input.clear()
        nome_input.send_keys(novo_nome)

        # Salva a edição
        form.find_element(By.CSS_SELECTOR, "button.btn-adicionar").click()

        # Aguarda alerta de sucesso
        wait.until(EC.alert_is_present())
        alert = Alert(driver)
        self.assertIn("sucesso", alert.text.lower())
        alert.accept()

        # Aguarda modal fechar e tabela atualizar
        wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, "dialog.modal-editar[open]")))
        time.sleep(1)

        # Verifica se o nome editado aparece na tabela
        tabela = driver.find_element(By.ID, "pacientesTableBody")
        self.assertIn(novo_nome, tabela.text)

if __name__ == "__main__":
    unittest.main()