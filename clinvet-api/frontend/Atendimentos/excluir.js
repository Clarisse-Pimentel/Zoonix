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

  console.log('Tentando excluir atendimento id:', atendimentoIdExcluir);

  try {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const token = localStorage.getItem('token');

    const resposta = await fetch(`http://localhost:3000/atendimentos/${atendimentoIdExcluir}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        usuarioResponsavel: usuario?.id
      })
    });

    if (!resposta.ok) {
      const erro = await resposta.text();
      alert('Erro ao excluir o atendimento: ' + erro);
      return;
    }

    alert('Atendimento excluído com sucesso!');
    modalExcluir.close();
    carregarAtendimentos();
    atendimentoIdExcluir = null;
  } catch (error) {
    alert('Erro na conexão: ' + error.message);
  }
});
