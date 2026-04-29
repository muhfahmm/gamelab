
function cekKriteria() {
    const kawasan = document.getElementById('kawasan').value;
    const luasTanah = parseInt(document.getElementById('luasTanah').value) || 0;
    const luasBangunan = parseInt(document.getElementById('luasBangunan').value) || 0;
    const kolamRenang = document.getElementById('kolamRenang').checked;
    const parkirLuas = document.getElementById('parkirLuas').checked;
    const kebunBelakang = document.getElementById('kebunBelakang').checked;

    const resultContainer = document.getElementById('resultContainer');
    const resultCard = document.getElementById('resultCard');
    const statusBadge = document.getElementById('statusBadge');
    const resultTitle = document.getElementById('resultTitle');
    const criteriaList = document.getElementById('criteriaList');

    let isLulus = true;
    let feedback = [];

    if (kawasan === 'aman') {
        feedback.push({ text: 'Kawasan aman dari banjir & longsor', pass: true });
    } else {
        isLulus = false;
        feedback.push({ text: `Kawasan ditolak: ${kawasan}`, pass: false });
    }

    if (luasTanah >= 800) {
        feedback.push({ text: `Luas tanah mencukupi (${luasTanah} m²)`, pass: true });
    } else {
        isLulus = false;
        feedback.push({ text: `Luas tanah minimal 800 m² (Saat ini: ${luasTanah} m²)`, pass: false });
    }

    if (luasBangunan >= 400) {
        feedback.push({ text: `Luas bangunan mencukupi (${luasBangunan} m²)`, pass: true });
    } else {
        isLulus = false;
        feedback.push({ text: `Luas bangunan minimal 400 m² (Saat ini: ${luasBangunan} m²)`, pass: false });
    }

    if (kolamRenang && parkirLuas && kebunBelakang) {
        feedback.push({ text: 'Semua fasilitas tersedia', pass: true });
    } else {
        isLulus = false;
        let missing = [];
        if (!kolamRenang) missing.push('Kolam Renang');
        if (!parkirLuas) missing.push('Parkir Luas');
        if (!kebunBelakang) missing.push('Kebun Belakang');
        feedback.push({ text: `Fasilitas kurang: ${missing.join(', ')}`, pass: false });
    }

    resultContainer.style.display = 'block';
    criteriaList.innerHTML = '';

    feedback.forEach(item => {
        const div = document.createElement('div');
        div.className = 'criteria-item';
        div.innerHTML = `
            <span class="${item.pass ? 'icon-check' : 'icon-cross'}">
                ${item.pass ? '✓' : '✗'}
            </span>
            <span>${item.text}</span>
        `;
        criteriaList.appendChild(div);
    });

    if (isLulus) {
        resultCard.className = 'result-card success';
        statusBadge.textContent = 'MEMENUHI KRITERIA';
        resultTitle.textContent = 'Selamat! Rumah ini cocok untuk Andi.';
    } else {
        resultCard.className = 'result-card fail';
        statusBadge.textContent = 'TIDAK MEMENUHI';
        resultTitle.textContent = 'Maaf, rumah ini tidak sesuai kriteria Andi.';
    }

    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

