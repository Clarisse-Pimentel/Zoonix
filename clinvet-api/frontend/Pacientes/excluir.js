document.addEventListener("DOMContentLoaded", () => {
  const btnCancelar = document.querySelector(".btn-cancelar");
  const btnConfirmar = document.querySelector(".btn-adicionar");

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    alert("ID do paciente não informado.");
    window.location.href = "index.html";
    return;
  }

  btnCancelar.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  btnConfirmar.addEventListener("click", async () => {
    try {
      const resposta = await fetch(`http://localhost:3000/pacientes/${id}`, {
        method: "DELETE"
      });

      if (!resposta.ok) {
        alert("Erro ao excluir o paciente.");
        return;
      }

      alert("Paciente excluído com sucesso!");
      window.location.href = "index.html";
    } catch (error) {
      alert("Erro ao conectar com o servidor: " + error.message);
    }
  });
});
