document.getElementById("formsUsuario").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Coleta os valores dos campos do formulário
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());

    // Verifica se a senha e a confirmação da senha são iguais
    if (userData.senha !== userData['confirmaSenha']) {
        alert("As senhas não coincidem. Por favor, tente novamente.");
        return;  // Impede o envio do formulário
    }

    try {
        // Configura e realiza a requisição com fetch
        const response = await fetch(".../back-end/api/register.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const result = await response.text();
            console.log("Cadastro realizado com sucesso: " + result);
            //window.location.href = "menu.html";
        } else {
            console.log("Erro na requisição: " + response.status);
            //window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Erro ao realizar a requisição:", error);
        //window.location.href = "index.html";
    }
});