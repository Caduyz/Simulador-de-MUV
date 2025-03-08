let s0, v0, a;
let startTime = null;
let animating = false;
let pistaMetros = 1000;
let lastGraphUpdate = 0;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 0.651;
canvas.height = 300;

const carroImg = new Image();

// Configuração do gráfico de velocidade
const ctxSpeedChart = document.getElementById("speedChart").getContext("2d");
const speedChart = new Chart(ctxSpeedChart, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Velocidade (m/s)',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
            tension: 0.1
        }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
            x: { title: { display: true, text: 'Tempo (s)' } },
            y: { title: { display: true, text: 'Velocidade (m/s)' } }
        }
    }
});

// Configuração do gráfico de posição
const ctxPositionChart = document.getElementById("positionChart").getContext("2d");
const positionChart = new Chart(ctxPositionChart, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Posição (m)',
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            fill: false,
            tension: 0.1
        }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
            x: { title: { display: true, text: 'Tempo (s)' } },
            y: { title: { display: true, text: 'Posição (m)' } }
        }
    }
});

// Configuração do gráfico de aceleração
const ctxAccelChart = document.getElementById("accelChart").getContext("2d");
const accelChart = new Chart(ctxAccelChart, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Aceleração (m/s²)',
            data: [],
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            fill: false,
            tension: 0.1
        }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
            x: { title: { display: true, text: 'Tempo (s)' } },
            y: { title: { display: true, text: 'Aceleração (m/s²)' } }
        }
    }
});

function modeloCarro(idCarro) {
    let carro1 = document.getElementById('car1');
    let carro2 = document.getElementById('car2');

    if (idCarro == 1) {
        carroImg.src = "https://static.vecteezy.com/system/resources/thumbnails/023/524/637/small_2x/red-sport-car-design-transparent-background-free-png.png";
        carro1.style.border = '1px solid white';
        carro2.style.border = '0';
    } else if (idCarro == 2) {
        carroImg.src = "https://static.vecteezy.com/system/resources/thumbnails/001/193/929/small_2x/vintage-car.png";
        carro2.style.border = '1px solid white';
        carro1.style.border = '0';
    }
}

function atualizarPosicao(timestamp) {
    if (!startTime) startTime = timestamp;
    let elapsedTime = (timestamp - startTime) / 1000;

    let s = s0 + v0 * elapsedTime + 0.5 * a * elapsedTime ** 2;
    let v = v0 + a * elapsedTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let posicaoPx = (s / pistaMetros) * (canvas.width - 94);
    ctx.drawImage(carroImg, posicaoPx, 211, 94, 34);

    // Atualização dos gráficos a cada 100ms
    if (timestamp - lastGraphUpdate > 100) {
        speedChart.data.labels.push(elapsedTime.toFixed(2));
        speedChart.data.datasets[0].data.push(v.toFixed(2));
        speedChart.update();

        positionChart.data.labels.push(elapsedTime.toFixed(2));
        positionChart.data.datasets[0].data.push(s.toFixed(2));
        positionChart.update();

        accelChart.data.labels.push(elapsedTime.toFixed(2));
        accelChart.data.datasets[0].data.push(a.toFixed(2));
        accelChart.update();

        lastGraphUpdate = timestamp;
    }

    if (s >= pistaMetros || (s <= 0 && v <= 0)) {
        animating = false;
        console.log("Tempo real decorrido:", elapsedTime.toFixed(3), "segundos");
        return;
    }

    if (animating) {
        requestAnimationFrame(atualizarPosicao);
    }
}

function start() {
    if (animating) return;
    animating = true;

    // Resetando gráficos
    speedChart.data.labels = [];
    speedChart.data.datasets[0].data = [];
    speedChart.update();

    positionChart.data.labels = [];
    positionChart.data.datasets[0].data = [];
    positionChart.update();

    accelChart.data.labels = [];
    accelChart.data.datasets[0].data = [];
    accelChart.update();

    if (!carroImg.src) {
        carroImg.src = "https://static.vecteezy.com/system/resources/thumbnails/023/524/637/small_2x/red-sport-car-design-transparent-background-free-png.png";
    }

    pistaMetros = parseFloat(document.getElementById('courseInput').value) || 0;
    s0 = parseFloat(document.getElementById('positionInput').value) || 0;
    v0 = parseFloat(document.getElementById('speedInput').value) || 0;
    a = parseFloat(document.getElementById('accelInput').value) || 0;

    if (s0 > pistaMetros) {
        alert('A posição inicial deve ser menor ou igual ao tamanho da pista!');
        return;
    }

    startTime = null;
    lastGraphUpdate = 0;
    requestAnimationFrame(atualizarPosicao);
}

function stop() {
    animating = false;
}

function alterarPista() {
    let halfCourse = document.getElementById('courseInput').value / 2;
    document.getElementById('halfCourse').textContent = `${halfCourse}m`;
}