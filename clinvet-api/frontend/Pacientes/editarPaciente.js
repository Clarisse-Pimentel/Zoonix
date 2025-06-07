document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector(".form-edicao");
  const btnCancelar = document.querySelector(".btn-cancelar");

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    alert("ID do paciente não encontrado.");
    window.location.href = "index.html";
    return;
  }

  const urlBase = "http://localhost:3000/pacientes";

  try {
    // Buscar dados do paciente pelo backend
    const resposta = await fetch(`${urlBase}/${id}`);
    if (!resposta.ok) throw new Error("Paciente não encontrado no backend.");
    const paciente = await resposta.json();

    // Preencher formulário
    form.nome.value = paciente.nome || '';
    form.raca.value = paciente.raca || '';
    form.especie.value = paciente.especie || '';
    form.sexo.value = paciente.sexo || '';
    form.idade.value = paciente.idade || '';

    // Submeter edição
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const dadosAtualizados = {
        nome: form.nome.value.trim(),
        raca: form.raca.value.trim(),
        especie: form.especie.value.trim(),
        sexo: form.sexo.value.trim(),
        idade: parseInt(form.idade.value),
        tutor: paciente.tutor,
        telefone_tutor: paciente.telefone_tutor
      };

      const respostaEdicao = await fetch(`${urlBase}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosAtualizados)
      });

      if (!respostaEdicao.ok) {
        alert("Erro ao salvar alterações.");
        return;
      }

      alert("Paciente editado com sucesso!");
      window.location.href = "index.html"; // ou "../Pacientes/index.html"
    });

  } catch (error) {
    alert("Erro ao carregar paciente: " + error.message);
    window.location.href = "index.html";
  }

  // Botão cancelar
  btnCancelar.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "index.html";
  });
});
