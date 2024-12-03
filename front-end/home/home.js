document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".coiteiner");
    const cards = Array.from(document.querySelectorAll(".card"));
    const prevButton = document.querySelector(".carousel-button.prev");
    const nextButton = document.querySelector(".carousel-button.next");

    if (track && cards.length > 0 && prevButton && nextButton) {
        let currentIndex = 0;
        const cardWidth = cards[0].offsetWidth + 20; // Ajuste para incluir a margem
        const visibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);

        // Clonar elementos para criar efeito infinito
        const cloneFirst = cards.slice(0, visibleCards).map(card => card.cloneNode(true));
        const cloneLast = cards.slice(-visibleCards).map(card => card.cloneNode(true));
        cloneFirst.forEach(clone => track.appendChild(clone));
        cloneLast.forEach(clone => track.insertBefore(clone, track.firstChild));

        // Atualizar o índice inicial para refletir a nova posição após a clonagem
        currentIndex = visibleCards;
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        const updateCarousel = () => {
            track.style.transition = "transform 0.5s ease-in-out";
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

            // Verifica se estamos em um dos clones e reseta a posição
            if (currentIndex === 0) {
                setTimeout(() => {
                    track.style.transition = "none";
                    currentIndex = cards.length;
                    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
                }, 500);
            } else if (currentIndex === cards.length + visibleCards) {
                setTimeout(() => {
                    track.style.transition = "none";
                    currentIndex = visibleCards;
                    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
                }, 500);
            }
        };

        prevButton.addEventListener("click", () => {
            currentIndex--;
            updateCarousel();
        });

        nextButton.addEventListener("click", () => {
            currentIndex++;
            updateCarousel();
        });

        // Responde ao redimensionamento
        window.addEventListener("resize", () => {
            track.style.transition = "none";
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        });
    }
});

// Função para redirecionar para a página produto.html com imagem, nome e preço como parâmetros
function selectService(imageSrc, serviceName, price) {
    const url = new URL("http://localhost/clinica-estetica/front-end/produto/produto.html");
    url.searchParams.append("image", encodeURIComponent(imageSrc));
    url.searchParams.append("name", encodeURIComponent(serviceName));
    url.searchParams.append("price", encodeURIComponent(price));

    window.location.assign(url);
}

function redirectToCar() {
    window.location.assign("http://localhost/clinica-estetica/front-end/carrinho/carrinho.html");
}