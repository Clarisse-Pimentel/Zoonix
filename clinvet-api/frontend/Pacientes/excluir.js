const modalExcluir = document.querySelector('dialog.modal-excluir');
const btnCancelarExcluir = document.querySelector('.btn-cancelar-excluir');
const btnConfirmarExcluir = document.querySelector('.btn-confirmar-excluir');

let pacienteIdExcluir = null;

// Abrir modal de excluir
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('deletar')) {
    e.preventDefault();
    const href = e.target.closest('a').getAttribute('href');
    const urlParams = new URLSearchParams(href.split('?')[1]);
    pacienteIdExcluir = urlParams.get('id');

    if (pacienteIdExcluir) {
      modalExcluir.showModal();
    } else {
      alert('ID do paciente não encontrado.');
    }
  }
});

// Cancelar exclusão
btnCancelarExcluir.addEventListener('click', () => {
  modalExcluir.close();
  pacienteIdExcluir = null;
});

// Confirmar exclusão
btnConfirmarExcluir.addEventListener('click', async () => {
  if (!pacienteIdExcluir) return;

  try {
    const resposta = await fetch(`http://localhost:3000/pacientes/${pacienteIdExcluir}`, {
      method: 'DELETE'
    });

    if (!resposta.ok) {
      alert('Erro ao excluir o paciente.');
      return;
    }

    alert('Paciente excluído com sucesso!');
    modalExcluir.close();
    carregarPacientes(); // Atualiza a lista
    pacienteIdExcluir = null;
  } catch (error) {
    alert('Erro na conexão: ' + error.message);
  }
});
