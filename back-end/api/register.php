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
    $data = json_decode(file_get_contents('php://input'), true);

    $nome = trim($data['nome'] ?? '');
    $email = trim($data['email'] ?? '');
    $cpf = trim($data['cpf'] ?? '');
    $telefone = trim($data['telefone'] ?? '');
    $senha = trim($data['senha'] ?? '');

    if (empty($nome) || empty($email) || empty($cpf) || empty($telefone) || empty($senha)) {
        http_response_code(400);
        echo json_encode(["erro" => "Todos os campos devem ser preenchidos."]);
        $conn->close();
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["erro" => "Email inválido."]);
        $conn->close();
        exit;
    }

    $senhaHash = password_hash($senha, PASSWORD_BCRYPT);

    $comandoSQL = "INSERT INTO Usuarios (nome, email, cpf, telefone, senha) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($comandoSQL);
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao preparar a consulta: " . $conn->error]);
        $conn->close();
        exit;
    }

    $stmt->bind_param("sssss", $nome, $email, $cpf, $telefone, $senhaHash);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["mensagem" => "Usuário cadastrado com sucesso!"]);
    } else {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao salvar o usuário: " . $stmt->error]);
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido. Use POST."]);
}

$conn->close();

?>
