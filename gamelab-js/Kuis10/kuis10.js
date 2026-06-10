$(document).ready(function () {
  let watchlist = ['BBCA', 'BBRI', 'BMRI', 'TLKM', 'ASII', 'GOTO', 'ADRO', 'UNVR'];
  let activeStockData = {};
  const STOCK_FALLBACKS = {
    '^JKSE': { name: 'IHSG (Indeks Gabungan)', price: 7180.50, prevClose: 7120.30 },
    'BBCA.JK': { name: 'Bank Central Asia Tbk.', price: 10125, prevClose: 10075 },
    'BBRI.JK': { name: 'Bank Rakyat Indonesia Tbk.', price: 4850, prevClose: 4920 },
    'BMRI.JK': { name: 'Bank Mandiri Tbk.', price: 6150, prevClose: 6050 },
    'TLKM.JK': { name: 'Telkom Indonesia Tbk.', price: 3450, prevClose: 3420 },
    'ASII.JK': { name: 'Astra International Tbk.', price: 4720, prevClose: 4800 },
    'GOTO.JK': { name: 'GoTo Gojek Tokopedia Tbk.', price: 62, prevClose: 64 },
    'ADRO.JK': { name: 'Adaro Energy Indonesia Tbk.', price: 2850, prevClose: 2810 },
    'UNVR.JK': { name: 'Unilever Indonesia Tbk.', price: 3120, prevClose: 3150 }
  };

  const simulatedHistory = {};

  initApp();

  function initApp() {
    loadWatchlistFromStorage();
    refreshAllData();
  }

  function loadWatchlistFromStorage() {
    const stored = localStorage.getItem('indostock_watchlist');
    if (stored) {
      watchlist = JSON.parse(stored);
    }
  }

  function saveWatchlistToStorage() {
    localStorage.setItem('indostock_watchlist', JSON.stringify(watchlist));
  }

  function refreshAllData() {
    showShimmer();
    $('#btn-refresh i').addClass('fa-spin');

    fetchStockData('^JKSE', function (ihsgData) {
      updateIHSGWidget(ihsgData);
    });

    let loadedCount = 0;
    const totalToLoad = watchlist.length;
    activeStockData = {};

    if (totalToLoad === 0) {
      hideShimmer();
      renderWatchlist();
      $('#btn-refresh i').removeClass('fa-spin');
      return;
    }

    watchlist.forEach(function (symbol) {
      const fullSymbol = symbol.endsWith('.JK') || symbol === '^JKSE' ? symbol : symbol + '.JK';
      fetchStockData(fullSymbol, function (data) {
        activeStockData[symbol.toUpperCase()] = data;
        loadedCount++;
        if (loadedCount === totalToLoad) {
          hideShimmer();
          renderWatchlist();
          $('#btn-refresh i').removeClass('fa-spin');
        }
      });
    });
  }

  function fetchStockData(symbol, callback) {
    const cleanSymbol = symbol.toUpperCase();
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${cleanSymbol}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    $.ajax({
      url: proxyUrl,
      type: 'GET',
      dataType: 'json',
      timeout: 6000,
      success: function (response) {
        try {
          const innerData = JSON.parse(response.contents);
          if (innerData.chart && innerData.chart.result && innerData.chart.result[0]) {
            const result = innerData.chart.result[0];
            const meta = result.meta;
            const data = {
              symbol: cleanSymbol,
              name: getFallbackName(cleanSymbol),
              price: meta.regularMarketPrice,
              prevClose: meta.chartPreviousClose || meta.regularMarketPrice,
              volume: meta.regularMarketVolume || 'N/A',
              open: meta.regularMarketPrice * 0.99
            };
            callback(data);
            return;
          }
        } catch (e) {
          console.warn(`JSON parsing error for ${cleanSymbol}, using fallback.`, e);
        }
        callback(getFallbackData(cleanSymbol));
      },
      error: function (xhr, status, error) {
        console.warn(`AJAX error fetching ${cleanSymbol}, using fallback.`, error);
        callback(getFallbackData(cleanSymbol));
      }
    });
  }

  function getFallbackName(symbol) {
    if (STOCK_FALLBACKS[symbol]) return STOCK_FALLBACKS[symbol].name;
    return `${symbol.replace('.JK', '')} Perusahaan`;
  }

  function getFallbackData(symbol) {
    let base = STOCK_FALLBACKS[symbol];
    if (!base) {
      const randomPrice = Math.floor(Math.random() * 8000) + 100;
      base = {
        name: `${symbol.replace('.JK', '')} Emiten`,
        price: randomPrice,
        prevClose: randomPrice * (1 + (Math.random() * 0.04 - 0.02))
      };
      STOCK_FALLBACKS[symbol] = base;
    }

    const jitterPercent = (Math.random() * 0.01) - 0.005;
    const currentPrice = Math.round(base.price * (1 + jitterPercent));

    return {
      symbol: symbol,
      name: base.name,
      price: currentPrice,
      prevClose: Math.round(base.prevClose),
      volume: '12.5M',
      open: Math.round(base.prevClose * 1.002)
    };
  }

  function updateIHSGWidget(data) {
    const price = data.price;
    const prevClose = data.prevClose;
    const change = price - prevClose;
    const changePercent = (change / prevClose) * 100;

    $('#ihsg-price').text(formatNumber(price, 2));
    
    const changeText = `${change >= 0 ? '+' : ''}${formatNumber(change, 2)} (${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`;
    const tag = $('#ihsg-change');
    tag.removeClass('up down');
    tag.addClass(change >= 0 ? 'up' : 'down');
    tag.find('span').text(changeText);
    tag.find('i').removeClass('fa-arrow-up fa-arrow-down').addClass(change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down');
  }

  function renderWatchlist() {
    const container = $('#stocks-container');
    container.empty();
    
    let count = 0;
    const query = $('#search-input').val().toLowerCase();

    Object.keys(activeStockData).forEach(function (symbol) {
      if (query && !symbol.toLowerCase().includes(query) && !activeStockData[symbol].name.toLowerCase().includes(query)) {
        return;
      }

      count++;
      const data = activeStockData[symbol];
      const change = data.price - data.prevClose;
      const changePercent = (change / data.prevClose) * 100;
      const isUp = change >= 0;

      const cardHtml = `
        <div class="stock-card" data-symbol="${symbol}">
          <button class="btn-remove-stock" data-symbol="${symbol}" title="Hapus dari daftar pantau">
            <i class="fa-solid fa-trash"></i>
          </button>
          <div class="card-top">
            <div>
              <span class="card-symbol">${symbol}</span>
              <span class="card-name">${data.name}</span>
            </div>
          </div>
          <div class="card-middle">
            <span class="card-price">Rp ${formatNumber(data.price)}</span>
          </div>
          <div class="card-bottom">
            <span class="card-change ${isUp ? 'price-up' : 'price-down'}">
              <i class="fa-solid ${isUp ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}"></i>
              ${isUp ? '+' : ''}${changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      `;
      container.append(cardHtml);
    });

    $('#watchlist-count').text(count);

    if (count === 0) {
      container.append(`
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size: 48px; margin-bottom: 15px; display: block; color: rgba(255,255,255,0.1);"></i>
          Tidak ada emiten yang ditemukan. Silakan tambahkan kode saham baru.
        </div>
      `);
    }
  }

  function showShimmer() {
    $('#stocks-container').html(`
      <div class="shimmer-wrapper">
        <div class="shimmer-card"></div>
        <div class="shimmer-card"></div>
        <div class="shimmer-card"></div>
        <div class="shimmer-card"></div>
      </div>
    `);
  }

  function hideShimmer() {
  }

  function formatNumber(num, decimals = 0) {
    return Number(num).toLocaleString('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  $('#btn-refresh').on('click', function () {
    refreshAllData();
  });

  $('#search-input').on('input', function () {
    renderWatchlist();
  });

  $(document).on('click', '.btn-remove-stock', function (e) {
    e.stopPropagation();
    const sym = $(this).data('symbol');
    watchlist = watchlist.filter(item => item.toUpperCase() !== sym.toUpperCase());
    saveWatchlistToStorage();
    delete activeStockData[sym];
    renderWatchlist();
  });

  $('#add-stock-form').on('submit', function (e) {
    e.preventDefault();
    const inputSym = $('#stock-code-input').val().trim().toUpperCase();
    if (!inputSym) return;

    const cleanSym = inputSym.replace('.JK', '');

    if (watchlist.includes(cleanSym)) {
      alert('Emiten ini sudah ada di watchlist!');
      $('#stock-code-input').val('');
      return;
    }

    const fullSymbol = cleanSym + '.JK';
    showShimmer();
    
    fetchStockData(fullSymbol, function (data) {
      watchlist.push(cleanSym);
      saveWatchlistToStorage();
      activeStockData[cleanSym] = data;
      
      $('#stock-code-input').val('');
      refreshAllData();
    });
  });

  $(document).on('click', '.stock-card', function () {
    const sym = $(this).data('symbol');
    const data = activeStockData[sym];
    if (!data) return;

    const change = data.price - data.prevClose;
    const changePercent = (change / data.prevClose) * 100;
    const isUp = change >= 0;

    $('#modal-stock-symbol').text(data.symbol);
    $('#modal-stock-name').text(data.name);
    $('#modal-stock-price-tag').text(`Rp ${formatNumber(data.price)}`);
    
    const changeValEl = $('#modal-change-val');
    changeValEl.text(`${isUp ? '+' : ''}${formatNumber(change)} (${isUp ? '+' : ''}${changePercent.toFixed(2)}%)`);
    changeValEl.removeClass('price-up price-down').addClass(isUp ? 'price-up' : 'price-down');

    $('#modal-prev-close').text(`Rp ${formatNumber(data.prevClose)}`);
    $('#modal-open-price').text(`Rp ${formatNumber(data.open)}`);
    $('#modal-volume').text(data.volume);

    $('#detail-modal').addClass('active');

    drawSparkline(sym, data.price, isUp);
  });

  $('#btn-close-modal, #detail-modal').on('click', function (e) {
    if (e.target === this || this.id === 'btn-close-modal') {
      $('#detail-modal').removeClass('active');
    }
  });

  function drawSparkline(symbol, currentPrice, isUp) {
    const canvas = document.getElementById('sparkline-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 150;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (!simulatedHistory[symbol]) {
      const historyPoints = [];
      let lastPrice = currentPrice * 0.95;
      for (let i = 0; i < 20; i++) {
        lastPrice = lastPrice * (1 + (Math.random() * 0.02 - 0.009));
        historyPoints.push(lastPrice);
      }
      simulatedHistory[symbol] = historyPoints;
    }

    const history = [...simulatedHistory[symbol]];
    history.push(currentPrice);
    if (history.length > 25) history.shift();
    simulatedHistory[symbol] = history;

    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min === 0 ? 1 : max - min;

    const lineColor = isUp ? '#10b981' : '#ef4444';
    const fillGradient = ctx.createLinearGradient(0, 0, 0, height);
    fillGradient.addColorStop(0, isUp ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)');
    fillGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const pointsCount = history.length;
    const stepX = width / (pointsCount - 1);

    history.forEach((val, i) => {
      const x = i * stepX;
      const y = height - 15 - ((val - min) / range) * (height - 30);
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

    const lastX = (pointsCount - 1) * stepX;
    const lastY = height - 15 - ((currentPrice - min) / range) * (height - 30);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = lineColor;
    ctx.shadowBlur = 8;
    ctx.shadowColor = lineColor;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
});
