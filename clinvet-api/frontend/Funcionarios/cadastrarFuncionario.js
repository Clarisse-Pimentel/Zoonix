const modal = document.querySelector('dialog.modal-cadastrar');
const btnNovoFuncionario = document.getElementById('btnNovoFuncionario');
const btnCancelar = document.querySelector('.btn-cancelar');
const form = document.querySelector('.form-cadastro');


const selectCargo = form.cargo;
const inputCrmv = form.crmv;
const inputEspecialidade = form.especialidade;

// Função para ativar/desativar CRMV e Especialidade
function verificarCargo() {
    if (selectCargo.value === 'veterinario') {
        inputCrmv.disabled = false;
        inputEspecialidade.disabled = false;
    } else {
        inputCrmv.value = '';
        inputEspecialidade.value = '';
        inputCrmv.disabled = true;
        inputEspecialidade.disabled = true;
    }
}

btnNovoFuncionario.addEventListener('click', () => {
    modal.showModal();
    verificarCargo(); // Garante que o estado dos campos está correto ao abrir
});

btnCancelar.addEventListener('click', () => {
    modal.close();
    form.reset();
    verificarCargo(); // Reseta os campos também
});

selectCargo.addEventListener('change', verificarCargo);

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const funcionario = {
        nome: form.nome.value.trim(),
        cpf: form.cpf.value.trim(),
        cargo: form.cargo.value,
        crmv: form.crmv.value.trim(),
        especialidade: form.especialidade.value.trim(),
        telefone: form.telefone.value.trim(),
        email: form.email.value.trim(),
        senha: form.senha.value.trim()
    };

    try {
        const resposta = await fetch('http://localhost:3000/funcionarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(funcionario)
        });

        if(!resposta.ok) {
            const errorText = await resposta.text();
            alert('Erro ao cadastrar funcionário: ' + errorText);
            return;
        }

        alert('Funcionário cadastrado com sucesso!');
        modal.close();
        form.reset();
        carregarFuncionarios();
    } catch(error) {
        alert('Erro na conexão: ' + error.message);
    }
});