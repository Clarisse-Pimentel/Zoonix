const modal = document.querySelector('dialog.modal-cadastrar');
const btnNovoAtendimento = document.getElementById('btnNovoAtendimento');
const btnCancelar = document.querySelector('.btn-cancelar');
const form = document.querySelector('.form-cadastro');

btnNovoAtendimento.addEventListener('click', () => {
    modal.showModal();
    carregarSelect('funcionarios/veterinarios', 'id_veterinario');
    carregarSelect('funcionarios', 'id_funcionario');

    const campoData = form.querySelector('input[name="data"]');
    const hoje = new Date().toISOString().split('T')[0];
    campoData.value = hoje;
    campoData.max = hoje;
});

btnCancelar.addEventListener('click', () => {
    modal.close();
    form.reset();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const atendimento = {
        nome_paciente: form.nome_paciente.value.trim(),
        id_veterinario: form.id_veterinario.value,
        diagnostico: form.diagnostico.value.trim(),
        tratamento: form.tratamento.value.trim(),
        id_funcionario: form.id_funcionario.value,
        data: form.data.value
    };

    try {
        const resposta = await fetch('http://localhost:3000/atendimentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(atendimento)
        });

        if (!resposta.ok) {
            const errorText = await resposta.text();
            alert('Erro ao cadastrar atendimento: ' + errorText);
            return;
        }

        alert('Atendimento cadastrado com sucesso!');
        modal.close();
        form.reset();
        carregarAtendimentos();
    } catch (error) {
        alert('Erro na conexão: ' + error.message);
    }
});

async function carregarSelect(nomeTabela, selectName) {
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

        if (!Array.isArray(lista)) {
            alert(`Erro ao carregar ${selectName}: resposta inesperada do servidor.`);
            return;
        }

        const select = document.querySelector(`select[name="${selectName}"]`);
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