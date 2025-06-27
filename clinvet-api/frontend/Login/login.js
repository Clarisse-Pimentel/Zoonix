document.addEventListener('DOMContentLoaded', async () => {
  try {
    const resposta = await fetch('http://localhost:3000/verificar-primeiro-acesso');
    if (resposta.ok) {
      const dados = await resposta.json();
      if (dados.primeiroAcesso) {
        alert(dados.mensagem);
      }
    }
  } catch (erro) {
    console.error('Erro ao verificar primeiro acesso:', erro);
  }

  const form = document.querySelector('.form-container');
  const inputCpf = form.querySelector('#cpfLogin');
  const inputSenha = form.querySelector('input[placeholder="Senha"]');

  // Máscara de CPF
  inputCpf.addEventListener('input', () => {
    let cpf = inputCpf.value.replace(/\D/g, '');

    if (cpf.length > 11) cpf = cpf.slice(0, 11);

    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    inputCpf.value = cpf;
  });

  inputCpf.addEventListener('blur', () => {
    const cpf = inputCpf.value.replace(/\D/g, '');
    if (!/^\d{11}$/.test(cpf)) {
      inputCpf.classList.add('erro');
      inputCpf.setAttribute('aria-invalid', 'true');
    } else {
      inputCpf.classList.remove('erro');
      inputCpf.removeAttribute('aria-invalid');
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const cpf = inputCpf.value.replace(/\D/g, '');
    const senha = inputSenha.value.trim();

    if (!cpf || !senha) {
      alert('Por favor, preencha CPF e senha.');
      return;
    }

    if (!/^\d{11}$/.test(cpf)) {
      alert('O CPF deve conter exatamente 11 dígitos numéricos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        alert(data.mensagem);
        window.location.href = '../Menu/index.html';
      } else {
        alert(data.mensagem || 'Erro no login');
      }
    } catch (error) {
      alert('Erro ao conectar ao servidor');
      console.error(error);
    }
  });
});
