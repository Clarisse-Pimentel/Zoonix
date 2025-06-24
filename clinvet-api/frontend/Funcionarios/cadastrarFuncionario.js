const modal = document.querySelector('dialog.modal-cadastrar');
const btnNovoFuncionario = document.getElementById('btnNovoFuncionario');
const btnCancelar = document.querySelector('.btn-cancelar');
const form = document.querySelector('.form-cadastro');

const selectCargo = form.cargo;
const inputCrmv = form.crmv;
const inputEspecialidade = form.especialidade;
const inputCpf = form.cpf;
const inputTelefone = form.telefone;

// Aplica máscara de CPF em tempo real
form.cpf.addEventListener('input', () => {
    let cpf = form.cpf.value.replace(/\D/g, '');

    if (cpf.length > 11) cpf = cpf.slice(0, 11);

    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    form.cpf.value = cpf;
});

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

function verificarCargo() {
    const cargoValor = form.cargo.value.trim().toLowerCase();
    if (cargoValor === 'veterinario') {
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
    verificarCargo();
});

btnCancelar.addEventListener('click', () => {
    modal.close();
    form.reset();
    verificarCargo();
});

selectCargo.addEventListener('change', verificarCargo);

form.addEventListener('submit', async (e) => {
    e.preventDefault();



    const funcionario = {
        nome: form.nome.value.trim(),
        cpf: form.cpf.value.replace(/\D/g, ''),
        cargo: form.cargo.value,
        crmv: form.crmv.value.trim(),
        especialidade: form.especialidade.value.trim(),
        telefone: form.telefone.value.trim(),
        email: form.email.value.trim(),
        senha: form.senha.value.trim()
    };

    const token = localStorage.getItem('token');

    if (!token) {
        alert('Você não está autenticada. Faça login novamente.');
        return;
    }

    try {
        const resposta = await fetch('http://localhost:3000/funcionarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(funcionario)
        });

        if (!resposta.ok) {
            const errorText = await resposta.text();
            alert('Erro ao cadastrar funcionário: ' + errorText);
            return;
        }

        alert('Funcionário cadastrado com sucesso!');
        modal.close();
        form.reset();
        verificarCargo();
        carregarFuncionarios();
    } catch (error) {
        alert('Erro na conexão: ' + error.message);
    }
});