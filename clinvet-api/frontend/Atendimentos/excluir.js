const modalExcluir = document.querySelector('dialog.modal-excluir');
const btnCancelarExcluir = document.querySelector('.btn-cancelar-excluir');
const btnConfirmarExcluir = document.querySelector('.btn-confirmar-excluir');

let atendimentoIdExcluir = null;

// Abrir modal de excluir
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('deletar')) {
    e.preventDefault();
    const href = e.target.closest('a').getAttribute('href');
    const urlParams = new URLSearchParams(href.split('?')[1]);
    atendimentoIdExcluir = urlParams.get('id');

    if (atendimentoIdExcluir) {
      modalExcluir.showModal();
    } else {
      alert('ID do atendimento não encontrado.');
    }
  }
});

// Cancelar exclusão
btnCancelarExcluir.addEventListener('click', () => {
  modalExcluir.close();
  atendimentoIdExcluir = null;
});

// Confirmar exclusão
btnConfirmarExcluir.addEventListener('click', async () => {
  if (!atendimentoIdExcluir) return;

  try {
    const usuario = JSON.parse(localStorage.getItem('usuario')); // ou obtenha o nome/id do usuário logado

    const resposta = await fetch(`http://localhost:3000/atendimentos/${atendimentoIdExcluir}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuarioResponsavel: usuario?.nome // ou usuario.id, conforme o backend espera
      })
    });

    if (!resposta.ok) {
      alert('Erro ao excluir o atendimento.');
      return;
    }

    alert('Atendimento excluído com sucesso!');
    modalExcluir.close();
    carregarAtendimentos(); // Atualiza a lista de atendimentos
    atendimentoIdExcluir = null;
  } catch (error) {
    alert('Erro na conexão: ' + error.message);
  }
});
