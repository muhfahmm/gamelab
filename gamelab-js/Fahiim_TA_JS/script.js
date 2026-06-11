$(function () {
    const apiKey = 'thewdb';
    const $input = $('#searchInput');
    const $button = $('#searchButton');
    const $alert = $('#alertMessage');
    const $list = $('#movieList');
    const $detail = $('#movieDetail');
    function showAlert(message) {
        $alert.text(message);
    }
    function clearResults() {
        $list.empty();
        $detail.addClass('hidden').empty();
    }
    function renderResults(movies) {
        clearResults();
        movies.forEach(function (movie) {
            const poster = movie.Poster === 'N/A' ? 'https://via.placeholder.com/140x210?text=No+Image' : movie.Poster;
            const card = $('<div>').addClass('movie-card');
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
            card.append(image, info);
            $list.append(card);
        });
    }
    function renderDetail(data) {
        $detail.removeClass('hidden').empty();
        const title = $('<h2>').text(data.Title + ' (' + data.Year + ')');
        const plot = $('<p>').text(data.Plot);
        const meta = $('<div>').addClass('meta');
        const details = [
            { label: 'Genre', value: data.Genre },
            { label: 'Durasi', value: data.Runtime },
            { label: 'Rating', value: data.imdbRating },
            { label: 'Direktur', value: data.Director },
            { label: 'Pemain', value: data.Actors },
        ];
        details.forEach(function (item) {
            const block = $('<div>');
            const label = $('<span>').text(item.label);
            const value = $('<p>').text(item.value);
            block.append(label, value);
            meta.append(block);
        });
        $detail.append(title, plot, meta);
    }
    function fetchMovieDetail(id) {
        $.ajax({
            url: 'https://www.omdbapi.com/',
            method: 'GET',
            data: {
                apikey: apiKey,
                i: id,
                plot: 'full'
            },
            success: function (response) {
                if (response.Response === 'True') {
                    renderDetail(response);
                } else {
                    showAlert('Detail film tidak ditemukan.');
                }
            },
            error: function () {
                showAlert('Terjadi kesalahan saat mengambil detail film.');
            }
        });
    }
    function searchMovies() {
        const query = $input.val().trim();
        if (query.length === 0) {
            showAlert('Masukkan judul film terlebih dahulu.');
            return;
        }
        showAlert('Memuat...');
        $.ajax({
            url: 'https://www.omdbapi.com/',
            method: 'GET',
            data: {
                apikey: apiKey,
                s: query
            },
            success: function (response) {
                if (response.Response === 'True' && response.Search.length > 0) {
                    showAlert('');
                    renderResults(response.Search);
                } else {
                    clearResults();
                    showAlert('Film tidak ditemukan. Coba kata kunci lain.');
                }
            },
            error: function () {
                clearResults();
                showAlert('Tidak dapat terhubung ke API film.');
            }
        });
    }
    $button.on('click', function () {
        searchMovies();
    });
    $input.on('keypress', function (event) {
        if (event.key === 'Enter') {
            searchMovies();
        }
    });
});