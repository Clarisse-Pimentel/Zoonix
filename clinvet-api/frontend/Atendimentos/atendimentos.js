const urlBase = 'http://localhost:3000/atendimentos';

function formatarData(dataStr) {
  if (!dataStr) return '-';

  // Se vier no formato ISO (com "T" e "Z")
  if (dataStr.includes('T')) {
    const [data, tempo] = dataStr.split('T');
    if (!data || !tempo) return dataStr;
    const [ano, mes, dia] = data.split('-');
    const [hora, min] = tempo.split(':');
    return `${dia}/${mes}/${ano} ${hora}:${min}`;
  }

  // Se vier no formato "YYYY-MM-DD HH:MM:SS"
  const [data, hora] = dataStr.split(' ');
  if (!data || !hora) return dataStr;
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano} ${hora.slice(0,5)}`;
}

async function carregarAtendimentos(busca = '') {
    try {
        const resposta = await fetch(urlBase);
        let atendimentos = await resposta.json();

        if(busca.trim() !== '') {
            atendimentos = atendimentos.filter( at =>
                at.nome_paciente.toLowerCase().includes(busca.toLowerCase())
            );
        }
        const tbody = document.getElementById('atendimentosTableBody');
        tbody.innerHTML = '';

        if(atendimentos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#888;">Nenhum atendimento encontrado.</td></tr>`
            return;
        }

        atendimentos.forEach(at => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${at.nome_paciente}</td>
                <td>${at.nome_veterinario || '-'}</td>
                <td>${at.diagnostico}</td>
                <td>${at.tratamento}</td>
                <td>${at.funcionario_cadastrante || '-'}</td>
                <td>${formatarData(at.data)}</td>
                <td>
                    <button class="acao-btn editar" data-id="${at.id}">✏️</button>
                    <a href="excluir.html?tabela=atendimentos&id=${at.id}">
                        <button class="acao-btn deletar">🗑️</button>
                    </a>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        alert('Erro ao carregar atendimentos: ' + error.message);
    }
}

// Busca 
document.getElementById('searchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const busca = e.target.value;
        carregarAtendimentos(busca);
    }
});

document.getElementById('searchButton')?.addEventListener('click', () => {
    const busca = document.getElementById('searchInput').value;
    carregarAtendimentos(busca);
});

carregarAtendimentos();

