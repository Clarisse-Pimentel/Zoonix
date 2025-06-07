document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-cadastro");
  const btnCancelar = document.querySelector(".btn-cancelar");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const paciente = {
      nome: form.nome.value.trim(),
      raca: form.raca.value.trim(),
      especie: form.especie.value.trim(),
      sexo: form.sexo.value.trim(),
      idade: parseInt(form.idade.value),
      tutor: form.tutor.value.trim(),
      telefone_tutor: form.telefone.value.trim() // note que no backend o campo é telefone_tutor
    };

    try {
      const response = await fetch('http://localhost:3000/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paciente)
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert('Erro ao cadastrar paciente: ' + errorText);
        return;
      }

      alert('Paciente cadastrado com sucesso!');
      window.location.href = "index.html"; // Redireciona para a listagem

    } catch (error) {
      alert('Erro na conexão com o servidor: ' + error.message);
    }
  });

  btnCancelar.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
