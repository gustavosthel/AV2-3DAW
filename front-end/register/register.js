// Adiciona o evento de submit ao formulário
document.getElementById("formsUsuario").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Limpa mensagens de erro e campos com erro
    clearErrorMessages();

    // Coleta os dados do formulário
    const userData = getFormData(event.target);

    try {
        // Envia os dados para o backend
        const response = await sendFormData(userData);

        // Processa a resposta da requisição
        if (response.ok) {
            const result = await response.json();
            handleSuccess(result);
        } else {
            const errorData = await response.json();
            handleError(errorData);
        }
    } catch (error) {
        handleRequestError(error);
    }
});

// Função para limpar mensagens de erro e estilos de erro
function clearErrorMessages() {
    document.querySelectorAll(".erro-msg").forEach((msg) => msg.remove());
    document.querySelectorAll(".input-erro").forEach((input) => input.classList.remove("input-erro"));
}

// Função para coletar os dados do formulário
function getFormData(form) {
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
}

// Função para enviar os dados do formulário via fetch
async function sendFormData(userData) {
    return fetch("/clinica-estetica/back-end/api/register.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
}

// Função para tratar sucesso na requisição
function handleSuccess(result) {
    console.log("Cadastro realizado com sucesso:", result);
    window.location.assign("http://localhost/clinica-estetica/front-end/home/home.html")
}

// Função para tratar erros da requisição
function handleError(errorData) {
    console.error("Erro na requisição:", errorData.erro);

    const fieldMapping = {
        nome: "nome",
        email: "email",
        cpf: "cpf",
        telefone: "telefone",
        senha: "senha",
        confirmaSenha: "confirmaSenha",
    };

    let firstErrorFieldFocused = false;

    // Exibe mensagens de erro e marca os campos com erro
    for (const [field, inputId] of Object.entries(fieldMapping)) {
        if (errorData.erro.toLowerCase().includes(field)) {
            const input = document.getElementById(inputId);
            showErrorMessage(input, errorData.erro, firstErrorFieldFocused);
            if (!firstErrorFieldFocused) {
                input.focus();
                firstErrorFieldFocused = true;
            }
        }
    }
}

// Função para exibir mensagens de erro nos campos
function showErrorMessage(input, errorMessageText, isFirstError) {
    const errorMessage = document.createElement("div");
    errorMessage.textContent = errorMessageText;
    errorMessage.className = "erro-msg";
    
    // Insere a mensagem acima do input
    input.parentNode.insertBefore(errorMessage, input);

    // Adiciona classe de erro ao input
    input.classList.add("input-erro");

    // Foca no primeiro campo com erro, caso necessário
    if (!isFirstError) {
        input.focus();
    }
}

// Função para tratar erros inesperados na requisição
function handleRequestError(error) {
    console.error("Erro ao realizar a requisição:", error);
    alert("Erro inesperado. Por favor, tente novamente.");
}
