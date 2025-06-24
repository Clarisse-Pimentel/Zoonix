const urlBase = 'http://localhost:3000/pacientes';

// Carrega pacientes
async function carregarPacientes(busca = '') {
  try {
    const resposta = await fetch(urlBase);
    let pacientes = await resposta.json();

    if (busca.trim() !== '') {
      pacientes = pacientes.filter(p =>
        p.nome.toLowerCase().includes(busca.toLowerCase())
      );
    }

    const tbody = document.getElementById('pacientesTableBody');
    tbody.innerHTML = '';

    if (pacientes.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#888;">Nenhum paciente encontrado.</td></tr>`;
      return;
    }

pacientes.forEach(p => {
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${p.nome}</td>
    <td>${p.raca || '-'}</td>
    <td>${p.especie}</td>
    <td>${p.sexo === 'M' ? 'Macho' : p.sexo === 'F' ? 'Fêmea' : '-'}</td>
    <td>${p.idade ? p.idade + ' anos' : '-'}</td>
    <td>${p.tutor}</td>
    <td>${p.telefone_tutor || '-'}</td>
    <td>
      <a href="excluir.html?tabela=pacientes&id=${p.id}">
        <button class="acao-btn deletar">🗑️</button>
      </a>
      <button class="acao-btn editar" data-id="${p.id}">✏️</button>
    </td>
  `;

  tbody.appendChild(tr);
});

  } catch (error) {
    alert('Erro ao carregar pacientes: ' + error.message);
  }
}

// Busca
document.getElementById('searchButton').addEventListener('click', () => {
  const busca = document.getElementById('searchInput').value;
  carregarPacientes(busca);
});

document.getElementById('searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const busca = e.target.value;
    carregarPacientes(busca);
  }
});

carregarPacientes();
