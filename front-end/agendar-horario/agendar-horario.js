function converterParaMinutos(horario) {
    const [horas, minutos] = horario.split(':').map(Number);
    return horas * 60 + minutos;
}

function converterParaMinutos2(horario) {
    // Substituindo o "-" por ":" para adaptar ao formato "HH:MM"
    const horarioFormatado = horario.replace('-', ':');
    
    const [horas, minutos] = horarioFormatado.split(':').map(Number);
    return horas * 60 + minutos;
}

function filterProfessionals() {
    const dateInput = document.getElementById("dateInput").value;
    const timeInput = document.getElementById("timeInput").value;
    
    if (!dateInput || !timeInput) {
        alert("Por favor, preencha data e horário!");
        return;
    }
    
    // Garantir que a data seja tratada no fuso horário local
    const dateParts = dateInput.split("-"); // Divide o formato "YYYY-MM-DD"
    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); // Ano, mês (0-indexado), dia

    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const diaSemana = dias[date.getDay()];
    
    const horaMinutos = converterParaMinutos(timeInput);
    
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const scheduleData = card.getAttribute('data-schedule');

        if (!scheduleData) return;
        
        const horarios = scheduleData.split(',');
        let disponivel = false; // Inicializa como false para cada cartão
        
        horarios.forEach(horario => {
            const parts = horario.trim().split(':');
            if (parts.length < 2) return;

            //console.log(parts)
            
            const dia = parts[0].trim();
            const inicio = parts[1].trim();
            const fim = parts[2].trim();

            if (!inicio || !fim) return;
            
            const inicioMinutos = converterParaMinutos2(inicio);
            const fimMinutos = converterParaMinutos2(fim);  

            // Verifica se o dia e horário estão dentro do intervalo
            if (dia === diaSemana && horaMinutos >= inicioMinutos && horaMinutos <= fimMinutos) {
                disponivel = true; // Definido como true se houver pelo menos um horário correspondente
            }
        });
        
        // Exibe o cartão apenas se houver um horário disponível correspondente
        card.style.display = disponivel ? 'block' : 'none';
    });
}

let serviceName = "";
let servicePrice = "";
let serviceImg = "";

// Função para obter o valor de um parâmetro da URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Quando a página carregar, capturar os parâmetros da URL
window.onload = function () {
    serviceImg = decodeURIComponent(getQueryParam("image" || "Serviço não especificado"))
    serviceName = decodeURIComponent(getQueryParam("name") || "Serviço não especificado");
    servicePrice = decodeURIComponent(getQueryParam("price") || "Preço não especificado");

    // Exemplo de como usar os valores (se necessário para outros elementos)
    console.log("Image:", serviceImg);
    console.log("Serviço:", serviceName);
    console.log("Preço:", servicePrice);
};

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("closeModal");
    const modalDetails = document.getElementById("modalDetails");
    const cards = document.querySelectorAll(".card");
    const dateInput = document.getElementById("dateInput");
    const timeInput = document.getElementById("timeInput");

    // Abrir modal ao clicar no botão "Selecionar"
    cards.forEach((card) => {
        const button = card.querySelector(".bnt-card");

        button.addEventListener("click", () => {
            const professionalName = card.querySelector("p").innerText;
            const date = dateInput.value;
            const time = timeInput.value;

            // Remove bordas vermelhas e mensagens de erro anteriores
            clearInputErrors();

            if (!date || !time) {
                if (!date) {
                    showInputError(dateInput, "Por favor, selecione uma data.");
                }
                if (!time) {
                    showInputError(timeInput, "Por favor, selecione um horário.");
                }
                return;
            }

            // Criar e estilizar os elementos dinamicamente
            modalDetails.innerHTML = ""; // Limpa o conteúdo anterior

            // Criar contêiner flexível
            const container = document.createElement("div");
            container.classList.add("modal-details-container"); // Classe para layout flexível

            // Criar imagem
            const img = document.createElement("img");
            img.src = serviceImg;
            img.alt = professionalName;
            img.classList.add("modal-image"); // Classe CSS para imagem

            // Criar contêiner para informações
            const infoContainer = document.createElement("div");
            infoContainer.classList.add("modal-info"); // Classe para informações

            // Adicionar informações ao contêiner
            const professional = document.createElement("p");
            professional.innerHTML = `<strong>Profissional:</strong> ${professionalName}`;
            professional.classList.add("modal-text");

            const dateInfo = document.createElement("p");
            dateInfo.innerHTML = `<strong>Data:</strong> ${date}`;
            dateInfo.classList.add("modal-text");

            const timeInfo = document.createElement("p");
            timeInfo.innerHTML = `<strong>Hora:</strong> ${time}`;
            timeInfo.classList.add("modal-text");

            const serviceInfo = document.createElement("p");
            serviceInfo.innerHTML = `<strong>Serviço:</strong> ${serviceName}`;
            serviceInfo.classList.add("modal-text");

            const priceInfo = document.createElement("p");
            priceInfo.innerHTML = `<strong>Preço:</strong> R$ ${servicePrice}`;
            priceInfo.classList.add("modal-text");

            // Botão de pagamento
            const paymentButton = document.createElement("button");
            paymentButton.textContent = "Ir para pagamento";
            paymentButton.classList.add("modal-button"); // Classe CSS para o botão

            // Adicionar evento ao botão dinamicamente
            paymentButton.addEventListener("click", () => {
                goToPaymentPage(serviceImg, professionalName, date, time, serviceName, servicePrice);
            });

            // Adicionar todos os elementos ao contêiner de informações
            infoContainer.appendChild(professional);
            infoContainer.appendChild(dateInfo);
            infoContainer.appendChild(timeInfo);
            infoContainer.appendChild(serviceInfo);
            infoContainer.appendChild(priceInfo);
            infoContainer.appendChild(paymentButton);

            // Adicionar imagem e contêiner de informações ao modal
            container.appendChild(img);
            container.appendChild(infoContainer);
            modalDetails.appendChild(container);

            // Exibir o modal e bloquear o scroll
            modal.style.display = "block";
            document.body.classList.add("no-scroll"); // Bloqueia o scroll
        });
    });

    // Fechar o modal
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        document.body.classList.remove("no-scroll"); // Libera o scroll
    });

    // Fechar modal clicando fora do conteúdo
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            document.body.classList.remove("no-scroll"); // Libera o scroll
        }
    });

    // Função para exibir mensagens de erro e bordas vermelhas
    function showInputError(input, message) {
        input.style.border = "2px solid red";

        // Cria a mensagem de erro
        const errorMessage = document.createElement("span");
        errorMessage.textContent = message;
        errorMessage.style.color = "red";
        errorMessage.style.fontSize = "12px";
        errorMessage.style.marginBottom = "5px";
        errorMessage.style.display = "block"; // Garante que fique como um bloco separado
        errorMessage.classList.add("error-message");

        // Insere a mensagem de erro acima do input
        input.parentElement.style.position = "relative"; // Garante que o posicionamento funcione corretamente
        input.parentElement.insertBefore(errorMessage, input);
    }

    // Função para limpar bordas vermelhas e mensagens de erro
    function clearInputErrors() {
        [dateInput, timeInput].forEach((input) => {
            input.style.border = "";
            const errorMessage = input.parentElement.querySelector(".error-message");
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    }
});


// Função para redirecionar para a página de pagamento com os dados como parâmetros
function goToPaymentPage(serviceImg, professionalName, date, time, serviceName, servicePrice) {
    const url = new URL("http://localhost/clinica-estetica/front-end/pagamento/pagamento.html");
    url.searchParams.append("image", encodeURIComponent(serviceImg));
    url.searchParams.append("professional", encodeURIComponent(professionalName));
    url.searchParams.append("date", encodeURIComponent(date));
    url.searchParams.append("time", encodeURIComponent(time));
    url.searchParams.append("service", encodeURIComponent(serviceName));
    url.searchParams.append("price", encodeURIComponent(servicePrice));

    window.location.assign(url); // Redireciona para a nova página
}

function redirectToCar() {
    window.location.assign("http://localhost/clinica-estetica/front-end/carrinho/carrinho.html");
}
