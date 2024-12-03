<?php

// Configuração de conexão com o banco de dados
$servidor = "localhost";
$username = "root";
$senha = "";
$database = "clinica-estetica";

// Conectar ao banco de dados
$conn = new mysqli($servidor, $username, $senha, $database);

// Verifica se a conexão falhou
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["erro" => "Conexão com o banco de dados falhou: " . $conn->connect_error]);
    exit;
}

// Verifica se a requisição é do tipo GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Consulta SQL para buscar os dados dos produtos
    $comandoSQL = "SELECT id_product, name_product, price_product, description_product FROM tb_product"; 

    $resultado = $conn->query($comandoSQL);

    // Verifica se houve erro na consulta
    if (!$resultado) {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao executar a consulta: " . $conn->error]);
        $conn->close();
        exit;
    }

    // Cria um array para armazenar os dados dos produtos
    $products = [];
    while ($row = $resultado->fetch_assoc()) {
        // Certifique-se de usar os nomes de colunas definidos na consulta SQL
        $products[] = [
            "id_product" => $row["id_product"],            // ID do produto
            "name_product" => $row["name_product"],        // Nome do produto
            "price_product" => $row["price_product"],      // Preço do produto
            "description_product" => $row["description_product"]  // Descrição do produto
        ];
    }

    // Retorna os dados dos produtos como JSON
    http_response_code(200);
    echo json_encode($products);

} else {
    // Caso o método não seja GET, retorna erro
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido. Use GET."]);
}

// Fecha a conexão com o banco de dados
$conn->close();

?>
