/*document.addEventListener("DOMContentLoaded", () => {
    // Selecionar o primeiro carrossel
    const track1 = document.querySelector(".carousel-container .coiteiner");
    const cards1 = document.querySelectorAll(".carousel-container .card");
    const prevButton1 = document.querySelector(".carousel-container .carousel-button.prev");
    const nextButton1 = document.querySelector(".carousel-container .carousel-button.next");

    // Verificar se todos os elementos existem
    if (track1 && cards1.length > 0 && prevButton1 && nextButton1) {
        let currentIndex1 = 0;
        const cardWidth1 = cards1[0].offsetWidth + 20; // Inclui margem (ajustar se necessário)

        // Função para atualizar a posição do carrossel
        const updateCarousel1 = () => {
            track1.style.transform = `translateX(-${currentIndex1 * cardWidth1}px)`;
        };

        // Evento de clique no botão anterior
        prevButton1.addEventListener("click", () => {
            if (currentIndex1 > 0) {
                currentIndex1--;
                updateCarousel1();
            }
        });

        // Evento de clique no botão próximo
        nextButton1.addEventListener("click", () => {
            const visibleCards1 = Math.floor(track1.parentElement.offsetWidth / cardWidth1);
            if (currentIndex1 < cards1.length - visibleCards1) {
                currentIndex1++;
                updateCarousel1();
            }
        });
    } else {
        console.error("Erro: Elementos do carrossel não encontrados!");
    }
});*/

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