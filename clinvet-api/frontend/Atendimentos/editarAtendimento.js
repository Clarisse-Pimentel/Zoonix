const modalEditar = document.querySelector('dialog.modal-editar');
const btnCancelarEditar = modalEditar.querySelector('.btn-cancelar'); 
const formEditar = document.querySelector('.form-editar'); 
let atendimentoIdEditar = null;

// Função para abrir a modal de edição e preparar os campos (igual ao cadastro)
async function abrirModalEditar(atendimento) {
  atendimentoIdEditar = atendimento.id;

  modalEditar.showModal();

  await carregarSelect('funcionarios/veterinarios', 'id_veterinario', formEditar);
  await carregarSelect('funcionarios', 'id_funcionario', formEditar);

  // Limpa os selects (opcional, para garantir)
  formEditar.id_veterinario.value = '';
  formEditar.id_funcionario.value = '';

  formEditar.nome_paciente.value = atendimento.nome_paciente || '';
  formEditar.diagnostico.value = atendimento.diagnostico || '';
  formEditar.tratamento.value = atendimento.tratamento || '';

  // Ajusta data para o formato do input datetime-local
  const campoData = formEditar.querySelector('input[name="data"]');
  const hoje = new Date().toISOString().split('T')[0];
  campoData.value = hoje;
  campoData.max = hoje;

  if (atendimento.data) {
    let data = atendimento.data;
    if (data.includes(' ')) {
      data = data.replace(' ', 'T').slice(0, 16);
    } else if (data.includes('T')) {
      data = data.slice(0, 16);
    }
    campoData.value = data;
  }

  modalEditar.showModal();
}

// Cancelar edição
btnCancelarEditar.addEventListener('click', () => {
  modalEditar.close();
  formEditar.reset();
  atendimentoIdEditar = null;
});

// Submeter edição
formEditar.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!atendimentoIdEditar) {
    alert('ID do atendimento não definido.');
    return;
  }

  const atendimento = {
    nome_paciente: formEditar.nome_paciente.value.trim(),
    id_veterinario: formEditar.id_veterinario.value,
    diagnostico: formEditar.diagnostico.value.trim(),
    tratamento: formEditar.tratamento.value.trim(),
    id_funcionario: formEditar.id_funcionario.value,
    data: formEditar.data.value
  };

  try {
    const resposta = await fetch(`http://localhost:3000/atendimentos/${atendimentoIdEditar}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(atendimento)
    });

    if (!resposta.ok) {
      const erro = await resposta.text();
      alert('Erro ao atualizar atendimento: ' + erro);
      return;
    }

    alert('Atendimento atualizado com sucesso!');
    modalEditar.close();
    formEditar.reset();
    atendimentoIdEditar = null;
    if (typeof carregarAtendimentos === 'function') carregarAtendimentos();
  } catch (error) {
    alert('Erro na atualização: ' + error.message);
  }
});

// Evento para abrir modal ao clicar no lápis
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.editar');
  if (btn) {
    const id = btn.dataset.id;
    if (!id) return;

    try {
      const resposta = await fetch(`http://localhost:3000/atendimentos/${id}`);
      if (!resposta.ok) throw new Error('Atendimento não encontrado');
      const atendimento = await resposta.json();
      abrirModalEditar(atendimento);
    } catch (err) {
      alert('Erro ao carregar atendimento: ' + err.message);
    }
  }
});

// Função para carregar opções dos selects
async function carregarSelect(nomeTabela, selectName, formScope = formEditar) {
    try {
        const token = localStorage.getItem('token');
        const resposta = await fetch(`http://localhost:3000/${nomeTabela}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = '../Login/login.html';
            return;
        }

        const lista = await resposta.json();
        console.log('Lista carregada para', selectName, lista);

        if (!Array.isArray(lista)) {
            alert(`Erro ao carregar ${selectName}: resposta inesperada do servidor.`);
            return;
        }

        const select = formScope.querySelector(`select[name="${selectName}"]`);
        console.log('Select encontrado:', select);
        let textoPadrao = "Selecione...";

        if (selectName === "id_veterinario") textoPadrao = "Selecione o veterinário";
        if (selectName === "id_funcionario") textoPadrao = "Selecione o cadastrante";

        select.innerHTML = `<option value="">${textoPadrao}</option>`;

        lista.forEach(item => {
            // Para veterinários, normalmente o id é id_funcionarios
            const value = item.id_funcionarios || item.id;
            select.innerHTML += `<option value="${value}">${item.nome}</option>`;
        });
    } catch (erro) {
        alert(`Erro ao carregar ${selectName}: ` + erro.message);
    }
}