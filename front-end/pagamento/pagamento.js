// Seleciona os elementos de input
const creditOption = document.getElementById("creditOption");
const pixOption = document.getElementById("pixOption");
const rightContent = document.getElementById("rightContent");

// Função para pegar os parâmetros da URL
function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    
    // Itera sobre todos os parâmetros da URL
    for (const [key, value] of urlParams.entries()) {
        params[key] = decodeURIComponent(value);
    }

    return params;
}

// Função para exibir conteúdo do Pix
const showPixContent = () => {
    rightContent.innerHTML = `
        <form class="pix-form">
            <h3>Pagamento com Pix</h3>
            <p>Escaneie o QR Code abaixo para realizar o pagamento:</p>
            <img src="../public/imagens/qr-code.svg" alt="QR Code Pix">
            <label for="pixKey">Chave Pix:</label>
            <input type="text" id="pixKey" placeholder="Digite sua chave Pix">
            <button type="submit" id="submitPix">Enviar</button>
        </form>
    `;
    addSubmitListener();
};

// Função para exibir conteúdo do Cartão de Crédito
const showCreditContent = () => {
    rightContent.innerHTML = `
        <form class="credit-form">
            <h3>Informações do Cartão de Crédito</h3>
            <label for="cardNumber">Número do Cartão:</label>
            <input type="text" id="cardNumber" placeholder="Digite o número do cartão">
            <label for="cardName">Nome no Cartão:</label>
            <input type="text" id="cardName" placeholder="Digite o nome no cartão">
            <label for="cardExpiry">Validade:</label>
            <input type="text" id="cardExpiry" placeholder="MM/AA">
            <label for="cardCVC">CVC:</label>
            <input type="text" id="cardCVC" placeholder="Digite o CVC">
            <button type="submit" id="submitCredit">Pagar</button>
        </form>
    `;
    addSubmitListener();
};

// Listener para Pix
pixOption.addEventListener("change", showPixContent);

// Listener para Cartão de Crédito
creditOption.addEventListener("change", showCreditContent);

// Adiciona o evento de envio dinamicamente
const addSubmitListener = () => {
    const form = rightContent.querySelector("form");
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Captura os parâmetros da URL
            const queryParams = getQueryParams();
            console.log(JSON.stringify(queryParams))

            try {
                // Envia os dados para o backend
                const response = await sendFormData(queryParams);

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
    }
};

// Função para enviar os dados do formulário via fetch
async function sendFormData(data) {
    return fetch("/clinica-estetica/back-end/api/registerService.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Corrigido para usar os dados corretos
    });
}

// Funções para tratar o sucesso, erro e erros de requisição
function handleSuccess(result) {
    console.log("Cadastro realizado com sucesso:", result);
    window.location.assign("http://localhost/clinica-estetica/front-end/home/home.html");
}

function handleError(errorData) {
    console.error("Erro no cadastro:", errorData);
    alert("Houve um problema ao processar seu cadastro. Verifique as informações e tente novamente.");
}

function handleRequestError(error) {
    console.error("Erro na requisição:", error);
    alert("Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.");
}

function redirectToCar() {
    window.location.assign("http://localhost/clinica-estetica/front-end/carrinho/carrinho.html");
}

// Exibe Pix por padrão
showPixContent();