const modal = document.querySelector('dialog.modal-cadastrar');
const btnNovoPaciente = document.getElementById('btnNovoPaciente');
const btnCancelar = document.querySelector('.btn-cancelar');
const form = document.querySelector('.form-cadastro');

btnNovoPaciente.addEventListener('click', () => {
  modal.showModal();
});

btnCancelar.addEventListener('click', () => {
  modal.close();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const paciente = {
    nome: form.nome.value.trim(),
    raca: form.raca.value.trim(),
    especie: form.especie.value.trim(),
    sexo: form.sexo.value.trim(),
    idade: parseInt(form.idade.value),
    tutor: form.tutor.value.trim(),
    telefone_tutor: form.telefone.value.trim()
  };

  try {
    const response = await fetch('http://localhost:3000/pacientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paciente)
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert('Erro ao cadastrar paciente: ' + errorText);
      return;
    }

    alert('Paciente cadastrado com sucesso!');
    modal.close();
    form.reset();
    carregarPacientes(); 
  } catch (error) {
    alert('Erro na conexão: ' + error.message);
  }
});
