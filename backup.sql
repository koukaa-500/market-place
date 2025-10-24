-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 11 oct. 2025 à 13:45
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `e-commerce`
--

-- --------------------------------------------------------

--
-- Structure de la table `avis`
--

CREATE TABLE `avis` (
  `id` bigint(20) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE `category` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `category`
--

INSERT INTO `category` (`id`, `description`, `name`) VALUES
(1, 'Produits de soins de la peau, maquillage, compléments alimentaires et bien-être, pour prendre soin de vous au quotidien.', 'Santé & Beauté'),
(2, 'Découvrez les dernières tendances de la mode avec des vêtements, des chaussures et des accessoires pour hommes, femmes et enfants.', 'Mode'),
(3, 'Retrouvez une large gamme de produits électroniques, des téléviseurs aux ordinateurs portables, en passant par les smartphones et les accessoires.', 'Électronique'),
(4, 'Équipements sportifs, vêtements de sport et accessoires pour vos activités préférées, que ce soit à l\'intérieur ou à l\'extérieur.', 'Sport & Loisirs');

-- --------------------------------------------------------

--
-- Structure de la table `dynamic_attribute`
--

CREATE TABLE `dynamic_attribute` (
  `id` bigint(20) NOT NULL,
  `attribute_key` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `dynamic_attribute`
--

INSERT INTO `dynamic_attribute` (`id`, `attribute_key`, `value`, `product_id`) VALUES
(1, 'Coleur', 'noir', 1),
(2, 'Coleur', 'Noir', 2),
(3, 'Autonomie ', '30 heures', 2),
(4, 'Coleur', 'bleu', 3),
(5, 'Cadre ', 'aluminium', 3),
(6, 'Écran ', '10 pouces', 4);

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `order_date` datetime(6) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `recipient_name` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `status` bit(1) NOT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  `total_price` double DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `city`, `country`, `order_date`, `phone_number`, `postal_code`, `recipient_name`, `state`, `status`, `street_address`, `total_price`, `user_id`) VALUES
(1, 'tunis', 'Tunisie', '2025-01-22 00:40:04.000000', '53717752', '2086', 'eva', 'tunis', b'1', 'tunisia', 900, 9),
(3, 'tunis', 'Tunisie', '2025-01-22 00:41:53.000000', '56321554', '2086', 'eva trab', 'tunis', b'0', '04 rue othmanyin', 3200, 9),
(4, 'tunis', 'Tunisie', '2025-01-22 00:42:31.000000', '53717752', '2086', 'Akrem Homrani', 'tunis', b'0', '04 rue othmanyin', 5200, 2),
(6, 'tunis', 'Tunisie', '2025-02-05 16:02:55.000000', '53717752', '2086', 'Akrem Homrani', 'tunis', b'0', '04 rue othmanyin', 4000, 4),
(7, 'tunis', 'Tunisie', '2025-03-22 22:16:55.000000', '53717752', '2086', 'Akrem Homrani', 'tunis', b'0', '04 rue othmanyin', 2000, 9);

-- --------------------------------------------------------

--
-- Structure de la table `order_products`
--

CREATE TABLE `order_products` (
  `order_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `order_products`
--

INSERT INTO `order_products` (`order_id`, `product_id`) VALUES
(1, 2),
(3, 3),
(3, 4),
(4, 3),
(4, 4),
(6, 4),
(7, 4);

-- --------------------------------------------------------

--
-- Structure de la table `product`
--

CREATE TABLE `product` (
  `id` bigint(20) NOT NULL,
  `date_pub` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` double NOT NULL,
  `quantity` int(11) NOT NULL,
  `typep` varchar(255) DEFAULT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `product`
--

INSERT INTO `product` (`id`, `date_pub`, `description`, `name`, `price`, `quantity`, `typep`, `category_id`, `user_id`) VALUES
(1, '2025-01-21 23:55:49.000000', 'Dernier modèle de la série Galaxy S, avec un écran AMOLED 120Hz, processeur puissant et une caméra de 50 MP.', 'Smartphone Samsung Galaxy S23', 3000, 5, 'Smartphone', NULL, 7),
(2, '2025-01-22 00:01:29.000000', 'Casque sans fil à réduction de bruit, offrant une qualité audio exceptionnelle et une expérience d’écoute immersive.', 'Casque Sans Fil Sony WH-1000XM5', 300, 14, 'Casque Sans Fil', NULL, 7),
(3, '2025-01-22 00:35:19.000000', 'Un vélo léger, idéal pour les longues balades ou les compétitions, avec cadre en aluminium et vitesses ajustables.', 'vélo de route', 1200, 3, 'Vélo de Route', NULL, 5),
(4, '2025-01-22 00:37:51.000000', ' Tapis de course haut de gamme, équipé d’un moteur puissant et d’une inclinaison motorisée pour un entraînement intensif à domicile.', 'Tapis de Course NordicTrack Commercial 1750', 2000, 2, 'Tapis de Course ', NULL, 5),
(5, '2025-04-17 22:17:58.000000', 'ddd', 'Mariem', 1500, 20, '', NULL, 10);

-- --------------------------------------------------------

--
-- Structure de la table `product_image_urls`
--

CREATE TABLE `product_image_urls` (
  `product_id` bigint(20) NOT NULL,
  `image_urls` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `product_image_urls`
--

INSERT INTO `product_image_urls` (`product_id`, `image_urls`) VALUES
(1, '/assets/6c617cff-d086-4767-966f-eddd9c9a7f23_images.jpg'),
(1, '/assets/98edd9b5-1573-49e0-8b43-655d37c8efca_download.jpg'),
(1, '/assets/a3f8d79b-a548-400b-8c5a-0e2bc22b66d8_samsung-galaxy-s23-prix-tunisie.webp'),
(2, '/assets/24aa0c03-d969-4500-a141-1f23fda6c787_images.jpg'),
(2, '/assets/82150786-e9f9-41ad-a753-355084823d26_download.jpg'),
(2, '/assets/e4e1e7cb-e6bd-46e4-8f13-77c1d6ff974e_2.jpg'),
(3, '/assets/0297d292-66e6-42b0-8a58-a05d29a6dbb8_download.jpg'),
(3, '/assets/c0671ea0-9e50-4e5c-a77d-7cf3076b270b_2 (2).jpg'),
(3, '/assets/abe4c5cf-d001-4c45-bcd3-3753a8e2cbad_0.jpg'),
(4, '/assets/6266ca0b-b946-404f-b7de-076f959d57f0_download.jpg'),
(4, '/assets/880e7c31-97e4-45ec-a184-225f0d8e86c2_0.jpg'),
(4, '/assets/52f0d795-f01a-467c-be44-f29b1f14d63c_e72cc272d7215e081c2a7211a70002c2_675x.progressive.webp'),
(5, '/assets/fca5a6d3-3965-46f4-aca1-cb5b3f54117f_369828426_822772639507344_4995603464300486991_n.jpg');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `active` bit(1) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `registration_date` datetime(6) DEFAULT NULL,
  `role` enum('ADMIN','SOCIETE','SOCIETE_EMPLOYEE','CLIENT','PRODUCT_MANAGER','ORDER_MANAGER','PROMOTION_MANAGER') DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `verification_code` varchar(255) DEFAULT NULL,
  `verification_code_expiry` datetime(6) DEFAULT NULL,
  `societe_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `active`, `address`, `city`, `email`, `image`, `name`, `password`, `phone`, `postal_code`, `registration_date`, `role`, `username`, `verification_code`, `verification_code_expiry`, `societe_id`) VALUES
(1, b'1', 'tunis', NULL, 'admin@gmail.com', 'e43153bd-36e7-4bab-9b4b-fcfa9daa195f_2083585-photo-de-profil-d-homme-indigene-gratuit-vectoriel.jpg', NULL, '$2a$10$hdIAmvtl1bfu3oekEZJPi.9C/TklF4T1SoZdQg03dRh/tZfRf.a6i', '53717752', NULL, NULL, 'ADMIN', 'admin', '303683', '2025-01-21 23:24:36.000000', NULL),
(2, b'1', NULL, NULL, 'akr3m.homrani@gmail.com', NULL, NULL, '$2a$10$/6PYLq2faEvPBaxqEQ6Yi.ZraXFJIwJLFrT4llvWd0M4kEPJvf3oy', NULL, NULL, NULL, 'CLIENT', 'Akrem', NULL, NULL, NULL),
(3, b'1', 'tunisia', 'tunis', 'societe1@gmail.com', NULL, 'Societe1', '$2a$10$2NNxB0wN.I.EHGq3NEmXFOyD3FN.leHXkU9l8IJ.itt4M0gmxca.i', '53717752', '3000', '2025-01-21 23:28:06.000000', 'SOCIETE', NULL, NULL, NULL, NULL),
(4, b'1', 'nabeul', 'tunis', 'societe2@gmail.com', NULL, 'societe2', '$2a$10$cODdREPwJUFyPdEYzwvrfu9j25WMeyPRCKqUyA5lor44letkFLLZi', '21036804', '2086', '2025-01-21 23:28:37.000000', 'SOCIETE', NULL, NULL, NULL, NULL),
(5, b'1', 'sousse', 'tunis', 'societe3@gmail.com', NULL, 'societe3', '$2a$10$Epj14AQl.O2j8kX6mJ3pXewl1DuGt3qxjoMc4/81C39RenEgvKfAS', '500523687', '2086', '2025-01-21 23:29:14.000000', 'SOCIETE', NULL, NULL, NULL, NULL),
(6, b'1', 'tunisia', NULL, 'socemp1@gmail.com', NULL, NULL, '$2a$10$f3EVU/xmXawtlD4Mu3NhXudWhpCK3kTN.S8TrtFpNh.2UvqzBUC9a', '54782364', NULL, '2025-01-21 23:33:22.000000', 'SOCIETE_EMPLOYEE', 'Socemp1', NULL, NULL, 4),
(7, b'1', 'tunisia', NULL, 'prodmanag@gmail.com', NULL, NULL, '$2a$10$PAyohJnTWvowaY6ONLwMvuLBUbGJTxqMZH1rRYv0VkRdI8QAqFCjG', '25367951', NULL, '2025-01-21 23:34:03.000000', 'PRODUCT_MANAGER', 'prod manager', NULL, NULL, 4),
(8, b'1', 'tunisia', NULL, 'ordman@gmail.com', NULL, NULL, '$2a$10$/zCg3yLRNZQFNBiEt7yuQurT25OJ.ILH.Ni658A95Q6vUPqtTZuFi', '53715722', NULL, '2025-01-21 23:34:52.000000', 'ORDER_MANAGER', 'order manager', NULL, NULL, 4),
(9, b'1', NULL, NULL, 'evatra752@gmail.com', NULL, NULL, '$2a$10$hN93EV0m7LdQPmMeaTz85OdV701CuQyOruw9os51KPwzBLR1IFUny', NULL, NULL, NULL, 'CLIENT', 'Eva', NULL, NULL, NULL),
(10, b'1', 'a1', 'b1', 's1@gmail.com', NULL, 's1', '$2a$10$lRMfgTqDBBRidtPNErLsKObgoPzBbJ7UFLbWaa807puy1da8XzCVm', '123456789', '2020', '2025-04-17 22:14:24.000000', 'SOCIETE', NULL, NULL, NULL, NULL),
(13, b'1', 'aouina', NULL, 'bolbol@gmail.com', NULL, NULL, '$2a$10$KeqNUoqVUWWN8i/6XDe9Nekc5Icdu4BGaCzyoLhPNwyou97SjuM1S', '56470022', NULL, '2025-04-17 22:26:41.000000', 'PRODUCT_MANAGER', 'bilel', NULL, NULL, 10),
(15, b'1', 'tunis', 'sokraa', 'benammar@gmail.com', NULL, 'benammar', '$2a$10$ef4.NEr.srnZjGeA7NQRzOr5MHU/dC/bbdjnSopfaXJWDD7kJGSLK', '55222999', '4000', '2025-04-27 15:09:26.000000', 'SOCIETE', NULL, NULL, NULL, NULL),
(16, b'0', 'aouinaa', NULL, 'bilel@gmail.com', NULL, NULL, '$2a$10$ZgiW6dz9RixauW43cu8A1.pHmTEDyj./62hvuAOKKPcatzJ6VmWoW', '56470055', NULL, '2025-04-27 15:17:25.000000', 'SOCIETE_EMPLOYEE', 'bilel', NULL, NULL, 15);

-- --------------------------------------------------------

--
-- Structure de la table `user_categories`
--

CREATE TABLE `user_categories` (
  `user_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_categories`
--

INSERT INTO `user_categories` (`user_id`, `category_id`) VALUES
(3, 1),
(4, 3),
(5, 4),
(10, 1),
(15, 3);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `avis`
--
ALTER TABLE `avis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1268itlptj4o7l07fdykth020` (`product_id`),
  ADD KEY `FKjm7ew4okgyb6nrqslyuivx9w7` (`user_id`);

--
-- Index pour la table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `dynamic_attribute`
--
ALTER TABLE `dynamic_attribute`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK3h91l3o46s0b64viikwvkhi3r` (`product_id`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKel9kyl84ego2otj2accfd8mr7` (`user_id`);

--
-- Index pour la table `order_products`
--
ALTER TABLE `order_products`
  ADD KEY `FKb7sieybjsoa6140mh8fsqnge8` (`product_id`),
  ADD KEY `FKawxpt1ns1sr7al76nvjkv21of` (`order_id`);

--
-- Index pour la table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1mtsbur82frn64de7balymq9s` (`category_id`),
  ADD KEY `FK979liw4xk18ncpl87u4tygx2u` (`user_id`);

--
-- Index pour la table `product_image_urls`
--
ALTER TABLE `product_image_urls`
  ADD KEY `FKkh150393tevogcdngfwoviibo` (`product_id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_ob8kqyqqgmefl0aco34akdtpe` (`email`),
  ADD UNIQUE KEY `UK_gj2fy3dcix7ph7k8684gka40c` (`name`),
  ADD KEY `FK1yt642nrj5ji2ejfe76asxghx` (`societe_id`);

--
-- Index pour la table `user_categories`
--
ALTER TABLE `user_categories`
  ADD KEY `FKjkgs8j660t63yccvvyus2opmf` (`category_id`),
  ADD KEY `FKqhdol0ia96a31f8ir2g928ems` (`user_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `avis`
--
ALTER TABLE `avis`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `category`
--
ALTER TABLE `category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `dynamic_attribute`
--
ALTER TABLE `dynamic_attribute`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `product`
--
ALTER TABLE `product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `avis`
--
ALTER TABLE `avis`
  ADD CONSTRAINT `FK1268itlptj4o7l07fdykth020` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `FKjm7ew4okgyb6nrqslyuivx9w7` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `dynamic_attribute`
--
ALTER TABLE `dynamic_attribute`
  ADD CONSTRAINT `FK3h91l3o46s0b64viikwvkhi3r` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FKel9kyl84ego2otj2accfd8mr7` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `order_products`
--
ALTER TABLE `order_products`
  ADD CONSTRAINT `FKawxpt1ns1sr7al76nvjkv21of` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `FKb7sieybjsoa6140mh8fsqnge8` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Contraintes pour la table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `FK1mtsbur82frn64de7balymq9s` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `FK979liw4xk18ncpl87u4tygx2u` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `product_image_urls`
--
ALTER TABLE `product_image_urls`
  ADD CONSTRAINT `FKkh150393tevogcdngfwoviibo` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK1yt642nrj5ji2ejfe76asxghx` FOREIGN KEY (`societe_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `user_categories`
--
ALTER TABLE `user_categories`
  ADD CONSTRAINT `FKjkgs8j660t63yccvvyus2opmf` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `FKqhdol0ia96a31f8ir2g928ems` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
