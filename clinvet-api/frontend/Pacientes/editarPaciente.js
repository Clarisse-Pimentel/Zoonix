const modalEditar = document.querySelector('dialog.modal-editar');
const formEditar = document.querySelector('.form-edicao');
const btnCancelarEditar = document.querySelector('.btn-cancelar-editar');

let pacienteIdEditar = null;

formEditar.telefone.addEventListener('input', () => {
    let tel = formEditar.telefone.value.replace(/\D/g, '');

    if (tel.length > 11) tel = tel.slice(0, 11);

    if (tel.length <= 10) {
        tel = tel.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        tel = tel.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }

    form.telefone.value = tel;
});

// Abrir modal de edição
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('editar')) {
    e.preventDefault();

    pacienteIdEditar = e.target.getAttribute('data-id');

    if (!pacienteIdEditar) {
      alert('ID do paciente não encontrado.');
      return;
    }

    try {
      const resposta = await fetch(`http://localhost:3000/pacientes/${pacienteIdEditar}`);
      if (!resposta.ok) throw new Error('Paciente não encontrado no backend.');

      const paciente = await resposta.json();

      // Preencher formulário
      formEditar.nome.value = paciente.nome || '';
      formEditar.raca.value = paciente.raca || '';
      formEditar.especie.value = paciente.especie || '';
      formEditar.sexo.value = paciente.sexo || '';
      formEditar.idade.value = paciente.idade || '';
      formEditar.tutor.value = paciente.tutor || '';
      formEditar.telefone.value = paciente.telefone_tutor || '';

      modalEditar.showModal();

    } catch (error) {
      alert('Erro ao carregar paciente: ' + error.message);
    }
  }
});

// Cancelar edição
btnCancelarEditar.addEventListener('click', () => {
  modalEditar.close();
  pacienteIdEditar = null;
});

// Submeter edição
formEditar.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!pacienteIdEditar) {
    alert('ID do paciente não encontrado.');
    return;
  }

  const dadosAtualizados = {
    nome: formEditar.nome.value.trim(),
    raca: formEditar.raca.value.trim(),
    especie: formEditar.especie.value.trim(),
    sexo: formEditar.sexo.value.trim(),
    idade: parseInt(formEditar.idade.value),
    tutor: formEditar.tutor.value.trim(),
    telefone_tutor: formEditar.telefone.value.trim()
  };

  try {
    const resposta = await fetch(`http://localhost:3000/pacientes/${pacienteIdEditar}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosAtualizados)
    });

    if (!resposta.ok) {
      const erroTexto = await resposta.text();
      alert('Erro ao atualizar paciente: ' + erroTexto);
      return;
    }

    alert('Paciente atualizado com sucesso!');
    modalEditar.close();
    formEditar.reset();
    pacienteIdEditar = null;
    carregarPacientes(); // Atualiza a tabela

  } catch (error) {
    alert('Erro na conexão: ' + error.message);
  }
});
