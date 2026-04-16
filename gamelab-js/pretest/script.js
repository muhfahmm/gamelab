/* 
   Logika Kalkulator Sederhana (Pre-test)
   Menggunakan jQuery dan Konsep Dasar JavaScript
*/

$(document).ready(function() {
    // 1. Variabel - Menyimpan state kalkulator
    let inputSekarang = '0';
    let inputSebelumnya = '';
    let operatorTerpilih = undefined;

    // 3. Fungsi - Reset semua nilai
    function resetKalkulator() {
        inputSekarang = '0';
        inputSebelumnya = '';
        operatorTerpilih = undefined;
    }

    // 3. Fungsi - Menghapus satu karakter terakhir
    function hapusKarakter() {
        if (inputSekarang.length === 1) {
            inputSekarang = '0';
        } else {
            inputSekarang = inputSekarang.toString().slice(0, -1);
        }
    }

    // 3. Fungsi - Menambah angka ke layar
    function tambahAngka(angka) {
        if (angka === '.' && inputSekarang.includes('.')) return;
        
        // 2. Blok Kondisional - Menangani angka nol di awal
        if (inputSekarang === '0' && angka !== '.') {
            inputSekarang = angka.toString();
        } else {
            inputSekarang = inputSekarang.toString() + angka.toString();
        }
    }

    // 3. Fungsi - Memilih operator (+, -, *, /)
    function pilihOperator(simbol) {
        if (inputSekarang === '') return;
        if (inputSebelumnya !== '') {
            hitungHasil();
        }
        operatorTerpilih = simbol;
        inputSebelumnya = inputSekarang;
        inputSekarang = '';
    }

    // 3. Fungsi - Melakukan kalkulasi matematika
    function hitungHasil() {
        let hasil;
        const angka1 = parseFloat(inputSebelumnya);
        const angka2 = parseFloat(inputSekarang);

        // 2. Blok Kondisional - Validasi input
        if (isNaN(angka1) || isNaN(angka2)) return;

        // 2. Blok Kondisional - Pemilihan operasi
        switch (operatorTerpilih) {
            case '+':
                hasil = angka1 + angka2;
                break;
            case '-':
                hasil = angka1 - angka2;
                break;
            case '*':
                hasil = angka1 * angka2;
                break;
            case '/':
                // Penanganan pembagian dengan nol
                if (angka2 === 0) {
                    alert("Tidak bisa membagi dengan nol!");
                    resetKalkulator();
                    return;
                }
                hasil = angka1 / angka2;
                break;
            default:
                return;
        }

        inputSekarang = hasil.toString();
        operatorTerpilih = undefined;
        inputSebelumnya = '';
    }

    // 5. jQuery + DOM - Memperbarui tampilan layar
    function perbaruiLayar() {
        $('#main-display').text(inputSekarang);
        
        if (operatorTerpilih != null) {
            $('#history-view').text(`${inputSebelumnya} ${operatorTerpilih}`);
        } else {
            $('#history-view').text('');
        }
    }

    // 4. jQuery Events - Klik Tombol Angka
    $('.btn-number').on('click', function() {
        tambahAngka($(this).text());
        perbaruiLayar();
    });

    // 4. jQuery Events - Klik Tombol Operator
    $('.btn-operator').on('click', function() {
        pilihOperator($(this).data('symbol'));
        perbaruiLayar();
    });

    // 4. jQuery Events - Klik Tombol Sama Dengan
    $('#equal-btn').on('click', function() {
        hitungHasil();
        perbaruiLayar();
    });

    // 4. jQuery Events - Klik Tombol Reset (AC)
    $('#clear-btn').on('click', function() {
        resetKalkulator();
        perbaruiLayar();
    });

    // 4. jQuery Events - Klik Tombol Hapus (DEL)
    $('#del-btn').on('click', function() {
        hapusKarakter();
        perbaruiLayar();
    });

    // Inisialisasi tampilan awal
    perbaruiLayar();
});
