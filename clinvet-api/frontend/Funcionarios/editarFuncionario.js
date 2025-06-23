const modalEditar = document.querySelector('dialog.modal-editar');
const formEditar = document.querySelector('.form-edicao');
const btnCancelarEditar = document.querySelector('.btn-cancelar-editar');

const selectCargoEditar = formEditar.cargo;
const inputCrmvEditar = formEditar.crmv;
const inputEspecialidadeEditar = formEditar.especialidade;

let FuncionarioIdEditar = null;


formEditar.cpf.addEventListener('input', () => {
    let cpf = formEditar.cpf.value.replace(/\D/g, '');

    if (cpf.length > 11) cpf = cpf.slice(0, 11);

    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    formEditar.cpf.value = cpf;
});

// Aplica máscara de telefone em tempo real
formEditar.telefone.addEventListener('input', () => {
    let tel = formEditar.telefone.value.replace(/\D/g, '');

    if (tel.length > 11) tel = tel.slice(0, 11);

    if (tel.length <= 10) {
        tel = tel.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        tel = tel.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }

    form.telefone.value = tel;
});

// Função para ativar/desativar CRMV e Especialidade conforme cargo
function verificarCargoEditar() {
    if (selectCargoEditar.value === 'veterinario') {
        inputCrmvEditar.disabled = false;
        inputEspecialidadeEditar.disabled = false;
    } else {
        inputCrmvEditar.disabled = true;
        inputEspecialidadeEditar.disabled = true;
    }
}

// Acompanhar mudanças no cargo
selectCargoEditar.addEventListener('change', verificarCargoEditar);

// Abrir modal de edição
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('editar')) {
        e.preventDefault();

        FuncionarioIdEditar = e.target.getAttribute('data-id');

        if (!FuncionarioIdEditar) {
            alert('ID do funcionário não encontrado.');
            return;
        }

        const token = localStorage.getItem('token'); // recupera token JWT

        if (!token) {
            alert('Usuário não autenticado. Faça login novamente.');
            return;
        }

        try {
            const resposta = await fetch(`http://localhost:3000/funcionarios/${FuncionarioIdEditar}`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (!resposta.ok) throw new Error('Funcionário não encontrado no backend.');

            const funcionario = await resposta.json();

            // Preencher formulário com dados do funcionário
            formEditar.nome.value = funcionario.nome || '';
            formEditar.cpf.value = funcionario.cpf || ''
            formEditar.cargo.value = funcionario.cargo || '';
            formEditar.crmv.value = funcionario.crmv || '';
            formEditar.especialidade.value = funcionario.especialidade || '';
            formEditar.telefone.value = funcionario.telefone || '';
            formEditar.email.value = funcionario.email || '';
            formEditar.senha.value = funcionario.senha || '';

            modalEditar.showModal();
            verificarCargoEditar(); // Ajusta campos conforme cargo

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
    verificarCargoEditar(); // Reset estado dos campos
});

// Submeter edição
formEditar.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!FuncionarioIdEditar) {
        alert('ID do funcionário não encontrado.');
        return;
    }

    // Validação para veterinário
    if (formEditar.cargo.value === 'veterinario') {
        if (formEditar.crmv.value.trim() === '' || formEditar.especialidade.value.trim() === '') {
            alert('Para veterinários, CRMV e Especialidade são obrigatórios.');
            return;
        }
    }

    const dadosAtualizados = {
        nome: formEditar.nome.value.trim(),
        cpf: formEditar.cpf.value.trim(),
        cargo: formEditar.cargo.value,
        crmv: formEditar.cargo.value === 'veterinario' ? formEditar.crmv.value.trim() : '',
        especialidade: formEditar.cargo.value === 'veterinario' ? formEditar.especialidade.value.trim() : '',
        telefone: formEditar.telefone.value.trim(),
        email: formEditar.email.value.trim(),
        senha: formEditar.senha.value.trim()
    };

    const token = localStorage.getItem('token'); // recupera token JWT

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
        carregarFuncionarios(); // Função para recarregar tabela

    } catch (error) {
        alert('Erro na conexão: ' + error.message);
    }
});
