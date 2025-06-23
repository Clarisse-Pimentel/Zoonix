const modal = document.querySelector('dialog.modal-cadastrar');
const btnNovoAtendimento = document.getElementById('btnNovoAtendimento');
const btnCancelar = document.querySelector('.btn-cancelar');
const form = document.querySelector('.form-cadastro');

btnNovoAtendimento.addEventListener('click', () => {
    modal.showModal();
});

btnCancelar.addEventListener('click', () => {
    modal.close();
    form.reset();
})

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const atendimento = {
        nome_paciente: form.nome_paciente.value.trim(),
        nome_veterinario: form.nome_veterinario.value.trim(),
        diagnostico: form.diagnostico.value.trim(),
        tratamento: form.tratamento.value.trim(),
        nome_funcionario_cadastrante: form.nome_funcionario_cadastrante.value.trim(),
        data: form.data.value.trim()
    };

    try {
        const resposta = await fetch('http://localhost:3000/atendimentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(atendimento)
        });

        if(!resposta.ok) {
            const errorText = await resposta.text();
            alert('Erro ao cadastrar atendimento: ' + errorText);
            return;
        }

        alert('Atendimento cadastrado com sucesso!');
        modal.close();
        form.reset();
        carregarAtendimentos();
    } catch(error) {
        alert('Erro na conexão: ' + error.message);
    }
});