let reservations = [];

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
        reservations = await response.json();
        console.log(reservations)

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

function alterReservation(id) {
    console.log("ID recebido:", id);
    console.log("Reservas disponíveis no escopo global:", reservations);

    // Busca a reserva pelo ID, convertendo os tipos para garantir a correspondência
    const reservation = reservations.find((res) => res.id === String(id));
    if (!reservation) {
        console.error("Reserva com ID", id, "não encontrada.");
        alert("Reserva não encontrada.");
        return;
    }

    console.log("Reserva encontrada:", reservation);

    // Preenche os campos com as informações da reserva
    document.getElementById("serviceInput").value = reservation.service || ''; // Somente leitura
    document.getElementById("dateInput").value = reservation.date || ''; // Editável
    document.getElementById("timeInput").value = reservation.time || ''; // Editável
    document.getElementById("professionalInput").value = reservation.professional || ''; // Somente leitura

    // Exibe o modal
    const modal = document.getElementById("modalAlterReservation");
    modal.style.display = "flex";

    // Fecha o modal ao clicar no botão de fechar
    const closeModal = document.getElementById("closeModalAlterReservation");
    closeModal.onclick = () => {
        modal.style.display = "none";
    };

    // Fecha o modal ao clicar fora da área do conteúdo do modal
    modal.onclick = (e) => {
        if (e.target === modal) { // Verifica se o clique foi fora da área do conteúdo
            modal.style.display = "none";
        }
    };

    // Salva as alterações
    const form = document.getElementById("alterReservationForm");
    form.onsubmit = async (e) => {
        e.preventDefault();

        const updatedReservation = {
            id,
            service: document.getElementById("serviceInput").value, // Não será alterado
            date: document.getElementById("dateInput").value, // Data alterada
            time: document.getElementById("timeInput").value, // Horário alterado
            professional: document.getElementById("professionalInput").value, // Não será alterado
        };

        try {
            const response = await fetch(`/clinica-estetica/back-end/api/updateService.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedReservation),
            });

            if (response.ok) {
                modal.style.display = "none"; // Fecha o modal
                fetchReservations(); // Atualiza as reservas
            } else {
                throw new Error("Erro ao atualizar a reserva.");
            }
        } catch (error) {
            console.error("Erro ao atualizar reserva:", error);
            alert("Não foi possível atualizar a reserva.");
        }
    };
}

// Função para cancelar a reserva com confirmação via modal
function cancelReservation(id) {
    // Abre o modal de confirmação de exclusão
    const modal = document.getElementById("modalCancelReservation");
    const cancelButton = document.getElementById("cancelButton");
    const confirmButton = document.getElementById("confirmCancelButton");

    // Exibe o modal
    modal.style.display = "flex";

    // Fecha o modal ao clicar no botão de cancelar
    cancelButton.onclick = () => {
        modal.style.display = "none";
    };

    // Fecha o modal ao clicar no botão de fechar
    const closeModal = document.getElementById("closeModalCancel");
    closeModal.onclick = () => {
        modal.style.display = "none";
    };

    // Fecha o modal ao clicar fora da área do conteúdo do modal
    modal.onclick = (e) => {
        if (e.target === modal) { // Verifica se o clique foi fora da área do conteúdo
            modal.style.display = "none";
        }
    };

    // Quando o usuário confirmar a exclusão
    confirmButton.onclick = async () => {
        try {
            // Faz a requisição POST para excluir a reserva
            const response = await fetch(`/clinica-estetica/back-end/api/deleteService.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }) // Envia o ID da reserva a ser cancelada
            });

            if (response.ok) {
                modal.style.display = "none"; // Fecha o modal
                fetchReservations(); // Atualiza as reservas na página
            } else {
                throw new Error("Erro ao cancelar a reserva.");
            }
        } catch (error) {
            console.error("Erro ao cancelar reserva:", error);
            alert("Não foi possível cancelar a reserva.");
        }
    };
}


// Chama a função para buscar e exibir as reservas ao carregar a página
document.addEventListener("DOMContentLoaded", fetchReservations);
