document.addEventListener('DOMContentLoaded', () => {
  const sidebarLinks = document.querySelectorAll('.sidebar nav ul li a');

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();

      const destino = link.getAttribute('href');
      const textoLink = link.textContent.trim().toLowerCase();

      const cargo = localStorage.getItem('cargo');

      if (textoLink === 'funcionários' && cargo !== 'administrador') {
        alert('Acesso negado. Apenas administradores podem acessar a página Funcionários.');
        return; // bloqueia o acesso
      }

      window.location.href = destino;
    });
  });
});

