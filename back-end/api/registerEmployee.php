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
    $cpf = trim($data['cpf'] ?? '');
    $role = trim($data['role'] ?? '');
    $schedule = trim($data['schedule'] ?? '');

    // Validação básica dos dados
    if (empty($name) || empty($cpf) || empty($role) || empty($schedule)) {
        http_response_code(400);
        echo json_encode(["erro" => "Todos os campos são obrigatórios."]);
        exit;
    }

    // Prepara a consulta SQL para inserção
    $comandoSQL = "INSERT INTO tb_employee (name_employee, cpf_employee, cargo_employee, horarios) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($comandoSQL);

    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao preparar a consulta: " . $conn->error]);
        $conn->close();
        exit;
    }

    // Vincula os parâmetros da consulta
    $stmt->bind_param("ssss", $name, $cpf, $role, $schedule);

    // Executa a consulta e verifica o resultado
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["mensagem" => "Funcionário adicionado com sucesso!"]);
    } else {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao salvar o funcionário: " . $stmt->error]);
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido. Use POST."]);
}

$conn->close();

?>
