const modalEditar = document.querySelector('dialog.modal-editar');
const formEditar = document.querySelector('.form-edicao');
const btnCancelarEditar = document.querySelector('.btn-cancelar-editar');

const selectCargoEditar = formEditar.cargo;
const inputCrmvEditar = formEditar.crmv;
const inputEspecialidadeEditar = formEditar.especialidade;

// Adicione referências ao campo personalizado
const campoOutroCargoEditar = document.getElementById('campoOutroCargoEditar');
const inputCargoPersonalizadoEditar = document.getElementById('cargoPersonalizadoEditar');

let FuncionarioIdEditar = null;

// Função utilitária para normalizar textos (remover acentos, converter para minúsculo)
function normalizarTexto(texto) {
    return texto.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Máscara de CPF
formEditar.cpf.addEventListener('input', () => {
    let cpf = formEditar.cpf.value.replace(/\D/g, '');

    if (cpf.length > 11) cpf = cpf.slice(0, 11);

    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    formEditar.cpf.value = cpf;
});

// Máscara de telefone
formEditar.telefone.addEventListener('input', () => {
    let tel = formEditar.telefone.value.replace(/\D/g, '');

    if (tel.length > 11) tel = tel.slice(0, 11);

    if (tel.length <= 10) {
        tel = tel.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        tel = tel.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }

    formEditar.telefone.value = tel;
});

// Ativar/desativar CRMV e Especialidade conforme cargo
function verificarCargoEditar() {
    const cargoValor = normalizarTexto(selectCargoEditar.value);
    if (cargoValor === 'veterinario') {
        inputCrmvEditar.disabled = false;
        inputEspecialidadeEditar.disabled = false;
    } else {
        inputCrmvEditar.disabled = true;
        inputEspecialidadeEditar.disabled = true;
        inputCrmvEditar.value = '';
        inputEspecialidadeEditar.value = '';
    }
}

// Função para mostrar/esconder campo personalizado
function verificarOutroCargoEditar() {
    if (selectCargoEditar.value === 'outro') {
        campoOutroCargoEditar.style.display = 'block';
    } else {
        campoOutroCargoEditar.style.display = 'none';
        if (inputCargoPersonalizadoEditar) inputCargoPersonalizadoEditar.value = '';
    }
}

// Verifica alterações no cargo
selectCargoEditar.addEventListener('change', () => {
    verificarCargoEditar();
    verificarOutroCargoEditar();
});

// Abrir modal de edição
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('editar')) {
        e.preventDefault();

        FuncionarioIdEditar = e.target.getAttribute('data-id');

        if (!FuncionarioIdEditar) {
            alert('ID do funcionário não encontrado.');
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            alert('Usuário não autenticado. Faça login novamente.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const resposta = await fetch(`http://localhost:3000/funcionarios/${FuncionarioIdEditar}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            if (!resposta.ok) throw new Error('Funcionário não encontrado no backend.');

            const funcionario = await resposta.json();

            // Preencher o formulário com dados
            formEditar.nome.value = funcionario.nome || '';
            formEditar.cpf.value = funcionario.cpf || '';
            formEditar.cargo.value = funcionario.cargo || '';
            formEditar.crmv.value = funcionario.crmv || '';
            formEditar.especialidade.value = funcionario.especialidade || '';
            formEditar.telefone.value = funcionario.telefone || '';
            formEditar.email.value = funcionario.email || '';
            formEditar.senha.value = '';

            // Se não for veterinário nem administrador, marque "outro" e preencha o campo personalizado
            if (
                funcionario.cargo &&
                funcionario.cargo !== 'veterinario' &&
                funcionario.cargo !== 'administrador'
            ) {
                formEditar.cargo.value = 'outro';
                if (inputCargoPersonalizadoEditar) inputCargoPersonalizadoEditar.value = funcionario.cargo;
            }
            modalEditar.showModal();
            verificarCargoEditar();
            verificarOutroCargoEditar();

        } catch (error) {
            alert('Erro ao carregar funcionário: ' + error.message);
        }
    }
});

// Cancelar edição
btnCancelarEditar.addEventListener('click', () => {
    modalEditar.close();
    formEditar.reset();
    FuncionarioIdEditar = null;
    verificarCargoEditar();
});

// Submeter edição
formEditar.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!FuncionarioIdEditar) {
        alert('ID do funcionário não encontrado.');
        return;
    }

    let cargoFinal = formEditar.cargo.value;
    if (cargoFinal === 'outro') {
        cargoFinal = formEditar.cargoPersonalizadoEditar.value.trim();
        if (!cargoFinal) {
            alert('Digite o nome do cargo.');
            return;
        }
    }

    const cargoNormalizado = normalizarTexto(cargoFinal);

    // Validação extra para veterinário
    if (cargoNormalizado === 'veterinario') {
        if (formEditar.crmv.value.trim() === '' || formEditar.especialidade.value.trim() === '') {
            alert('Para veterinários, CRMV e Especialidade são obrigatórios.');
            return;
        }
    }

    const dadosAtualizados = {
        nome: formEditar.nome.value.trim(),
        cpf: formEditar.cpf.value.trim(),
        cargo: cargoFinal,
        crmv: cargoNormalizado === 'veterinario' ? formEditar.crmv.value.trim() : '',
        especialidade: cargoNormalizado === 'veterinario' ? formEditar.especialidade.value.trim() : '',
        telefone: formEditar.telefone.value.trim(),
        email: formEditar.email.value.trim(),
        senha: formEditar.senha.value.trim()
    };

    console.log('Enviando para o backend:', dadosAtualizados);

    const token = localStorage.getItem('token');

    if (!token) {
        alert('Usuário não autenticado. Faça login novamente.');
        return;
    }

    try {
        
        const resposta = await fetch(`http://localhost:3000/funcionarios/${FuncionarioIdEditar}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (!resposta.ok) {
            const erroTexto = await resposta.text();
            alert('Erro ao atualizar funcionário: ' + erroTexto);
            return;
        }

        alert('Funcionário atualizado com sucesso!');
        modalEditar.close();
        formEditar.reset();
        FuncionarioIdEditar = null;
        verificarCargoEditar();
        carregarFuncionarios(); // Recarrega a tabela

    } catch (error) {
        alert('Erro na conexão: ' + error.message);
    }
});

