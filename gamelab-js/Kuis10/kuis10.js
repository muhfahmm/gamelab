$(document).ready(function () {
  // Daftar kota default
  let cityWatchlist = ['Jakarta', 'Surabaya', 'Tokyo', 'London', 'New York'];
  let activeWeatherData = {};
  let simulatedHistory = {};

  // Peta Weather Code Open-Meteo ke Deskripsi & Ikon
  const WEATHER_CODES = {
    0: { desc: 'Cerah', icon: 'fa-solid fa-sun', color: '#f59e0b' },
    1: { desc: 'Sebagian Cerah', icon: 'fa-solid fa-cloud-sun', color: '#f59e0b' },
    2: { desc: 'Cerah Berawan', icon: 'fa-solid fa-cloud-sun', color: '#60a5fa' },
    3: { desc: 'Mendung', icon: 'fa-solid fa-cloud', color: '#94a3b8' },
    45: { desc: 'Berkabut', icon: 'fa-solid fa-smog', color: '#94a3b8' },
    48: { desc: 'Rime Kabut', icon: 'fa-solid fa-smog', color: '#cbd5e1' },
    51: { desc: 'Gerimis Ringan', icon: 'fa-solid fa-cloud-rain', color: '#60a5fa' },
    53: { desc: 'Gerimis Sedang', icon: 'fa-solid fa-cloud-rain', color: '#3b82f6' },
    55: { desc: 'Gerimis Lebat', icon: 'fa-solid fa-cloud-showers-heavy', color: '#2563eb' },
    61: { desc: 'Hujan Ringan', icon: 'fa-solid fa-cloud-rain', color: '#3b82f6' },
    63: { desc: 'Hujan Sedang', icon: 'fa-solid fa-cloud-showers-heavy', color: '#1d4ed8' },
    65: { desc: 'Hujan Lebat', icon: 'fa-solid fa-cloud-showers-heavy', color: '#1e3a8a' },
    71: { desc: 'Salju Ringan', icon: 'fa-solid fa-snowflake', color: '#93c5fd' },
    73: { desc: 'Salju Sedang', icon: 'fa-solid fa-snowflake', color: '#bfdbfe' },
    75: { desc: 'Salju Lebat', icon: 'fa-solid fa-snowflake', color: '#eff6ff' },
    80: { desc: 'Hujan Pancaroba Ringan', icon: 'fa-solid fa-cloud-rain', color: '#60a5fa' },
    81: { desc: 'Hujan Pancaroba Sedang', icon: 'fa-solid fa-cloud-showers-heavy', color: '#3b82f6' },
    82: { desc: 'Hujan Pancaroba Lebat', icon: 'fa-solid fa-cloud-showers-water', color: '#1d4ed8' },
    95: { desc: 'Badai Petir', icon: 'fa-solid fa-cloud-bolt', color: '#a855f7' },
    96: { desc: 'Badai Petir dengan Hujan Es Ringan', icon: 'fa-solid fa-cloud-bolt', color: '#d8b4fe' },
    99: { desc: 'Badai Petir dengan Hujan Es Lebat', icon: 'fa-solid fa-cloud-bolt', color: '#c084fc' }
  };

  const FALLBACK_WEATHER = {
    'JAKARTA': { temp: 31.5, humidity: 78, windSpeed: 12, precip: 1.2, code: 2, country: 'Indonesia' },
    'SURABAYA': { temp: 33.0, humidity: 70, windSpeed: 15, precip: 0.0, code: 0, country: 'Indonesia' },
    'TOKYO': { temp: 18.2, humidity: 62, windSpeed: 8, precip: 0.0, code: 1, country: 'Jepang' },
    'LONDON': { temp: 12.4, humidity: 85, windSpeed: 20, precip: 3.4, code: 61, country: 'Britania Raya' },
    'NEW YORK': { temp: 22.1, humidity: 55, windSpeed: 10, precip: 0.0, code: 3, country: 'Amerika Serikat' }
  };

  // Panggil Inisialisasi Aplikasi
  initApp();

  function initApp() {
    startClock();
    loadWatchlistFromStorage();
    refreshAllWeatherData();
    setupCalculator();
  }

  // Jam Realtime di Header
  function startClock() {
    setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      $('#current-time').text(timeStr);
    }, 1000);
  }

  function loadWatchlistFromStorage() {
    const stored = localStorage.getItem('tempcast_watchlist');
    if (stored) {
      cityWatchlist = JSON.parse(stored);
    }
  }

  function saveWatchlistToStorage() {
    localStorage.setItem('tempcast_watchlist', JSON.stringify(cityWatchlist));
  }

  // Refresh data semua kota
  function refreshAllWeatherData() {
    showShimmer();
    activeWeatherData = {};
    let loadedCount = 0;
    const totalToLoad = cityWatchlist.length;

    if (totalToLoad === 0) {
      renderCitiesGrid();
      updateMainBanner(null);
      return;
    }

    cityWatchlist.forEach(function (cityName) {
      fetchWeatherData(cityName, function (data) {
        activeWeatherData[cityName.toUpperCase()] = data;
        loadedCount++;
        if (loadedCount === totalToLoad) {
          renderCitiesGrid();
          // Set kota pertama sebagai highlight utama di banner
          const firstCityKey = cityWatchlist[0].toUpperCase();
          if (activeWeatherData[firstCityKey]) {
            updateMainBanner(activeWeatherData[firstCityKey]);
          }
        }
      });
    });
  }

  // AJAX Fetch Data Cuaca
  function fetchWeatherData(cityName, callback) {
    const cleanCity = cityName.trim();
    const cleanCityUpper = cleanCity.toUpperCase();
    
    // Step 1: Geocoding API untuk mencari Lat/Long kota
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCity)}&count=1&language=id&format=json`;

    $.ajax({
      url: geoUrl,
      type: 'GET',
      dataType: 'json',
      timeout: 5000,
      success: function (geoResponse) {
        if (geoResponse.results && geoResponse.results[0]) {
          const result = geoResponse.results[0];
          const lat = result.latitude;
          const lon = result.longitude;
          const country = result.country || 'N/A';
          const officialName = result.name;

          // Step 2: Forecast API untuk mendapatkan data cuaca saat ini
          const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m`;

          $.ajax({
            url: weatherUrl,
            type: 'GET',
            dataType: 'json',
            timeout: 5000,
            success: function (weatherResponse) {
              if (weatherResponse.current) {
                const cur = weatherResponse.current;
                const weatherData = {
                  cityName: officialName,
                  country: country,
                  temp: cur.temperature_2m,
                  apparentTemp: cur.apparent_temperature,
                  humidity: cur.relative_humidity_2m,
                  windSpeed: cur.wind_speed_10m,
                  precipitation: cur.precipitation,
                  weatherCode: cur.weather_code
                };
                callback(weatherData);
              } else {
                callback(getFallbackData(cleanCityUpper));
              }
            },
            error: function () {
              callback(getFallbackData(cleanCityUpper));
            }
          });
        } else {
          callback(getFallbackData(cleanCityUpper));
        }
      },
      error: function () {
        callback(getFallbackData(cleanCityUpper));
      }
    });
  }

  // Fallback Data jika API error/offline
  function getFallbackData(cityNameUpper) {
    let base = FALLBACK_WEATHER[cityNameUpper];
    if (!base) {
      // Buat data acak yang realistis
      const randomTemp = parseFloat((Math.random() * 25 + 10).toFixed(1)); // 10 to 35 C
      base = {
        temp: randomTemp,
        humidity: Math.floor(Math.random() * 40) + 50, // 50 to 90%
        windSpeed: Math.floor(Math.random() * 25) + 5,  // 5 to 30 km/h
        precip: parseFloat((Math.random() * 5).toFixed(1)),
        code: [0, 1, 2, 3, 61, 95][Math.floor(Math.random() * 6)],
        country: 'Global'
      };
      FALLBACK_WEATHER[cityNameUpper] = base;
    }

    return {
      cityName: cityNameUpper.charAt(0) + cityNameUpper.slice(1).toLowerCase(),
      country: base.country,
      temp: base.temp,
      apparentTemp: parseFloat((base.temp + (Math.random() * 2 - 1)).toFixed(1)),
      humidity: base.humidity,
      windSpeed: base.windSpeed,
      precipitation: base.precip,
      weatherCode: base.code
    };
  }

  // Update Tampilan Banner Utama
  function updateMainBanner(data) {
    if (!data) {
      $('#main-city-name').text('Pilih atau Tambah Kota');
      $('#main-temp-val').text('--');
      $('#main-temp-f').text('--');
      $('#main-temp-r').text('--');
      $('#main-temp-k').text('--');
      $('#main-weather-desc').text('');
      $('#main-weather-icon').attr('class', 'fa-solid fa-cloud-sun weather-main-icon');
      return;
    }

    const info = getWeatherInfo(data.weatherCode);
    $('#main-city-name').text(`${data.cityName}, ${data.country}`);
    $('#main-temp-val').text(data.temp.toFixed(1));
    $('#main-weather-desc').text(info.desc);
    
    // Set ikon & warnanya
    $('#main-weather-icon').attr('class', `${info.icon} weather-main-icon`).css('color', info.color);

    // Hitung konversi
    const fahr = convertTemp(data.temp, 'C', 'F');
    const rea = convertTemp(data.temp, 'C', 'R');
    const kel = convertTemp(data.temp, 'C', 'K');

    $('#main-temp-f').text(fahr.toFixed(1));
    $('#main-temp-r').text(rea.toFixed(1));
    $('#main-temp-k').text(kel.toFixed(0));
  }

  // Render Grid Kota-kota Pantauan
  function renderCitiesGrid() {
    const container = $('#cities-container');
    container.empty();
    let count = 0;

    cityWatchlist.forEach(function (cityName) {
      const key = cityName.toUpperCase();
      const data = activeWeatherData[key];
      if (!data) return;

      count++;
      const info = getWeatherInfo(data.weatherCode);
      const fahr = convertTemp(data.temp, 'C', 'F');
      const rea = convertTemp(data.temp, 'C', 'R');
      const kel = convertTemp(data.temp, 'C', 'K');

      const cardHtml = `
        <div class="weather-card" data-city-key="${key}">
          <button class="btn-remove-city" data-city-name="${cityName}" title="Hapus Kota">
            <i class="fa-solid fa-trash"></i>
          </button>
          <div class="card-top">
            <div>
              <span class="card-city">${data.cityName}</span>
              <span class="card-country">${data.country}</span>
            </div>
          </div>
          <div class="card-middle">
            <span class="card-temp">${data.temp.toFixed(1)}°C</span>
            <i class="${info.icon} card-icon" style="color: ${info.color}"></i>
          </div>
          <div class="card-bottom">
            <div class="card-conv-unit">
              <span class="unit-val">${fahr.toFixed(1)}°F</span>
              <span class="unit-lbl">Fahr</span>
            </div>
            <div class="card-conv-unit">
              <span class="unit-val">${rea.toFixed(1)}°R</span>
              <span class="unit-lbl">Rea</span>
            </div>
            <div class="card-conv-unit">
              <span class="unit-val">${kel.toFixed(0)}K</span>
              <span class="unit-lbl">Kelv</span>
            </div>
          </div>
        </div>
      `;
      container.append(cardHtml);
    });

    $('#watchlist-count').text(count);

    if (count === 0) {
      container.append(`
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-cloud-sun-rain" style="font-size: 48px; margin-bottom: 15px; display: block; color: rgba(255,255,255,0.1);"></i>
          Belum ada kota yang dipantau. Tambahkan kota baru di atas.
        </div>
      `);
    }
  }

  // Pembantu pencarian ikon & deskripsi cuaca
  function getWeatherInfo(code) {
    return WEATHER_CODES[code] || { desc: 'Cuaca Tidak Diketahui', icon: 'fa-solid fa-cloud', color: '#94a3b8' };
  }

  // Tampilkan Shimmer Loading
  function showShimmer() {
    $('#cities-container').html(`
      <div class="shimmer-wrapper">
        <div class="shimmer-card"></div>
        <div class="shimmer-card"></div>
        <div class="shimmer-card"></div>
      </div>
    `);
  }

  // Logika Kalkulator Konversi
  function setupCalculator() {
    // Jalankan kalkulasi pertama kali
    performCalc();

    // Event listeners
    $('#calc-value').on('input', performCalc);
    $('#calc-from, #calc-to').on('change', performCalc);

    // Tombol Swap
    $('#btn-swap-units').on('click', function () {
      const fromVal = $('#calc-from').val();
      const toVal = $('#calc-to').val();
      
      $('#calc-from').val(toVal);
      $('#calc-to').val(fromVal);
      
      performCalc();
    });
  }

  function performCalc() {
    const val = parseFloat($('#calc-value').val());
    if (isNaN(val)) {
      $('#calc-result-value').text('--');
      return;
    }

    const fromUnit = $('#calc-from').val();
    const toUnit = $('#calc-to').val();
    const result = convertTemp(val, fromUnit, toUnit);

    $('#calc-result-value').text(result.toFixed(2));
    
    // Label Unit
    const unitLabels = { C: '°C', F: '°F', R: '°R', K: 'K' };
    $('#calc-result-unit').text(unitLabels[toUnit]);
  }

  // Fungsi Inti Konversi Suhu
  function convertTemp(value, from, to) {
    if (from === to) return value;

    // Pertama, konversi dari asal ke Celsius
    let celsius;
    if (from === 'C') {
      celsius = value;
    } else if (from === 'F') {
      celsius = (value - 32) / 1.8;
    } else if (from === 'R') {
      celsius = value / 0.8;
    } else if (from === 'K') {
      celsius = value - 273.15;
    }

    // Kedua, konversi dari Celsius ke tujuan
    if (to === 'C') {
      return celsius;
    } else if (to === 'F') {
      return celsius * 1.8 + 32;
    } else if (to === 'R') {
      return celsius * 0.8;
    } else if (to === 'K') {
      return celsius + 273.15;
    }
    return value;
  }

  // Event Handler Auto-Search & Form Pencarian
  let searchTimeout;
  $('#city-input').on('input', function () {
    const query = $(this).val().trim();
    if (!query) {
      $('.weather-card').show();
      return;
    }

    // Filter lokal kartu kota yang sudah ada
    $('.weather-card').each(function () {
      const cityKey = $(this).data('city-key').toLowerCase();
      if (cityKey.includes(query.toLowerCase())) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });

    // Otomatis fetch data dari API jika mengetik kota baru (min 3 karakter) setelah delay 1 detik
    clearTimeout(searchTimeout);
    if (query.length >= 3) {
      searchTimeout = setTimeout(function () {
        const key = query.toUpperCase();
        if (!cityWatchlist.map(c => c.toUpperCase()).includes(key)) {
          fetchWeatherData(query, function (data) {
            if (!cityWatchlist.map(c => c.toUpperCase()).includes(data.cityName.toUpperCase())) {
              cityWatchlist.push(data.cityName);
              saveWatchlistToStorage();
              activeWeatherData[data.cityName.toUpperCase()] = data;
              renderCitiesGrid();
              updateMainBanner(data);
              $('#city-input').val('');
            }
          });
        }
      }, 1000);
    }
  });

  $('#search-city-form').on('submit', function (e) {
    e.preventDefault();
    clearTimeout(searchTimeout);
    const newCity = $('#city-input').val().trim();
    if (!newCity) return;

    const key = newCity.toUpperCase();
    if (cityWatchlist.map(c => c.toUpperCase()).includes(key)) {
      $('#city-input').val('');
      return;
    }

    showShimmer();
    fetchWeatherData(newCity, function (data) {
      if (!cityWatchlist.map(c => c.toUpperCase()).includes(data.cityName.toUpperCase())) {
        cityWatchlist.push(data.cityName);
        saveWatchlistToStorage();
        activeWeatherData[data.cityName.toUpperCase()] = data;
        $('#city-input').val('');
        refreshAllWeatherData();
      }
    });
  });

  // Event Handler Hapus Kota
  $(document).on('click', '.btn-remove-city', function (e) {
    e.stopPropagation();
    const nameToRemove = $(this).data('city-name');
    cityWatchlist = cityWatchlist.filter(c => c.toUpperCase() !== nameToRemove.toUpperCase());
    saveWatchlistToStorage();
    delete activeWeatherData[nameToRemove.toUpperCase()];
    renderCitiesGrid();

    // Reset banner jika list kosong
    if (cityWatchlist.length > 0) {
      updateMainBanner(activeWeatherData[cityWatchlist[0].toUpperCase()]);
    } else {
      updateMainBanner(null);
    }
  });

  // Klik Kartu untuk Modal Detail
  $(document).on('click', '.weather-card', function () {
    const key = $(this).data('city-key');
    const data = activeWeatherData[key];
    if (!data) return;

    // Banner Utama update fokus ke kota yang diklik
    updateMainBanner(data);

    const info = getWeatherInfo(data.weatherCode);

    // Isi Modal
    $('#modal-city-name').text(`${data.cityName}, ${data.country}`);
    $('#modal-weather-desc').text(info.desc);
    $('#modal-temp-tag').text(`${data.temp.toFixed(1)} °C`);

    $('#modal-apparent-temp').text(`${data.apparentTemp.toFixed(1)} °C`);
    $('#modal-humidity').text(`${data.humidity} %`);
    $('#modal-wind-speed').text(`${data.windSpeed} km/h`);
    $('#modal-precipitation').text(`${data.precipitation} mm`);

    // Konversi lengkap
    $('#detail-c').text(`${data.temp.toFixed(1)} °C`);
    $('#detail-f').text(`${convertTemp(data.temp, 'C', 'F').toFixed(1)} °F`);
    $('#detail-r').text(`${convertTemp(data.temp, 'C', 'R').toFixed(1)} °R`);
    $('#detail-k').text(`${convertTemp(data.temp, 'C', 'K').toFixed(0)} K`);

    $('#detail-modal').addClass('active');

    // Gambar Grafik Tren Suhu
    drawSparkline(key, data.temp);
  });

  // Tutup Modal
  $('#btn-close-modal, #detail-modal').on('click', function (e) {
    if (e.target === this || this.id === 'btn-close-modal') {
      $('#detail-modal').removeClass('active');
    }
  });

  // Fungsi menggambar grafik simulasi suhu harian
  function drawSparkline(cityKey, currentTemp) {
    const canvas = document.getElementById('sparkline-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 150;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Buat data riwayat temperatur jika belum ada (simulasi 24 jam)
    if (!simulatedHistory[cityKey]) {
      const historyPoints = [];
      let base = currentTemp;
      for (let i = 0; i < 24; i++) {
        // Suhu biasanya turun malam hari dan naik siang hari
        const hour = i;
        const timeFactor = Math.sin((hour - 6) * Math.PI / 12); // Puncak pada jam 12-14 siang
        const tempAtHour = base + (timeFactor * 4) + (Math.random() * 1.5 - 0.75);
        historyPoints.push(tempAtHour);
      }
      simulatedHistory[cityKey] = historyPoints;
    }

    const history = simulatedHistory[cityKey];
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min === 0 ? 1 : max - min;

    const lineColor = '#3b82f6';
    const fillGradient = ctx.createLinearGradient(0, 0, 0, height);
    fillGradient.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
    fillGradient.addColorStop(1, 'rgba(19, 26, 44, 0)');

    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const pointsCount = history.length;
    const stepX = width / (pointsCount - 1);

    history.forEach((val, i) => {
      const x = i * stepX;
      const y = height - 20 - ((val - min) / range) * (height - 40);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    ctx.lineTo((pointsCount - 1) * stepX, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = fillGradient;
    ctx.fill();

    // Gambar label suhu minimal dan maksimal di atas kanvas
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Outfit';
    ctx.fillText(`Min: ${min.toFixed(1)}°C`, 10, height - 10);
    ctx.fillText(`Max: ${max.toFixed(1)}°C`, width - 80, height - 10);
  }
});
