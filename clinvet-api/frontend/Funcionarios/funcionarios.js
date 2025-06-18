const urlBase = 'http://localhost:3000/funcionarios';

function ehVeterinario(cargo) {
    return cargo === 'veterinario';
}


function formatarCargo(cargo) {
    if (cargo === 'veterinario') return 'Vet';
    if (cargo === 'administrador') return 'Adm';
    return 'Outro';
}


// Carrega funcionários
async function carregarFuncionarios(busca = '') {
    try {
        const resposta = await fetch(urlBase);
        let funcionarios = await resposta.json();

        if(busca.trim() !== '') {
            funcionarios = funcionarios.filter( f =>
                f.nome.toLowerCase().includes(busca.toLowerCase())
            );
        }
        const tbody = document.getElementById('funcionariosTableBody');
        tbody.innerHTML = '';

        if (funcionarios.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#888;">Nenhum funcionário encontrado.</td></tr>`
            return;
        }

        funcionarios.forEach(f => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${f.nome}</td>
                <td>${f.cpf}</td>
                <td>${formatarCargo(f.cargo)}</td>
                <td>${ehVeterinario(f.cargo) ? (f.crmv || '-') : '-'}</td>
                <td>${ehVeterinario(f.cargo) ? (f.especialidade || '-') : '-'}</td>
                <td>${f.telefone || '-'}</td>
                <td>${f.email}</td>
                <td>${f.senha}</td>
                <td>
                    <a href="excluir.html?tabela=funcionarios&id=${f.id}">
                        <button class="acao-btn deletar">🗑️</button>
                    </a>
                    <button class="acao-btn editar" data-id="${f.id}">✏️</button>
                </td>
            `;

            tbody.appendChild(tr);
        });
    } catch(error) {
        alert('Erro ao carregar: ' + error.message);
    }
}

// Busca
document.getElementById('searchInput').addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        const busca = e.target.value;
        carregarFuncionarios(busca);
    }
});

carregarFuncionarios();