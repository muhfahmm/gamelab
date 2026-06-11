/**
 * TUGAS AKHIR - Javascript & jQuery
 * Aplikasi: Country Explorer
 * Deskripsi: Aplikasi pencarian info negara menggunakan REST Countries API
 */

$(document).ready(function () {
    // ==========================================
    // 1. VARIABEL (State Aplikasi)
    // ==========================================
    var searchHistory = []; // Menyimpan riwayat pencarian
    var currentTheme = 'dark'; // Menyimpan state tema aktif ('dark' atau 'light')
    var apiUrl = 'https://restcountries.com/v3.1/name/'; // Base URL API REST Countries

    // ==========================================
    // 3. FUNGSI-FUNGSI UTAMA (Functions)
    // ==========================================

    // Fungsi Inisialisasi Aplikasi
    function initApp() {
        // Load data history dari localStorage jika ada
        var savedHistory = localStorage.getItem('country_search_history');
        if (savedHistory) {
            searchHistory = JSON.parse(savedHistory);
            updateHistoryUI();
        }

        // Load tema dari localStorage jika ada
        var savedTheme = localStorage.getItem('country_app_theme');
        if (savedTheme) {
            currentTheme = savedTheme;
            if (currentTheme === 'light') {
                $('body').removeClass('dark-theme').addClass('light-theme');
                $('#themeToggle i').removeClass('fa-sun').addClass('fa-moon');
            }
        }
    }

    // Fungsi format angka populasi (e.g. 273523615 -> 273.523.615)
    function formatNumber(num) {
        if (!num) return '0';
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }

    // Fungsi untuk memperbarui tampilan daftar riwayat pencarian
    function updateHistoryUI() {
        var $historyList = $('#historyList');
        $historyList.empty(); // jQuery + DOM: Mengosongkan kontainer list

        // 2. KONDISIONAL: Jika riwayat kosong
        if (searchHistory.length === 0) {
            $historyList.append('<li class="empty-history">Belum ada riwayat pencarian</li>');
            $('#clearHistory').fadeOut(); // Sembunyikan tombol hapus riwayat
        } else {
            // jQuery + DOM: Iterasi dan penambahan item riwayat
            $.each(searchHistory, function (index, item) {
                var li = $('<li class="history-item"></li>')
                    .text(item)
                    .append('<i class="fa-solid fa-chevron-right"></i>');
                $historyList.append(li);
            });
            $('#clearHistory').fadeIn(); // Tampilkan tombol hapus riwayat
        }
    }

    // Fungsi menambahkan item ke riwayat pencarian
    function addToHistory(countryName) {
        // Normalisasi nama (kapitalisasi huruf pertama)
        var formattedName = countryName.trim();
        formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);

        // Hapus nama jika sudah ada di riwayat (agar tidak duplikat)
        var index = searchHistory.indexOf(formattedName);
        if (index > -1) {
            searchHistory.splice(index, 1);
        }

        // Tambahkan di awal array
        searchHistory.unshift(formattedName);

        // Batasi maksimal 5 riwayat terakhir
        if (searchHistory.length > 5) {
            searchHistory.pop();
        }

        // Simpan ke localStorage
        localStorage.setItem('country_search_history', JSON.stringify(searchHistory));
        updateHistoryUI();
    }

    // Fungsi untuk melakukan request AJAX ke API Negara
    function fetchCountryData(countryName) {
        // jQuery + DOM: Sembunyikan kartu negara & tampilkan loading spinner
        $('#countryCard').hide();
        $('#statusMessage').hide();
        $('#loader').fadeIn();

        // 6. AJAX: Melakukan HTTP GET request menggunakan $.ajax
        $.ajax({
            url: apiUrl + encodeURIComponent(countryName),
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                // Sembunyikan loader
                $('#loader').hide();

                // 2. KONDISIONAL: Periksa apakah respons dari server berisi data valid
                if (response && response.length > 0) {
                    var country = response[0]; // Ambil data negara pertama dari hasil pencarian
                    
                    // Render data negara ke DOM
                    renderCountryCard(country);
                    
                    // Tambahkan ke riwayat pencarian yang sukses
                    addToHistory(countryName);
                } else {
                    showErrorMessage('Negara tidak ditemukan. Coba ketik dengan benar dalam Bahasa Inggris.');
                }
            },
            error: function (xhr, status, error) {
                $('#loader').hide();
                
                // 2. KONDISIONAL: Menangani status code error yang berbeda
                if (xhr.status === 404) {
                    showErrorMessage('Negara "' + countryName + '" tidak ditemukan. Silakan periksa kembali ejaan Anda.');
                } else {
                    showErrorMessage('Terjadi kesalahan koneksi saat menghubungi API server. Silakan coba lagi.');
                }
                console.error("AJAX Error: ", status, error);
            }
        });
    }

    // Fungsi menampilkan pesan error
    function showErrorMessage(message) {
        var $status = $('#statusMessage');
        $status.empty().append(
            '<div class="status-icon danger"><i class="fa-solid fa-circle-exclamation"></i></div>' +
            '<h2>Pencarian Gagal</h2>' +
            '<p>' + message + '</p>'
        ).fadeIn();
    }

    // Fungsi untuk memetakan data negara ke dalam DOM
    function renderCountryCard(country) {
        var name = country.name.common;
        var officialName = country.name.official;
        var flag = country.flags.png;
        var population = country.population || 0;
        var capital = country.capital ? country.capital[0] : 'Tidak memiliki Ibu Kota';
        var region = country.region + (country.subregion ? ' (' + country.subregion + ')' : '');
        
        // Memetakan mata uang
        var currencyText = '-';
        if (country.currencies) {
            var currencyKey = Object.keys(country.currencies)[0];
            var currencyObj = country.currencies[currencyKey];
            currencyText = currencyObj.name + ' (' + (currencyObj.symbol || currencyKey) + ')';
        }

        // Memetakan bahasa
        var languagesText = '-';
        if (country.languages) {
            languagesText = Object.values(country.languages).join(', ');
        }

        // Link Google Maps
        var mapLink = country.maps ? country.maps.googleMaps : '#';

        // 2. KONDISIONAL: Klasifikasi populasi negara untuk menentukan kelas badge
        var badgeText = '';
        var badgeClass = '';

        if (population > 100000000) {
            badgeText = 'Mega Populasi (>100 Juta)';
            badgeClass = 'badge-huge';
        } else if (population > 10000000) {
            badgeText = 'Populasi Besar (>10 Juta)';
            badgeClass = 'badge-large';
        } else {
            badgeText = 'Populasi Sedang/Kecil';
            badgeClass = 'badge-medium';
        }

        // 5. JQUERY + DOM: Memperbarui isi element DOM dengan data baru
        $('#countryFlag').attr('src', flag).attr('alt', 'Bendera ' + name);
        $('#countryName').text(name);
        $('#countryOfficialName').text(officialName);
        
        // Update badge kategori populasi
        $('#countryStatusBadge')
            .text(badgeText)
            .removeClass('badge-huge badge-large badge-medium')
            .addClass(badgeClass);

        $('#countryPopulation').text(formatNumber(population) + ' Jiwa');
        $('#countryCapital').text(capital);
        $('#countryRegion').text(region);
        $('#countryCurrency').text(currencyText);
        $('#countryLanguages').text(languagesText);
        $('#countryMapLink').attr('href', mapLink);

        // Tampilkan kartu detail negara dengan efek transisi smooth
        $('#countryCard').fadeIn(500);
    }

    // ==========================================
    // 4. JQUERY EVENTS (Event Handling)
    // ==========================================

    // Event Submit Form Pencarian
    $('#searchForm').on('submit', function (event) {
        event.preventDefault(); // Mencegah reload halaman web
        
        var query = $('#searchInput').val();

        // 2. KONDISIONAL: Validasi input pencarian
        if (query.trim() !== '') {
            fetchCountryData(query);
        } else {
            alert('Masukkan nama negara terlebih dahulu!');
        }
    });

    // Event Input pada Kolom Pencarian untuk memunculkan tombol Reset (X)
    $('#searchInput').on('input', function () {
        var val = $(this).val();
        if (val.length > 0) {
            $('#clearSearch').show();
        } else {
            $('#clearSearch').hide();
        }
    });

    // Event Klik tombol clear (X) pada form pencarian
    $('#clearSearch').on('click', function () {
        $('#searchInput').val('').focus();
        $(this).hide();
    });

    // Event Klik Item Riwayat Pencarian (Menggunakan delegasi event untuk elemen dinamis)
    $(document).on('click', '.history-item', function () {
        var countryName = $(this).text().trim();
        $('#searchInput').val(countryName);
        $('#clearSearch').show();
        fetchCountryData(countryName);
    });

    // Event Klik Hapus Semua Riwayat Pencarian
    $('#clearHistory').on('click', function () {
        searchHistory = [];
        localStorage.removeItem('country_search_history');
        updateHistoryUI();
    });

    // Event Klik Tombol Toggle Dark/Light Mode
    $('#themeToggle').on('click', function () {
        var $body = $('body');
        var $icon = $(this).find('i');

        // 2. KONDISIONAL: Cek & ubah tema aktif
        if ($body.hasClass('dark-theme')) {
            // Ubah ke Light Theme
            $body.removeClass('dark-theme').addClass('light-theme');
            $icon.removeClass('fa-sun').addClass('fa-moon');
            currentTheme = 'light';
        } else {
            // Ubah ke Dark Theme
            $body.removeClass('light-theme').addClass('dark-theme');
            $icon.removeClass('fa-moon').addClass('fa-sun');
            currentTheme = 'dark';
        }
        
        // Simpan preferensi tema di localStorage
        localStorage.setItem('country_app_theme', currentTheme);
    });

    // Jalankan inisialisasi awal saat halaman siap
    initApp();
});
