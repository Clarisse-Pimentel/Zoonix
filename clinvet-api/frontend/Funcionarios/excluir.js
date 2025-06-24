const modalExcluir = document.querySelector('dialog.modal-excluir');
const btnCancelarExcluir = document.querySelector('.btn-cancelar-excluir');
const btnConfirmarExcluir = document.querySelector('.btn-confirmar-excluir');

let FuncionarioIdExcluir = null;

// Abrir modal de excluir
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('deletar')) {
    e.preventDefault();
    const href = e.target.closest('a').getAttribute('href');
    const urlParams = new URLSearchParams(href.split('?')[1]);
    FuncionarioIdExcluir = urlParams.get('id');

    if (FuncionarioIdExcluir) {
      modalExcluir.showModal();
    } else {
      alert('ID do funcionário não encontrado.');
    }
  }
});

// Cancelar exclusão
btnCancelarExcluir.addEventListener('click', () => {
  modalExcluir.close();
  FuncionarioIdExcluir = null;
});

// Confirmar exclusão
btnConfirmarExcluir.addEventListener('click', async () => {
  if (!FuncionarioIdExcluir) return;

  try {
    const token = localStorage.getItem('token');
    const resposta = await fetch(`http://localhost:3000/funcionarios/${FuncionarioIdExcluir}`, {
      method: 'DELETE',
      headers: {
      'Authorization': `Bearer ${token}`
      }
    });

    if (!resposta.ok) {
    const msg = await resposta.text();
    alert(msg || 'Erro ao excluir o funcionário.');
    return;
    }

    alert('Funcionário excluído com sucesso!');
    modalExcluir.close();
    carregarFuncionarios(); // Atualiza a lista
    FuncionarioIdExcluir = null;
  } catch (error) {
    alert('Erro na conexão: ' + error.message);
  }
});
