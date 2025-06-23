const modal = document.querySelector('dialog.modal-cadastrar');
const btnNovoPaciente = document.getElementById('btnNovoPaciente');
const btnCancelar = document.querySelector('.btn-cancelar');
const form = document.querySelector('.form-cadastro');



// Aplica máscara de telefone em tempo real
form.telefone.addEventListener('input', () => {
    let tel = form.telefone.value.replace(/\D/g, '');

    if (tel.length > 11) tel = tel.slice(0, 11);

    if (tel.length <= 10) {
        tel = tel.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        tel = tel.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }

    form.telefone.value = tel;
});


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
