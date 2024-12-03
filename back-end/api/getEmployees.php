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
    // Consulta SQL para buscar os dados dos funcionários
    $comandoSQL = "SELECT id_employee, name_employee, cpf_employee, cargo_employee, horarios FROM tb_employee"; // Ajuste a tabela conforme necessário

    $resultado = $conn->query($comandoSQL);

    // Verifica se houve erro na consulta
    if (!$resultado) {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao executar a consulta: " . $conn->error]);
        $conn->close();
        exit;
    }

    // Cria um array para armazenar os dados dos funcionários
    $employees = [];
    while ($row = $resultado->fetch_assoc()) {
        // Certifique-se de usar os mesmos nomes de colunas definidos na consulta SQL
        $employees[] = [
            "id" => $row["id_employee"],       // Use o nome correto da coluna
            "name" => $row["name_employee"],   // Use o nome correto da coluna
            "cpf" => $row["cpf_employee"],     // Use o nome correto da coluna
            "role" => $row["cargo_employee"],  // Use o nome correto da coluna
            "schedule" => $row["horarios"]     // Use o nome correto da coluna
        ];
    }

    // Retorna os dados dos funcionários como JSON
    http_response_code(200);
    echo json_encode($employees);

} else {
    // Caso o método não seja GET, retorna erro
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido. Use GET."]);
}

// Fecha a conexão com o banco de dados
$conn->close();

?>
