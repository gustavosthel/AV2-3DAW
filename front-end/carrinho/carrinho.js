// Função para buscar os dados do backend
async function fetchReservations() {
    try {
        // Faz a requisição GET para o backend
        const response = await fetch("/clinica-estetica/back-end/api/getServices.php", {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar reservas: " + response.statusText);
        }

        // Converte a resposta em JSON
        const reservations = await response.json();

        // Verifica se há dados retornados
        if (!Array.isArray(reservations) || reservations.length === 0) {
            alert("Nenhuma reserva encontrada.");
            return;
        }

        // Chama a função para exibir os dados na página
        displayReservations(reservations);
    } catch (error) {
        console.error("Erro ao buscar reservas:", error);
        alert("Não foi possível carregar as reservas. Tente novamente mais tarde.");
    }
}

// Função para exibir os dados na página
function displayReservations(reservations) {
    const container = document.getElementById("cards-container");

    // Limpa o conteúdo atual (se necessário)
    container.innerHTML = "";

    // Itera pelas reservas e cria os cards
    reservations.forEach((reservation) => {
        const card = document.createElement("div");
        card.classList.add("card");

        // Monta o conteúdo do card com os dados retornados do backend
        card.innerHTML = `
            <img src="${reservation.image || '/default-image.jpg'}" alt="Imagem do Serviço">
            <h4>${reservation.service || 'Serviço não informado'}</h4>
            <p>Data marcada: ${reservation.date || 'Data não informada'}</p>
            <p>Hora: ${reservation.time || 'Hora não informada'}</p>
            <p>Profissional: ${reservation.professional || 'Profissional não informado'}</p>
            <p>Preço: R$ ${reservation.price || '0,00'}</p>
            <div class="button">
                <button onclick="alterReservation(${reservation.id})">Alterar</button>
                <button onclick="cancelReservation(${reservation.id})">Cancelar Reserva</button>
            </div>
        `;

        // Adiciona o card ao contêiner
        container.appendChild(card);
    });
}

// Funções para manipular as reservas (opcionais)
function alterReservation(id) {
    alert(`Alterar reserva com ID: ${id}`);
    // Adicione a lógica para alterar a reserva
}

function cancelReservation(id) {
    if (confirm("Tem certeza que deseja cancelar esta reserva?")) {
        // Lógica para cancelar a reserva
        console.log(`Reserva ${id} cancelada.`);
    }
}

// Chama a função para buscar e exibir as reservas ao carregar a página
document.addEventListener("DOMContentLoaded", fetchReservations);
