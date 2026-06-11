/**
 * =====================================================
 * DAILY WEATHER WATCHER - Tugas Akhir Javascript & jQuery
 * =====================================================
 * 
 * Fitur Aplikasi:
 * 1. VARIABEL: Menyimpan nama kota, API Key, dan data JSON dari API
 * 2. KONDISIONAL: If-else untuk mengecek kondisi cuaca
 * 3. FUNGSI: fetchWeatherData() dan displayWeather()
 * 4. JQUERY EVENTS: Event .click() dan .keypress()
 * 5. JQUERY DOM: Menggunakan .html() dan .addClass()
 * 6. AJAX: Mengambil data cuaca secara asinkron
 */

$(document).ready(function () {
    
    // =====================================================
    // 1. VARIABEL - MENYIMPAN STATE APLIKASI & DATA
    // =====================================================
    
    // Variabel untuk menyimpan nama kota yang sedang dicari
    var currentCity = '';
    
    // Variabel untuk URL Weather API (wttr.in - API cuaca yang simple & reliable)
    var weatherApiUrl = 'https://wttr.in/';
    
    // Variabel untuk menyimpan data JSON dari API
    var weatherData = {};
    
    // Variabel untuk menyimpan riwayat pencarian
    var searchHistory = [];
    
    // Variabel untuk menyimpan timeout suggestion
    var suggestionTimeout;
    
    
    // =====================================================
    // 3. FUNGSI-FUNGSI UTAMA APLIKASI
    // =====================================================
    
    /**
     * FUNGSI 3a: Inisialisasi aplikasi
     * - Load riwayat pencarian dari localStorage
     */
    function initApp() {
        // Load riwayat dari localStorage
        var savedHistory = localStorage.getItem('weather_search_history');
        if (savedHistory) {
            searchHistory = JSON.parse(savedHistory);
            updateHistoryUI();
        }
        
        console.log('✓ Aplikasi Daily Weather Watcher Siap!');
    }
    
    /**
     * FUNGSI 3b: Fetch Weather Data dari wttr.in API
     * - API yang reliable, gratis, dan tidak perlu API Key
     * - FITUR 6: AJAX - Mengambil data cuaca secara asinkron
     */
    function fetchWeatherData(cityName) {
        // Tampilkan loading spinner
        $('#loadingSpinner').show();
        $('#weatherContainer').hide();
        $('#errorMessage').hide();
        $('#initialState').hide();
        
        // Simpan nama kota
        currentCity = cityName;
        
        // Request ke wttr.in API dengan format JSON
        $.ajax({
            url: weatherApiUrl + cityName + '?format=j1',
            type: 'GET',
            dataType: 'json',
            timeout: 8000,
            success: function(data) {
                // Validasi data cuaca
                if (data && data.current_condition && data.nearest_area) {
                    // Simpan data
                    weatherData = data;
                    
                    // Tampilkan data cuaca
                    displayWeather(data);
                    
                    // Tambahkan ke riwayat
                    addToHistory(cityName);
                    
                    console.log('✓ Data cuaca berhasil diambil:', data);
                } else {
                    $('#loadingSpinner').hide();
                    showError('Format data cuaca tidak valid.');
                    console.error('✗ Invalid weather data:', data);
                }
            },
            error: function(xhr, status, error) {
                $('#loadingSpinner').hide();
                
                var errorMsg = 'Gagal mengambil data cuaca. ';
                
                if (status === 'timeout') {
                    errorMsg += 'Permintaan timeout. Coba lagi.';
                } else if (status === 'error' && xhr.status === 0) {
                    errorMsg += 'Periksa koneksi internet Anda.';
                } else if (xhr.status === 404 || xhr.status === 400) {
                    errorMsg = 'Kota "' + cityName + '" tidak ditemukan. Cek ejaan dan coba lagi.';
                } else {
                    errorMsg += 'Silakan coba lagi nanti.';
                }
                
                showError(errorMsg);
                console.error('✗ Weather API Error:', {
                    status: status,
                    statusCode: xhr.status,
                    error: error
                });
            }
        });
    }
    
    /**
     * FUNGSI 3b2: Parse Weather Condition dari wttr.in
     */
    function getWeatherFromCondition(condition) {
        var condLower = condition.toLowerCase();
        var weatherIcon = 'fas fa-cloud';
        var bgClass = 'bg-cloudy';
        
        // KONDISIONAL: Tentukan ikon & warna berdasarkan kondisi
        if (condLower.includes('sunny') || condLower.includes('clear')) {
            weatherIcon = 'fas fa-sun';
            bgClass = 'bg-sunny';
        } else if (condLower.includes('cloud')) {
            weatherIcon = 'fas fa-cloud';
            bgClass = 'bg-cloudy';
        } else if (condLower.includes('rain') || condLower.includes('drizzle')) {
            weatherIcon = 'fas fa-cloud-rain';
            bgClass = 'bg-rainy';
        } else if (condLower.includes('thunder') || condLower.includes('storm')) {
            weatherIcon = 'fas fa-bolt';
            bgClass = 'bg-thunderstorm';
        } else if (condLower.includes('snow') || condLower.includes('sleet')) {
            weatherIcon = 'fas fa-snowflake';
            bgClass = 'bg-snowy';
        } else if (condLower.includes('fog') || condLower.includes('mist')) {
            weatherIcon = 'fas fa-smog';
            bgClass = 'bg-cloudy';
        } else if (condLower.includes('overcast')) {
            weatherIcon = 'fas fa-cloud';
            bgClass = 'bg-cloudy';
        }
        
        return { icon: weatherIcon, bg: bgClass };
    }
    
    /**
     * FUNGSI 3c: Display Weather Data (untuk wttr.in format)
     * - FITUR 2: KONDISIONAL - Logic untuk mengecek kondisi cuaca
     * - FITUR 5: JQUERY DOM - Menggunakan .html() dan .addClass()
     */
    function displayWeather(data) {
        try {
            // Extract data dari wttr.in API format
            var currentCond = data.current_condition[0];
            var areaData = data.nearest_area[0];
            var weatherForecast = data.weather[0];
            
            // Extract lokasi
            var cityName = areaData.areaName[0].value;
            var country = areaData.country[0].value;
            var fullName = cityName + ', ' + country;
            
            // Extract suhu & kondisi
            var temperature = Math.round(currentCond.temp_C);
            var tempMin = Math.round(weatherForecast.mintempC);
            var tempMax = Math.round(weatherForecast.maxtempC);
            var humidity = currentCond.humidity;
            var windSpeed = (currentCond.windspeedKmph / 3.6).toFixed(1);  // Convert to m/s
            var visibility = (currentCond.visibility / 1.609).toFixed(1);  // Convert km to miles estimate
            var pressure = currentCond.pressure;
            var description = currentCond.weatherDesc[0].value;
            
            // Get weather icon & background class dari deskripsi
            var weatherData = getWeatherFromCondition(description);
            var weatherIcon = weatherData.icon;
            var bgClass = weatherData.bg;
            
            // Get current date
            var currentDate = new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // =====================================================
            // 2. KONDISIONAL - Determine alert based on temperature & weather
            // =====================================================
            var alertMessage = '';
            
            // KONDISIONAL: Check suhu untuk alert
            if (temperature > 30) {
                alertMessage = '<i class="fas fa-exclamation-triangle"></i> Cuaca Panas! Hindari aktivitas berat di luar ruangan.';
            } else if (temperature < 0) {
                alertMessage = '<i class="fas fa-snowflake"></i> Cuaca Dingin! Gunakan pakaian tebal.';
                bgClass = 'bg-snowy';
            } else if (temperature < 15) {
                alertMessage = '<i class="fas fa-wind"></i> Cuaca Dingin! Bawa jaket saat keluar.';
            }
            
            // KONDISIONAL: Check deskripsi cuaca untuk alert
            var descLower = description.toLowerCase();
            if (descLower.includes('rain') || descLower.includes('drizzle')) {
                alertMessage = '<i class="fas fa-droplet"></i> Hujan! Bawa payung saat keluar.';
            } else if (descLower.includes('thunder') || descLower.includes('storm')) {
                alertMessage = '<i class="fas fa-bolt"></i> Badai Petir! Tetap di dalam rumah untuk keselamatan.';
                bgClass = 'bg-thunderstorm';
            }
            
            // =====================================================
            // 5. JQUERY DOM - Update HTML elements dengan data cuaca
            // =====================================================
            
            // Update city name & date
            $('#cityName').html(fullName);
            $('#currentDate').html(currentDate);
            
            // Update temperature & description
            $('#temperature').html(temperature);
            $('#weatherDescription').html(description);
            
            // Update weather icon
            $('#weatherIcon')
                .removeClass()
                .addClass('weather-icon ' + weatherIcon);
            
            // Update detail cards
            $('#humidity').html(humidity + ' %');
            $('#windSpeed').html(windSpeed + ' m/s');
            $('#visibility').html(visibility + ' km');
            $('#pressure').html(pressure + ' hPa');
            $('#tempMax').html(tempMax + ' °C');
            $('#tempMin').html(tempMin + ' °C');
            
            // Apply background class to main card
            $('#weatherContainer .main-card')
                .removeClass('bg-sunny bg-cloudy bg-rainy bg-thunderstorm bg-snowy bg-hot')
                .addClass(bgClass);  // JQUERY DOM: .addClass()
            
            // Update alert message jika ada
            if (alertMessage) {
                $('#weatherAlert')
                    .html(alertMessage)
                    .show();
                
                // Conditional untuk menentukan jenis alert
                if (alertMessage.includes('Badai') || alertMessage.includes('Dingin') || alertMessage.includes('Dingin')) {
                    $('#weatherAlert').addClass('alert-danger');
                } else {
                    $('#weatherAlert').removeClass('alert-danger');
                }
            } else {
                $('#weatherAlert').hide();
            }
            
            // Tampilkan container cuaca
            $('#loadingSpinner').fadeOut();
            $('#weatherContainer').fadeIn();
            
        } catch(err) {
            $('#loadingSpinner').hide();
            showError('Error parsing data cuaca. Silakan coba lagi.');
            console.error('✗ Display error:', err, data);
        }
    }
    
    /**
     * FUNGSI 3d: Show error message
     */
    function showError(message) {
        $('#errorText').html(message);
        $('#errorMessage').fadeIn();
        $('#initialState').hide();
    }
    
    /**
     * FUNGSI 3e: Add city to search history
     */
    function addToHistory(cityName) {
        // Format nama kota
        var formatted = cityName.trim();
        formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
        
        // Hapus jika sudah ada (agar tidak duplikat)
        var index = searchHistory.indexOf(formatted);
        if (index > -1) {
            searchHistory.splice(index, 1);
        }
        
        // Tambahkan di awal
        searchHistory.unshift(formatted);
        
        // Batasi maksimal 8 riwayat
        if (searchHistory.length > 8) {
            searchHistory.pop();
        }
        
        // Simpan ke localStorage
        localStorage.setItem('weather_search_history', JSON.stringify(searchHistory));
        updateHistoryUI();
    }
    
    /**
     * FUNGSI 3f: Update history UI
     */
    function updateHistoryUI() {
        var $historyList = $('#historyList');
        $historyList.empty();  // JQUERY DOM: .empty()
        
        if (searchHistory.length === 0) {
            $historyList.html('<span class="history-empty">Belum ada riwayat pencarian</span>');
        } else {
            $.each(searchHistory, function(index, city) {
                var item = $('<div class="history-item"></div>')
                    .html(city + ' <i class="fas fa-clock"></i>');
                $historyList.append(item);  // JQUERY DOM: .append()
            });
        }
    }
    
    /**
     * FUNGSI 3g: Clear input & reset UI
     */
    function clearSearch() {
        $('#cityInput').val('').focus();
        $('#weatherContainer').hide();
        $('#errorMessage').hide();
        $('#initialState').show();
    }
    
    
    // =====================================================
    // 4. JQUERY EVENTS - Event Handling
    // =====================================================
    
    /**
     * EVENT: Klik tombol "Cari Cuaca"
     * - FITUR 4: JQUERY EVENTS - Event .click()
     */
    $('#searchBtn').on('click', function() {
        var cityName = $('#cityInput').val();
        
        // KONDISIONAL: Validasi input
        if (cityName.trim() !== '') {
            fetchWeatherData(cityName);
        } else {
            alert('Silakan masukkan nama kota terlebih dahulu!');
        }
    });
    
    /**
     * EVENT: Tekan tombol Enter pada input kota
     * - FITUR 4: JQUERY EVENTS - Event .keypress()
     */
    $('#cityInput').on('keypress', function(event) {
        // Check if Enter key was pressed (keyCode 13)
        if (event.which === 13 || event.keyCode === 13) {
            event.preventDefault();  // Prevent form submission
            $('#searchBtn').click();  // Trigger search
        }
    });
    
    /**
     * EVENT: Klik pada item riwayat pencarian
     * - FITUR 4: JQUERY EVENTS - Event delegated .on('click')
     */
    $(document).on('click', '.history-item', function() {
        var cityName = $(this).text().replace(/\s*\ufaa.*/, '');  // Extract city name
        $('#cityInput').val(cityName);
        fetchWeatherData(cityName);
    });
    
    /**
     * EVENT: Input pada field kota untuk real-time search
     */
    $('#cityInput').on('input', function() {
        var query = $(this).val().trim();
        
        // Clear existing timeout
        clearTimeout(suggestionTimeout);
        
        // KONDISIONAL: Jika input kosong
        if (query.length === 0) {
            $('#suggestions').removeClass('show').empty();
            return;
        }
        
        // Tampilkan saran dari riwayat
        if (query.length > 0) {
            var suggestions = searchHistory.filter(function(city) {
                return city.toLowerCase().includes(query.toLowerCase());
            });
            
            if (suggestions.length > 0) {
                $('#suggestions').empty();
                $.each(suggestions, function(index, city) {
                    var suggestion = $('<div class="suggestion-item"></div>')
                        .html('<i class="fas fa-history"></i> ' + city);
                    $('#suggestions').append(suggestion);
                });
                $('#suggestions').addClass('show');
            } else {
                $('#suggestions').removeClass('show').empty();
            }
        }
    });
    
    /**
     * EVENT: Klik pada saran (suggestion)
     */
    $(document).on('click', '.suggestion-item', function() {
        var cityName = $(this).text().replace(/^.*?\s/, '');  // Extract city name
        $('#cityInput').val(cityName);
        $('#suggestions').removeClass('show').empty();
        fetchWeatherData(cityName);
    });
    
    /**
     * EVENT: Close suggestions when clicking outside
     */
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.search-container').length) {
            $('#suggestions').removeClass('show');
        }
    });
    
    
    // =====================================================
    // INITIALIZE APP
    // =====================================================
    
    initApp();
    
});
