function calculateDownload(speedGbps, days) {
    const speedBytesPerSecond = (speedGbps * 1e9) / 8;
    const secondsPerDay = 86400;
    const bytesPerDay = speedBytesPerSecond * secondsPerDay;
    const totalBytes = bytesPerDay * days;
    const totalTerabytes = totalBytes / 1e12;
    return Math.round(totalTerabytes);
}

function calculateSpeed(dataTB, days) {
    const totalBytes = dataTB * 1e12;
    const secondsPerDay = 86400;
    const totalSeconds = days * secondsPerDay;
    const speedBytesPerSecond = totalBytes / totalSeconds;
    const speedGbps = (speedBytesPerSecond * 8) / 1e9;
    return speedGbps;
}

function formatSpeed(speedGbps) {
    if (speedGbps >= 1) {
        return `${speedGbps.toFixed(2)} گیگابیت بر ثانیه`;
    } else {
        const speedMbps = speedGbps * 1000;
        return `${speedMbps.toFixed(2)} مگابیت بر ثانیه`;
    }
}

function updateChart(speed, days) {
    const speeds = [0.05, 0.1, 0.2, 0.5, 1, 2, 5];
    const labels = speeds.map(s => `${s * 1000} Mbps`);
    const data = speeds.map(s => calculateDownload(s, days));
    const isLightTheme = document.body.classList.contains('light-theme');

    const ctx = document.getElementById('downloadChart').getContext('2d');
    if (window.downloadChart) window.downloadChart.destroy(); // حذف نمودار قبلی
    window.downloadChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'حجم دانلود (ترابایت)',
                data: data,
                backgroundColor: isLightTheme ? 'rgba(74, 144, 226, 0.4)' : 'rgba(255, 215, 0, 0.4)',
                borderColor: isLightTheme ? '#4a90e2' : '#ffd700',
                borderWidth: 1
            }]
        },
        options: {
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { labels: { font: { family: 'Yekan' } } } },
            animation: { duration: 1000, easing: 'easeOutQuart' }
        }
    });
}

document.getElementById('downloadForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const speed = parseFloat(document.getElementById('speed').value);
    const days = parseInt(document.getElementById('days').value, 10);
    const resultElement = document.getElementById('result');

    if (speed <= 0 || days <= 0 || isNaN(speed) || isNaN(days)) {
        resultElement.innerHTML = '<div class="alert alert-danger fade-in">لطفاً مقادیر معتبر (بزرگ‌تر از صفر) وارد کنید!</div>';
        return;
    }

    const result = calculateDownload(speed, days);
    resultElement.innerHTML = `در <strong>${days} روز</strong> با سرعت <strong>${speed} گیگابیت بر ثانیه</strong>، شما می‌توانید تقریبا <strong>${result} ترابایت</strong> داده دانلود کنید.`;
    resultElement.classList.add('fade-in');
    updateChart(speed, days);
});

document.getElementById('speedForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const data = parseFloat(document.getElementById('data').value);
    const days = parseInt(document.getElementById('daysForSpeed').value, 10);
    const resultElement = document.getElementById('result');

    if (data <= 0 || days <= 0 || isNaN(data) || isNaN(days)) {
        resultElement.innerHTML = '<div class="alert alert-danger fade-in">لطفاً مقادیر معتبر (بزرگ‌تر از صفر) وارد کنید!</div>';
        return;
    }

    const resultSpeedGbps = calculateSpeed(data, days);
    const formattedSpeed = formatSpeed(resultSpeedGbps);
    resultElement.innerHTML = `برای دانلود <strong>${data} ترابایت</strong> داده در <strong>${days} روز</strong>، شما نیاز به پهنای باند <strong>${formattedSpeed}</strong> دارید.`;
    resultElement.classList.add('fade-in');
});

document.getElementById('switchToSpeedForm').addEventListener('click', function () {
    document.getElementById('form-container').classList.add('d-none');
    document.getElementById('speedFormContainer').classList.remove('d-none');
});

document.getElementById('switchToDownloadForm').addEventListener('click', function () {
    document.getElementById('speedFormContainer').classList.add('d-none');
    document.getElementById('form-container').classList.remove('d-none');
});

document.getElementById('themeToggle').addEventListener('click', function () {
    document.body.classList.toggle('light-theme');
    const isLightTheme = document.body.classList.contains('light-theme');
    this.lastChild.textContent = isLightTheme ? 'تغییر به تم تیره' : 'تغییر به تم روشن';
    localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
    if (window.downloadChart) updateChart(parseFloat(document.getElementById('speed').value), parseInt(document.getElementById('days').value, 10));
});

window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('themeToggle').lastChild.textContent = 'تغییر به تم تیره';
    }
});
