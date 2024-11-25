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

// Verifica se a requisição é GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Consulta para buscar os serviços reservados (ajustando para a tabela 'tb_appointments' e incluindo 'image')
    $comandoSQL = "SELECT id, service, date, time, professional, price, image FROM tb_appointments";

    $resultado = $conn->query($comandoSQL);

    if (!$resultado) {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao executar a consulta: " . $conn->error]);
        $conn->close();
        exit;
    }

    // Converte os resultados para um array
    $appointments = [];
    while ($row = $resultado->fetch_assoc()) {
        $appointments[] = [
            "id" => $row["id"],
            "service" => $row["service"],
            "date" => $row["date"],
            "time" => $row["time"],
            "professional" => $row["professional"],
            "price" => $row["price"],
            "image" => $row["image"]  // Adicionando o campo 'image' ao array
        ];
    }

    // Retorna os resultados em JSON
    http_response_code(200);
    echo json_encode($appointments);

} else {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido. Use GET."]);
}

$conn->close();

?>
