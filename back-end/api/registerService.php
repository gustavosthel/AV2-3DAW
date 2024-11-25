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
    $image = trim($data['image'] ?? '');  // Aqui estamos pegando a URL da imagem
    $professional = trim($data['professional'] ?? '');
    $date = trim($data['date'] ?? '');
    $time = trim($data['time'] ?? '');
    $service = trim($data['service'] ?? '');
    $price = trim($data['price'] ?? '');

    // Prepara a consulta SQL para inserção, incluindo a imagem
    $comandoSQL = "INSERT INTO tb_appointments (image, professional, date, time, service, price) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($comandoSQL);

    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao preparar a consulta: " . $conn->error]);
        $conn->close();
        exit;
    }

    // Vincula os parâmetros da consulta, incluindo a imagem
    $stmt->bind_param("ssssss", $image, $professional, $date, $time, $service, $price);

    // Executa a consulta e verifica o resultado
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["mensagem" => "Agendamento registrado com sucesso!"]);
    } else {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao salvar o agendamento: " . $stmt->error]);
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido. Use POST."]);
}

$conn->close();

?>
