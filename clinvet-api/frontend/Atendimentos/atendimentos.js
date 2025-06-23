const urlBase = 'http://localhost:3000/atendimentos';

async function carregarAtendimentos(busca = '') {
    try {
        const resposta = await fetch(urlBase);
        let atendimentos = await resposta.json();

        if(busca.trim() !== '') {
            atendimentos = atendimentos.filter( at =>
                at.nome_pacienteS.toLowerCase().includes(busca.toLowerCase())
            );
        }
        const tbody = document.getElementById('atendimentosTableBody');
        tbody.innerHTML = '';

        if(atendimentos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#888;">Nenhum atendimento encontrado.</td></tr>`
            return;
        }

        atendimento.forEach(at => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
            <td>${at.nome_paciente}</td>
            <td>${at.nome_veterinario}</td>
            <td>${at.diagnostico}</td>
            <td>${at.tratamento}</td>
            <td>${at.nome_funcionario_cadastrante}</td>
            <td>${at.data}</td>
            <td>
                <a href="excluir.html?tabela=atendimentos&id=${at.id}">
                    <button class="acao-btn deletar">🗑️<button>
                </a>
                <button class="acao-btn editar" data-id="${at.id}">✏️</button>
                </td>
                `;

                tbody.appendChild(tr);
        });
    } catch (error) {
        alert('Erro ao carregar: ' + error.message);
    }
}

// Busca 
document.getElementById('searchInput').addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        const busca = e.target.value;
        carregarAtendimentos(busca);
    }
});

carregarAtendimentos();