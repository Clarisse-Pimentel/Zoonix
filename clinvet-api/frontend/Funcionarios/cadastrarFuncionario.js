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
inputCpf.addEventListener('input', () => {
    let cpf = inputCpf.value.replace(/\D/g, '');
    if (cpf.length > 11) cpf = cpf.slice(0, 11);
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    inputCpf.value = cpf;
});

// Aplica máscara de telefone em tempo real
inputTelefone.addEventListener('input', () => {
    let tel = inputTelefone.value.replace(/\D/g, '');
    if (tel.length > 11) tel = tel.slice(0, 11);
    tel = tel.length <= 10
        ? tel.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
        : tel.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    inputTelefone.value = tel;
});

// Habilita/desabilita campos conforme cargo
function verificarCargo() {
    const cargo = selectCargo.value;

    if (cargo === 'veterinario') {
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
    verificarOutroCargo();
});

btnCancelar.addEventListener('click', () => {
    modal.close();
    form.reset();
    verificarCargo();
    verificarOutroCargo(); 
});

selectCargo.addEventListener('change', () => {
    verificarCargo();
    verificarOutroCargo(); 
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você não está autenticada. Faça login novamente.');
        return;
    }

    const cargo = selectCargo.value;

    const funcionario = {
        nome: form.nome.value.trim(),
        cpf: inputCpf.value.replace(/\D/g, ''),
        telefone: inputTelefone.value.trim(),
        email: form.email.value.trim(),
        senha: form.senha.value.trim()
    };

    let endpoint = '';
    let body = {};

    switch (cargo) {
        case 'veterinario':
            endpoint = 'http://localhost:3000/funcionarios'; 
            body = {
                ...funcionario,
            cargo: 'veterinario', 
            crmv: form.crmv.value.trim(),
            especialidade: form.especialidade.value.trim()
    };
    break;
        case 'administrador':
            endpoint = 'http://localhost:3000/funcionarios';
            body = funcionario;
            break;
        case 'outro':
            endpoint = 'http://localhost:3000/funcionarios';
            body = {
                ...funcionario,
                cargo: form.cargoPersonalizado.value.trim() // pega o valor digitado
            };
            if (!body.cargo) {
                alert('Digite o nome do cargo.');
                return;
            }
            break;
        default:
            alert('Cargo inválido selecionado.');
            return;
    }

    try {
        const resposta = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
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
