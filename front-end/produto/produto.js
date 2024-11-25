// Função para pegar o valor da query string
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Quando a página carregar, capturar os parâmetros da URL e definir a imagem, nome e preço
window.onload = function() {
  const imageSrc = getQueryParam('image');
  const serviceName = getQueryParam('name');
  const price = getQueryParam('price');

  // Decodificando os parâmetros
  const decodedImageSrc = decodeURIComponent(imageSrc);
  const decodedServiceName = decodeURIComponent(serviceName);
  const decodedPrice = decodeURIComponent(price);

  // Atualizando os elementos com os valores decodificados
  if (decodedImageSrc) {
      document.getElementById('selected-image').src = decodedImageSrc;
  } else {
      document.querySelector('.image-page').innerHTML = '<p>Imagem não encontrada.</p>';
  }

  if (decodedServiceName) {
      document.getElementById('service-name').innerText = `Como funciona o ${decodedServiceName}?`;
      document.getElementById('service-name-details').innerText = decodedServiceName;  // Atualiza o nome do serviço na seção de detalhes
  } else {
      document.querySelector('.service-name').innerHTML = '<p>Nome do serviço não encontrado.</p>';
  }

  if (decodedPrice) {
      document.getElementById('service-price').innerText = decodedPrice;
  } else {
      document.querySelector('.service-price').innerHTML = '<p>Preço não encontrado.</p>';
  }
}

function returnPage() {
    // Usando window.location.assign() para redirecionar para home.html com a imagem na URL
    window.location.assign("http://localhost/clinica-estetica/front-end/home/home.html");
} 

function agendarHorario() {
  const imageSrc = getQueryParam('image');
  const serviceName = getQueryParam('name');
  const price = getQueryParam('price');

  // Redireciona para a página agendar-horario com os parâmetros
  window.location.assign(
      `http://localhost/clinica-estetica/front-end/agendar-horario/agendar-horario.html?image=${encodeURIComponent(imageSrc)}&name=${encodeURIComponent(serviceName)}&price=${encodeURIComponent(price)}`
  );
}

function redirectToCar() {
    window.location.assign("http://localhost/clinica-estetica/front-end/carrinho/carrinho.html");
}