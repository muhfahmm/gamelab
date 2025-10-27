-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 29 Sep 2025 pada 14.35
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_vote`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_admin`
--

CREATE TABLE `tb_admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_admin`
--

INSERT INTO `tb_admin` (`id`, `username`, `password`) VALUES
(10, 'fahiim', '$2y$10$0XxEoygpF1uqN9.hpYPFIOUxaBfr8UvEYpuWDvDmvMHEXZI6cAOFm');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_kandidat`
--

CREATE TABLE `tb_kandidat` (
  `id` int(11) NOT NULL,
  `nomor_kandidat` int(11) NOT NULL,
  `nama_ketua` varchar(100) NOT NULL,
  `kelas_ketua` varchar(50) NOT NULL,
  `foto_ketua` varchar(255) NOT NULL,
  `nama_wakil` varchar(100) NOT NULL,
  `kelas_wakil` varchar(50) NOT NULL,
  `foto_wakil` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_kandidat`
--

INSERT INTO `tb_kandidat` (`id`, `nomor_kandidat`, `nama_ketua`, `kelas_ketua`, `foto_ketua`, `nama_wakil`, `kelas_wakil`, `foto_wakil`, `created_at`) VALUES
(10, 1, 'ketua 1', 'XI-2', '../uploads/1758890990_ketua_adibas.png', 'wakil 1', 'X-1', '../uploads/1758890990_wakil_adibas.png', '2025-09-26 12:49:50'),
(11, 2, 'ketua 2', 'xi-1', '../uploads/1758891035_ketua_kisi-kisi kj.jpg', 'wakil 2', 'xi-2', '../uploads/1758891035_wakil_kisi-kisi kj.jpg', '2025-09-26 12:50:35'),
(12, 3, 'ketua 3', 'x-2', '../uploads/1758891073_ketua_kisi-kisi nirkabel.jpg', 'wakil 3', 'xi-1', '../uploads/1758891073_wakil_kisi-kisi nirkabel.jpg', '2025-09-26 12:51:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_voter`
--

CREATE TABLE `tb_voter` (
  `id` int(11) NOT NULL,
  `nama_voter` varchar(100) NOT NULL,
  `kelas` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_voter`
--

INSERT INTO `tb_voter` (`id`, `nama_voter`, `kelas`, `created_at`) VALUES
(28, 's', 'X-2', '2025-09-26 13:03:38'),
(29, 'dv', 'X-1', '2025-09-26 13:04:49'),
(30, 'asd', 'X-2', '2025-09-26 13:04:57'),
(31, 'asdasg', 'X-1', '2025-09-26 13:05:07'),
(32, 'sadas', 'X-1', '2025-09-26 13:05:34'),
(33, 'asdag', 'X-2', '2025-09-26 13:06:02'),
(34, 'hrteh', 'X-1', '2025-09-26 13:07:46'),
(35, 'hd', 'XI-2', '2025-09-26 13:13:52'),
(36, 'sdfj', 'XI-2', '2025-09-26 13:14:03'),
(37, 'afdsf', 'X-1', '2025-09-26 13:14:22'),
(38, 'sadfgs', 'XI-1', '2025-09-26 13:14:36'),
(39, 'dfg', 'XII', '2025-09-26 13:55:04'),
(40, 'asdasd', 'X-1', '2025-09-27 09:56:05'),
(41, 'sdfgs', 'X-2', '2025-09-27 10:02:36'),
(42, 'dfhgdh', 'XI-1', '2025-09-27 10:02:50'),
(43, 'dfhgdh', 'XI-1', '2025-09-27 10:03:30'),
(44, 'jmfgh', 'XI-2', '2025-09-27 10:03:43'),
(45, 'sklfjshgk', 'X-2', '2025-09-27 10:05:14'),
(46, 'sdghytb', 'XI-2', '2025-09-27 10:16:28'),
(47, 'huijsen', 'XII', '2025-09-29 07:50:16'),
(48, 'ftyrft', 'XI-1', '2025-09-29 12:31:07'),
(49, 'tregrwtg', 'XII', '2025-09-29 12:32:14');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_vote_log`
--

CREATE TABLE `tb_vote_log` (
  `id` int(11) NOT NULL,
  `voter_id` int(11) NOT NULL,
  `nomor_kandidat` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_vote_log`
--

INSERT INTO `tb_vote_log` (`id`, `voter_id`, `nomor_kandidat`, `created_at`) VALUES
(30, 28, 1, '2025-09-26 13:03:38'),
(31, 29, 1, '2025-09-26 13:04:49'),
(32, 30, 2, '2025-09-26 13:04:57'),
(33, 31, 3, '2025-09-26 13:05:07'),
(34, 32, 2, '2025-09-26 13:05:34'),
(35, 33, 3, '2025-09-26 13:06:02'),
(36, 34, 1, '2025-09-26 13:07:46'),
(37, 35, 3, '2025-09-26 13:13:52'),
(38, 36, 2, '2025-09-26 13:14:03'),
(39, 37, 1, '2025-09-26 13:14:22'),
(40, 38, 3, '2025-09-26 13:14:36'),
(41, 39, 1, '2025-09-26 13:55:04'),
(42, 40, 1, '2025-09-27 09:56:05'),
(43, 41, 1, '2025-09-27 10:02:36'),
(44, 42, 3, '2025-09-27 10:02:50'),
(45, 43, 3, '2025-09-27 10:03:30'),
(46, 44, 3, '2025-09-27 10:03:43'),
(47, 45, 2, '2025-09-27 10:05:14'),
(48, 46, 2, '2025-09-27 10:16:28'),
(49, 47, 1, '2025-09-29 07:50:16'),
(50, 48, 1, '2025-09-29 12:31:07'),
(51, 49, 3, '2025-09-29 12:32:14');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_vote_result`
--

CREATE TABLE `tb_vote_result` (
  `id` int(11) NOT NULL,
  `nomor_kandidat` int(11) NOT NULL,
  `jumlah_vote` int(11) NOT NULL DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `tb_admin`
--
ALTER TABLE `tb_admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `tb_kandidat`
--
ALTER TABLE `tb_kandidat`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nomor_kandidat` (`nomor_kandidat`);

--
-- Indeks untuk tabel `tb_voter`
--
ALTER TABLE `tb_voter`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tb_vote_log`
--
ALTER TABLE `tb_vote_log`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `voter_id` (`voter_id`),
  ADD KEY `tb_vote_log_ibfk_2` (`nomor_kandidat`);

--
-- Indeks untuk tabel `tb_vote_result`
--
ALTER TABLE `tb_vote_result`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nomor_kandidat` (`nomor_kandidat`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `tb_admin`
--
ALTER TABLE `tb_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `tb_kandidat`
--
ALTER TABLE `tb_kandidat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `tb_voter`
--
ALTER TABLE `tb_voter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT untuk tabel `tb_vote_log`
--
ALTER TABLE `tb_vote_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT untuk tabel `tb_vote_result`
--
ALTER TABLE `tb_vote_result`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `tb_vote_log`
--
ALTER TABLE `tb_vote_log`
  ADD CONSTRAINT `tb_vote_log_ibfk_1` FOREIGN KEY (`voter_id`) REFERENCES `tb_voter` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tb_vote_log_ibfk_2` FOREIGN KEY (`nomor_kandidat`) REFERENCES `tb_kandidat` (`nomor_kandidat`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `tb_vote_result`
--
ALTER TABLE `tb_vote_result`
  ADD CONSTRAINT `tb_vote_result_ibfk_1` FOREIGN KEY (`nomor_kandidat`) REFERENCES `tb_kandidat` (`nomor_kandidat`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
