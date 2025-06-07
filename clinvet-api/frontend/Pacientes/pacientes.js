const urlBase = 'http://localhost:3000/pacientes';

// Carrega os pacientes do backend e mostra na tabela
async function carregarPacientes(busca = '') {
  try {
    const resposta = await fetch(urlBase);
    let pacientes = await resposta.json();

    // Filtra pacientes pelo termo da busca (se houver)
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
        <td>${p.sexo}</td>
        <td>${p.idade || '-'}</td>
        <td>${p.tutor}</td>
        <td>${p.telefone_tutor || '-'}</td>
        <td>
          <a href="excluir.html?tabela=pacientes&id=${p.id}" title="Deletar paciente">
            <button class="acao-btn deletar">🗑️</button>
          </a>
          <a href="editarPaciente.html?id=${p.id}" title="Editar paciente">
            <button class="acao-btn editar">✏️</button>
          </a>
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    alert('Erro ao carregar pacientes: ' + error.message);
  }
}

// Botão buscar pacientes
document.getElementById('searchButton').addEventListener('click', () => {
  const busca = document.getElementById('searchInput').value;
  carregarPacientes(busca);
});

// Permite buscar ao pressionar Enter no campo busca
document.getElementById('searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const busca = e.target.value;
    carregarPacientes(busca);
  }
});

// Botão novo paciente → redireciona para tela de cadastro
document.getElementById('btnNovoPaciente').addEventListener('click', () => {
  window.location.href = "cadastroPaciente.html";
});

// Carrega pacientes ao abrir a página
carregarPacientes();
