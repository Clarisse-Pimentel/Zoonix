const urlBase = 'http://localhost:3000/funcionarios';

function ehVeterinario(cargo) {
    return (cargo || '').trim().toLowerCase() === 'veterinario';
}

function formatarCargo(cargo) {
  if (!cargo) return '-';
  return cargo.charAt(0).toUpperCase() + cargo.slice(1).toLowerCase();
}

function formatarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '').padStart(11, '0');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Verifica se o usuário está logado
const token = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('usuario'));

if (!token || !usuario) {
  alert('Você precisa estar logado para acessar esta página.');
  window.location.href = '../Login/index.html'; // ou caminho correto da sua página de login
}

// Carrega funcionários
async function carregarFuncionarios(busca = '') {
    try {
        const token = localStorage.getItem('token');

        const resposta = await fetch(urlBase, {
        headers: {
            'Authorization': `Bearer ${token}`
    }
});

        if (!resposta.ok) {
            throw new Error(`Somente Administradores podem acessar esta página. Código de status: ${resposta.status}`);
        }

        let funcionarios = await resposta.json();

        console.log('Funcionarios:', funcionarios);

        if (!Array.isArray(funcionarios)) {
            if (Array.isArray(funcionarios.funcionarios)) {
                funcionarios = funcionarios.funcionarios;
            } else {
                funcionarios = [];
            }
        }

        if(busca.trim() !== '') {
            funcionarios = funcionarios.filter( f =>
                f.nome.toLowerCase().includes(busca.toLowerCase())
            );
        }
        const tbody = document.getElementById('funcionariosTableBody');
        tbody.innerHTML = '';

        if (funcionarios.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#888;">Nenhum funcionário encontrado.</td></tr>`;
            return;
        }

        funcionarios.forEach(f => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${f.nome}</td>
                <td>${formatarCPF(f.cpf)}</td>
                <td>${formatarCargo(f.cargo)}</td>
                <td>${ehVeterinario(f.cargo) ? (f.crmv || '-') : '-'}</td>
                <td>${ehVeterinario(f.cargo) ? (f.especialidade || '-') : '-'}</td>
                <td>${f.telefone || '-'}</td>
                <td>${f.email || '-'}</td>
                <td>${f.senha ? '****' : '-'}</td>
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
document.getElementById('searchInput').addEventListener('keydown', async (e) => {
    if(e.key === 'Enter') {
        const busca = e.target.value;
        await carregarFuncionarios(busca);
    }
});
carregarFuncionarios();

function verificarOutroCargo() {
    const select = document.getElementById('cargo');
    const campoOutro = document.getElementById('campoOutroCargo');
    if (!select || !campoOutro) return;
    if (select.value === 'Outro' || select.value === 'outro') {
        campoOutro.style.display = 'block';
    } else {
        campoOutro.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const cargo = usuario?.cargo;
    if (cargo !== 'administrador') {
      alert('Acesso não autorizado.');
      window.location.href = '../Menu/index.html'; 
    }
});