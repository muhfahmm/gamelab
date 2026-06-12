$(function () {
    const apiKey = 'thewdb';
    const $input = $('#searchInput');
    const $button = $('#searchButton');
    const $alert = $('#alertMessage');
    const $results = $('#resultSection');
    const $recs = $('#recommendationsSection');
    const $watchlist = $('#watchlistSection');

    let watchlistData = [];

    // Inisialisasi Aplikasi
    initApp();

    function initApp() {
        loadWatchlist();
        loadRecommendations();
        setupModal();
    }

    // Pemuatan data Watchlist dari LocalStorage
    function loadWatchlist() {
        const stored = localStorage.getItem('movie_watchlist');
        if (stored) {
            watchlistData = JSON.parse(stored);
        }
        renderWatchlist();
    }

    function saveWatchlist() {
        localStorage.setItem('movie_watchlist', JSON.stringify(watchlistData));
        renderWatchlist();
    }

    function renderWatchlist() {
        const $list = $('#watchlistList');
        $list.empty();

        if (watchlistData.length === 0) {
            $watchlist.addClass('hidden');
            return;
        }

        $watchlist.removeClass('hidden');
        watchlistData.forEach(function (movie) {
            const card = $('<div>').addClass('watchlist-card');
            
            // Tombol Hapus Watchlist
            const removeBtn = $('<button>').addClass('btn-remove-watchlist').html('<i class="fa-solid fa-trash"></i>');
            removeBtn.on('click', function (e) {
                e.stopPropagation();
                toggleWatchlist(movie);
            });

            const poster = movie.Poster === 'N/A' ? 'https://via.placeholder.com/114x160?text=No+Image' : movie.Poster;
            const img = $('<img>').attr('src', poster).attr('alt', movie.Title);
            const title = $('<div>').addClass('watchlist-card-title').text(movie.Title);

            card.on('click', function () {
                fetchMovieDetail(movie.imdbID);
            });

            card.append(removeBtn, img, title);
            $list.append(card);
        });
    }

    function toggleWatchlist(movie) {
        const index = watchlistData.findIndex(item => item.imdbID === movie.imdbID);
        if (index > -1) {
            watchlistData.splice(index, 1); // Hapus
        } else {
            watchlistData.push(movie); // Tambah
        }
        saveWatchlist();

        // Sync visual hearts across current cards
        updateHeartIcons();
    }

    function updateHeartIcons() {
        $('.btn-watchlist-toggle').each(function () {
            const id = $(this).data('imdb-id');
            const isInWatchlist = watchlistData.some(item => item.imdbID === id);
            if (isInWatchlist) {
                $(this).addClass('active').html('<i class="fa-solid fa-heart"></i>');
            } else {
                $(this).removeClass('active').html('<i class="fa-regular fa-heart"></i>');
            }
        });
    }

    // Modal popup setup
    function setupModal() {
        $('#closeModal, #movieModal').on('click', function (e) {
            if (e.target === this || this.id === 'closeModal' || $(e.target).closest('#closeModal').length > 0) {
                $('#movieModal').removeClass('active');
            }
        });
    }

    // Pemuatan Rekomendasi Pilihan di Awal
    function loadRecommendations() {
        const $recList = $('#recommendationList');
        showSkeleton($recList, 4);

        $.ajax({
            url: 'https://www.omdbapi.com/',
            method: 'GET',
            data: {
                apikey: apiKey,
                s: 'Avengers'
            },
            success: function (response) {
                if (response.Response === 'True' && response.Search.length > 0) {
                    // Ambil 4 film populer
                    renderCards(response.Search.slice(0, 4), $recList);
                } else {
                    $recList.html('<p style="color: var(--text-muted)">Gagal memuat rekomendasi.</p>');
                }
            },
            error: function () {
                $recList.html('<p style="color: var(--text-muted)">Gagal memuat rekomendasi.</p>');
            }
        });
    }

    // Efek Skeleton Loading
    function showSkeleton($container, count = 3) {
        $container.empty();
        for (let i = 0; i < count; i++) {
            const card = $('<div>').addClass('movie-card skeleton-card skeleton-shimmer');
            
            const img = $('<div>').addClass('skeleton-bar').css({
                width: '110px',
                height: '165px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px'
            });

            const info = $('<div>').addClass('movie-info').css('width', '100%');
            const title = $('<div>').addClass('skeleton-bar').css({
                width: '85%',
                height: '18px',
                background: 'rgba(255, 255, 255, 0.05)',
                marginBottom: '10px'
            });
            const sub1 = $('<div>').addClass('skeleton-bar').css({
                width: '45%',
                height: '14px',
                background: 'rgba(255, 255, 255, 0.04)',
                marginBottom: '6px'
            });
            const sub2 = $('<div>').addClass('skeleton-bar').css({
                width: '55%',
                height: '14px',
                background: 'rgba(255, 255, 255, 0.04)',
                marginBottom: '16px'
            });
            const btn = $('<div>').addClass('skeleton-bar').css({
                width: '90px',
                height: '32px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px'
            });

            info.append(title, sub1, sub2, btn);
            card.append(img, info);
            $container.append(card);
        }
    }

    // Render kartu film ke kontainer tertentu
    function renderCards(movies, $container) {
        $container.empty();
        movies.forEach(function (movie) {
            const poster = movie.Poster === 'N/A' ? 'https://via.placeholder.com/110x165?text=No+Image' : movie.Poster;
            const card = $('<div>').addClass('movie-card');
            
            // Ikon Hati / Watchlist Toggle
            const isInWatchlist = watchlistData.some(item => item.imdbID === movie.imdbID);
            const heartIcon = isInWatchlist ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
            const heartBtn = $('<button>')
                .addClass('btn-watchlist-toggle')
                .data('imdb-id', movie.imdbID)
                .html(heartIcon);
            
            if (isInWatchlist) heartBtn.addClass('active');

            heartBtn.on('click', function (e) {
                e.stopPropagation();
                toggleWatchlist(movie);
            });

            const image = $('<img>').attr('src', poster).attr('alt', movie.Title);
            const info = $('<div>').addClass('movie-info');
            const title = $('<h2>').text(movie.Title);
            const year = $('<span>').text('Tahun: ' + movie.Year);
            const type = $('<span>').text('Tipe: ' + movie.Type);
            
            const button = $('<button>').addClass('detail-button').text('Lihat Detail');
            button.on('click', function () {
                fetchMovieDetail(movie.imdbID);
            });

            info.append(title, year, type, button);
            card.append(heartBtn, image, info);
            $container.append(card);
        });
    }

    // Fetch Detail via AJAX ke modal popup
    function fetchMovieDetail(id) {
        $alert.text('Memuat detail...');
        $.ajax({
            url: 'https://www.omdbapi.com/',
            method: 'GET',
            data: {
                apikey: apiKey,
                i: id,
                plot: 'full'
            },
            success: function (response) {
                $alert.text('');
                if (response.Response === 'True') {
                    renderDetail(response);
                } else {
                    $alert.text('Detail film tidak ditemukan.');
                }
            },
            error: function () {
                $alert.text('Terjadi kesalahan saat mengambil detail film.');
            }
        });
    }

    function renderDetail(data) {
        const poster = data.Poster === 'N/A' ? 'https://via.placeholder.com/180x270?text=No+Image' : data.Poster;
        const html = `
            <div class="modal-detail-layout">
                <img src="${poster}" alt="${data.Title}">
                <div class="modal-info-block">
                    <h2>${data.Title} (${data.Year})</h2>
                    <p class="plot">${data.Plot === 'N/A' ? 'Plot tidak tersedia.' : data.Plot}</p>
                    <div class="modal-meta-grid">
                        <div class="modal-meta-box"><span>Genre</span><p>${data.Genre}</p></div>
                        <div class="modal-meta-box"><span>Durasi</span><p>${data.Runtime}</p></div>
                        <div class="modal-meta-box"><span>Rating IMDb</span><p><i class="fa-solid fa-star" style="color: #f59e0b"></i> ${data.imdbRating}</p></div>
                        <div class="modal-meta-box"><span>Sutradara</span><p>${data.Director}</p></div>
                        <div class="modal-meta-box"><span>Pemain</span><p>${data.Actors}</p></div>
                    </div>
                </div>
            </div>
        `;
        $('#modalBody').html(html);
        $('#movieModal').addClass('active');
    }

    // Pencarian Paralel (Movie, Series, Game)
    function searchMovies() {
        const query = $input.val().trim();
        if (query.length === 0) {
            $alert.text('Masukkan judul film terlebih dahulu.');
            return;
        }

        $alert.text('');
        $recs.addClass('hidden'); // Sembunyikan rekomendasi
        $results.removeClass('hidden'); // Tampilkan hasil pencarian

        // Tampilkan Loading Shimmer pada masing-masing blok kategori
        $('#moviesCategory').removeClass('hidden');
        $('#seriesCategory').removeClass('hidden');
        $('#gamesCategory').removeClass('hidden');

        showSkeleton($('#moviesList'), 3);
        showSkeleton($('#seriesList'), 3);
        showSkeleton($('#gamesList'), 3);

        const types = ['movie', 'series', 'game'];
        let activeRequests = 3;
        let anyResult = false;

        types.forEach(function (type) {
            $.ajax({
                url: 'https://www.omdbapi.com/',
                method: 'GET',
                data: {
                    apikey: apiKey,
                    s: query,
                    type: type
                },
                success: function (response) {
                    const $list = $(`#${type}sList`);
                    const $block = $(`#${type}sCategory`);

                    if (response.Response === 'True' && response.Search.length > 0) {
                        anyResult = true;
                        $block.removeClass('hidden');
                        renderCards(response.Search, $list);
                    } else {
                        $block.addClass('hidden'); // Sembunyikan kategori jika tidak ada hasil
                    }
                },
                complete: function () {
                    activeRequests--;
                    if (activeRequests === 0) {
                        if (!anyResult) {
                            $alert.text('Film tidak ditemukan. Coba kata kunci lain.');
                            $results.addClass('hidden');
                        }
                    }
                }
            });
        });
    }

    // Event Bindings
    $button.on('click', function () {
        searchMovies();
    });
    $input.on('keypress', function (event) {
        if (event.key === 'Enter') {
            searchMovies();
        }
    });
});