const modalEditar = document.querySelector('dialog.modal-editar');
const formEditar = document.querySelector('.form-edicao');
const btnCancelarEditar = document.querySelector('.btn-cancelar-editar');

const selectCargoEditar = formEditar.cargo;
const inputCrmvEditar = formEditar.crmv;
const inputEspecialidadeEditar = formEditar.especialidade;

let FuncionarioIdEditar = null;

// Problema pra atualizar quando é veterinário
// Função para ativar/desativar CRMV e Especialidade
function verificarCargoEditar() {
    if (selectCargoEditar.value === 'veterinario') {
        inputCrmvEditar.disabled = false;
        inputEspecialidadeEditar.disabled = false;
    } else {
        inputCrmvEditar.value = '';
        inputEspecialidadeEditar.value = '';
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

        try {
            const resposta = await fetch(`http://localhost:3000/funcionarios/${FuncionarioIdEditar}`);
            if (!resposta.ok) throw new Error('Funcionário não encontrado no backend.');

            const funcionario = await resposta.json();

            // Preencher formulário
            formEditar.nome.value = funcionario.nome || '';
            formEditar.cpf.value = funcionario.cpf || '';
            formEditar.cargo.value = funcionario.cargo || '';
            formEditar.crmv.value = funcionario.crmv || '';
            formEditar.especialidade.value = funcionario.especialidade || '';
            formEditar.telefone.value = funcionario.telefone || '';
            formEditar.email.value = funcionario.email || '';
            formEditar.senha.value = funcionario.senha || '';

            modalEditar.showModal();
            verificarCargoEditar(); // Atualiza os campos conforme o cargo

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
    verificarCargoEditar(); // Reseta estado dos campos
});

// Submeter edição
formEditar.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!FuncionarioIdEditar) {
        alert('ID do funcionário não encontrado.');
        return;
    }

    // Validação específica para veterinário
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
        crmv: formEditar.crmv.value.trim(),
        especialidade: formEditar.especialidade.value.trim(),
        telefone: formEditar.telefone.value.trim(),
        email: formEditar.email.value.trim(),
        senha: formEditar.senha.value.trim()
    };

    try {
        const resposta = await fetch(`http://localhost:3000/funcionarios/${FuncionarioIdEditar}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
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
        verificarCargoEditar(); // Garante reset dos campos
        carregarFuncionarios(); // Atualiza a tabela

    } catch (error) {
        alert('Erro na conexão: ' + error.message);
    }
});
