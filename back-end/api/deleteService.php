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
    $id = trim($data['id'] ?? ''); // ID da reserva a ser excluída

    // Verifica se o ID foi fornecido
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(["erro" => "ID da reserva é necessário para a exclusão."]);
        $conn->close();
        exit;
    }

    // Prepara a consulta SQL para exclusão da reserva
    $comandoSQL = "DELETE FROM tb_appointments WHERE id = ?";
    $stmt = $conn->prepare($comandoSQL);

    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao preparar a consulta: " . $conn->error]);
        $conn->close();
        exit;
    }

    // Vincula os parâmetros da consulta
    $stmt->bind_param("i", $id);

    // Executa a consulta e verifica o resultado
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(200);
            echo json_encode(["mensagem" => "Reserva excluída com sucesso!"]);
        } else {
            http_response_code(400);
            echo json_encode(["erro" => "Nenhuma reserva encontrada com esse ID."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao excluir a reserva: " . $stmt->error]);
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido. Use POST."]);
}

$conn->close();
?>
