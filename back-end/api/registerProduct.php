<?php

// Configuração de conexão com o banco de dados
$servidor = "localhost";
$username = "root";
$senha = "";
$database = "clinica-estetica";

$conn = new mysqli($servidor, $username, $senha, $database);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["erro" => "Conexão com o banco de dados falhou: " . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decodifica o JSON recebido no corpo da requisição
    $data = json_decode(file_get_contents('php://input'), true);

    // Extrai os dados do JSON
    $name = trim($data['name'] ?? '');
    $description = trim($data['description'] ?? '');
    $price = trim($data['price'] ?? '');

    // Validação básica dos dados
    if (empty($name) || empty($description) || empty($price)) {
        http_response_code(400);
        echo json_encode(["erro" => "Todos os campos são obrigatórios."]);
        exit;
    }

    // Prepara a consulta SQL para inserção
    $comandoSQL = "INSERT INTO tb_product (name_product, description_product, price_product) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($comandoSQL);

    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao preparar a consulta: " . $conn->error]);
        $conn->close();
        exit;
    }

    // Vincula os parâmetros da consulta
    // Todos os parâmetros são tratados como VARCHAR
    $stmt->bind_param("sss", $name, $description, $price);

    // Executa a consulta e verifica o resultado
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["mensagem" => "Produto adicionado com sucesso!"]);
    } else {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao salvar o produto: " . $stmt->error]);
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido. Use POST."]);
}

$conn->close();

?>
