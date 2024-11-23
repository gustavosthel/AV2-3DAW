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

    $email = trim($data['email'] ?? '');
    $senha = trim($data['senha'] ?? '');

    // Validações
    if (empty($email) || empty($senha)) {
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

    // Verifica se o email está cadastrado
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

    // Verifica se o usuário existe
    if ($resultado->num_rows == 0) { // Corrigido para verificar se o usuário não foi encontrado
        http_response_code(404); // Não encontrado
        echo json_encode(["erro" => "O usuário não existe no nosso sistema. Faça o registro."]);
        $stmtVerificar->close();
        $conn->close();
        exit;
    } else {
        http_response_code(200);
        echo json_encode(["mensagem" => "Usuário logado com sucesso!"]);
    }

    $stmtVerificar->close();

} else {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido. Use POST."]);
}

$conn->close();

?>
