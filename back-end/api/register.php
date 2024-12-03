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
    $confirmaSenha = trim($data['confirmaSenha'] ?? '');

    // Validações
    if (empty($nome) || empty($email) || empty($cpf) || empty($telefone) || empty($senha) || empty($confirmaSenha)) {
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

    if ($senha !== $confirmaSenha) {
        http_response_code(400);
        echo json_encode(["erro" => "As senhas não coincidem."]);
        $conn->close();
        exit;
    }

    // Validações específicas para CPF e telefone
    if (!preg_match('/^\d{3}\.\d{3}\.\d{3}-\d{2}$/', $cpf)) {
        http_response_code(400);
        echo json_encode(["erro" => "CPF inválido: Use o formato XXX.XXX.XXX-XX."]);
        $conn->close();
        exit;
    }

    if (!preg_match('/^\d{11}$/', $telefone)) {
        http_response_code(400);
        echo json_encode(["erro" => "Telefone inválido: Use apenas números (11 dígitos, incluindo o DDD)."]);
        $conn->close();
        exit;
    }

    // Verifica se o email já está cadastrado
    $comandoSQLVerificar = "SELECT * FROM tb_user WHERE user_email = ?";
    $stmtVerificar = $conn->prepare($comandoSQLVerificar);

    if (!$stmtVerificar) {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao preparar a verificação: " . $conn->error]);
        $conn->close();
        exit;
    }

    $stmtVerificar->bind_param("s", $email);
    $stmtVerificar->execute();
    $resultado = $stmtVerificar->get_result();

    if ($resultado->num_rows > 0) {
        http_response_code(409); // Conflito
        echo json_encode(["erro" => "Já existe um usuário cadastrado com este email."]);
        $stmtVerificar->close();
        $conn->close();
        exit;
    }
    $stmtVerificar->close();

    // Criptografa a senha usando password_hash com ARGON2I
    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

    // Prepara a consulta SQL para inserção
    $comandoSQL = "INSERT INTO tb_user (user_name, user_email, user_cpf, user_telefone, user_senha) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($comandoSQL);

    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao preparar a consulta: " . $conn->error]);
        $conn->close();
        exit;
    }

    $stmt->bind_param("sssss", $nome, $email, $cpf, $telefone, $senhaHash);

    // Executa a consulta e verifica o resultado
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
