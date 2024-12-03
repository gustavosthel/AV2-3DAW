-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 03/12/2024 às 13:08
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `clinica-estetica`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_appointments`
--

CREATE TABLE `tb_appointments` (
  `id` int(11) NOT NULL,
  `professional` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `service` varchar(255) NOT NULL,
  `price` varchar(50) NOT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tb_appointments`
--

INSERT INTO `tb_appointments` (`id`, `professional`, `date`, `time`, `service`, `price`, `image`) VALUES
(4, 'Andre', '2024-11-20', '19:46:00', 'Cabeleleiro', 'R$423,65', '../public/imagens/card1.png');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_employee`
--

CREATE TABLE `tb_employee` (
  `id_employee` int(11) NOT NULL,
  `name_employee` varchar(255) NOT NULL,
  `cpf_employee` varchar(255) NOT NULL,
  `cargo_employee` varchar(255) NOT NULL,
  `horarios` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tb_employee`
--

INSERT INTO `tb_employee` (`id_employee`, `name_employee`, `cpf_employee`, `cargo_employee`, `horarios`) VALUES
(1, 'Gustavo', '123.434.546-21', 'Cabeleleiro', 'Segunda: 10:00 - 18:00'),
(2, 'Giovana', '029.813.157-34', 'Manicure', 'Sábado: 09:00 - 13:00'),
(4, 'Teste', '123.434.546-21', 'Cabeleleiro', 'Quinta: 14:00 - 20:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_product`
--

CREATE TABLE `tb_product` (
  `id_product` int(11) NOT NULL,
  `name_product` varchar(255) NOT NULL,
  `price_product` varchar(255) NOT NULL,
  `description_product` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tb_product`
--

INSERT INTO `tb_product` (`id_product`, `name_product`, `price_product`, `description_product`) VALUES
(1, 'Manicure', '223,35', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'),
(3, 'Maquiagens', '113,00', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'),
(4, 'Sobrancelhas', '93,00', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'),
(5, 'Cabeleleiro', '423,65', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_user`
--

CREATE TABLE `tb_user` (
  `id_user` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_cpf` varchar(14) DEFAULT NULL,
  `user_telefone` varchar(15) DEFAULT NULL,
  `user_senha` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tb_user`
--

INSERT INTO `tb_user` (`id_user`, `user_name`, `user_email`, `user_cpf`, `user_telefone`, `user_senha`) VALUES
(5, 'Gustavo', 'gustavo@gmail.com', '123.434.546-21', '21991578145', '$argon2i$v=19$m=65536,t=4,p=1$REh6Li9COFNKVTRBd0ljbw$zq4WvcxPzlJWEECte4fTtCTU8iKCeLlxUEjvMLKkU+8'),
(6, 'Admin', 'admin@admin.com', '123.434.546-21', '21991578145', '$argon2i$v=19$m=65536,t=4,p=1$N3dLWThoWmZwbmhFNWhJbw$VvU6gdn11rRu/KVJYKhRcIQYKckf1A4tWSFPEcQq1Tw');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `tb_appointments`
--
ALTER TABLE `tb_appointments`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `tb_employee`
--
ALTER TABLE `tb_employee`
  ADD PRIMARY KEY (`id_employee`);

--
-- Índices de tabela `tb_product`
--
ALTER TABLE `tb_product`
  ADD PRIMARY KEY (`id_product`);

--
-- Índices de tabela `tb_user`
--
ALTER TABLE `tb_user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `tb_appointments`
--
ALTER TABLE `tb_appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de tabela `tb_employee`
--
ALTER TABLE `tb_employee`
  MODIFY `id_employee` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `tb_product`
--
ALTER TABLE `tb_product`
  MODIFY `id_product` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `tb_user`
--
ALTER TABLE `tb_user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
