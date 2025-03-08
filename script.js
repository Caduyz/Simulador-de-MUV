let s0, v0, a, halfTime, t = 0;
let animating = false;
let pistaMetros = 1000;
let lastGraphUpdate = 0;
let stopped = true;
let carro = 'carro1';

const carros = {
    carro1: {
        link: 'https://static.vecteezy.com/system/resources/thumbnails/023/524/637/small_2x/red-sport-car-design-transparent-background-free-png.png',
        width: 94,
        height:32,
        direction: 'right',
        posY: 211,
    },
    carro2: {
        link: 'https://static.vecteezy.com/system/resources/thumbnails/001/193/929/small_2x/vintage-car.png',
        width: 94,
        height:34,
        direction: 'right',
        posY: 211,
    },
    carro3: {
        link: 'https://images.vexels.com/media/users/3/258907/isolated/preview/63b3084a2e3abf46c1ff1f1163278631-transporte-de-carro-esporte-amarelo.png',
        width: 110,
        height:132,
        direction: 'left',
        posY: 163,
    },
    carro4: {
        link: 'https://images.vexels.com/media/users/3/243727/isolated/preview/961170707cab73907669cc9af41209fb-transporte-notebookdoodle-colorvinyl-cr-3.png',
        width: 110,
        height:122,
        direction: 'right',
        posY: 165,
    }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 0.651;
canvas.height = 300;
const dt = 1/60;

const carroImg = new Image();

// gráfico de velocidade
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
            tension: 0.1,
            pointRadius: 0 // Remove os pontos nos gráficos
        }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true, // Mantém a legenda visível
                labels: {
                    usePointStyle: false, // Remove o botão de esconder dataset
                    boxWidth: 0 // Remove a caixinha ao lado do nome
                }
            }
        },
        scales: {
            x: { title: { display: true, text: 'Tempo (s)' } },
            y: { title: { display: true, text: 'Velocidade (m/s)' } }
        }
    }
});

// gráfico de posição
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
            tension: 0.1,
            pointRadius: 0 // Remove os pontos nos gráficos
        }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true, // Mantém a legenda visível
                labels: {
                    usePointStyle: false, // Remove o botão de esconder dataset
                    boxWidth: 0 // Remove a caixinha ao lado do nome
                }
            }
        },
        scales: {
            x: { title: { display: true, text: 'Tempo (s)' } },
            y: { title: { display: true, text: 'Posição (m)' } }
        }
    }
});

// gráfico de aceleração
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
            tension: 0.1,
            pointRadius: 0 // Remove os pontos nos gráficos
        }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true, // Mantém a legenda visível
                labels: {
                    usePointStyle: false, // Remove o botão de esconder dataset
                    boxWidth: 0 // Remove a caixinha ao lado do nome
                }
            }
        },
        scales: {
            x: { title: { display: true, text: 'Tempo (s)' } },
            y: { title: { display: true, text: 'Aceleração (m/s²)' } }
        }
    }
});

function modeloCarro(idCarro) {
    carroImg.src = carros[`carro${idCarro}`].link;
    carroImg.onload = function() {
        carroImg.width = carros[`carro${idCarro}`].width;
        carroImg.height = carros[`carro${idCarro}`].height;
    };

    document.querySelectorAll('.carIcon').forEach(element => element.classList.remove('active'));
    document.getElementById(`car${idCarro}`).classList.add('active');
    carro = `carro${idCarro}`;
    moverCarro();
}

function atualizarPosicao() {
    if(v0 < 0 && s0 === 0 || a < 0 && s0 === 0 && v0 <= 0 || v0 === 0 && a === 0) {
        animating = false;
        stopped = true;
        return;
    }
    if(stopped && !animating) return;
    t = Number((t + dt).toFixed(10)); 
    
    let s = s0 + v0 * t + 0.5 * a * t ** 2;
    let v = v0 + a * t;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let posicaoPx = (s / pistaMetros) * (canvas.width - carroImg.width);

    ctx.save();

    if (carros[carro].direction === 'left') {
        ctx.scale(-1, 1);
        ctx.drawImage(carroImg, -posicaoPx - carroImg.width, carros[carro].posY, carroImg.width, carroImg.height);
    } else {
        ctx.drawImage(carroImg, posicaoPx, carros[carro].posY, carroImg.width, carroImg.height);
    }

    ctx.restore();

    if (performance.now() - lastGraphUpdate > 50) { 
        speedChart.data.labels.push(t.toFixed(3));
        speedChart.data.datasets[0].data.push(v.toFixed(3));
        speedChart.update();

        positionChart.data.labels.push(t.toFixed(3));
        positionChart.data.datasets[0].data.push(s.toFixed(3));
        positionChart.update();

        accelChart.data.labels.push(t.toFixed(3));
        accelChart.data.datasets[0].data.push(a.toFixed(3));
        accelChart.update();

        lastGraphUpdate = performance.now();
    }

    document.getElementById('cronometroTotal').textContent = `${t.toFixed(3)}s`;
    if (s < (pistaMetros / 2)) {
        document.getElementById('cronometroMeio').textContent = `${t.toFixed(3)}s`;
    }
    if (s >= (pistaMetros / 2)) {
        if (!halfTime) { 
            halfTime = t;
            document.getElementById('cronometroMeio').textContent = `${(halfTime + 0).toFixed(3)}s`;
        }
    }
    
    if (s >= pistaMetros || (s <= 0 && v < 0)) {
        animating = false;
        stopped = true;
        t = 0;
        s0 = parseFloat(document.getElementById('positionInput').value) || 0;
        return;
    }

    if (animating) {
        requestAnimationFrame(atualizarPosicao);
    }
}

function start() {
    if (animating) return;
    animating = true;
    stopped = false;
    halfTime = null;
    t = 0;

    s0 = parseFloat(document.getElementById('positionInput').value) || 0;
    v0 = parseFloat(document.getElementById('speedInput').value) || 0;
    a = parseFloat(document.getElementById('accelInput').value) || 0;

    // Reseta os gráficos
    speedChart.data.labels = [];
    speedChart.data.datasets[0].data = [];
    speedChart.update();

    positionChart.data.labels = [];
    positionChart.data.datasets[0].data = [];
    positionChart.update();

    accelChart.data.labels = [];
    accelChart.data.datasets[0].data = [];
    accelChart.update();

    pistaMetros = parseFloat(document.getElementById('courseInput').value) || 100;

    lastGraphUpdate = 0;
    requestAnimationFrame(atualizarPosicao);
}

function stop() {
    if (!animating) { // Se não estiver animando, significa que queremos retomar
        animating = true;
        stopped = false;
        requestAnimationFrame(atualizarPosicao);
    } else { // Se estiver animando, significa que queremos parar
        animating = false;
        stopped = true;
    }
}

function alterarPista() {
    let halfCourse = document.getElementById('courseInput').value / 2;
    document.getElementById('halfCourse').textContent = `${halfCourse}m`;
    moverCarro();
}

function moverCarro() {
    pistaMetros = parseFloat(document.getElementById('courseInput').value) || 100;
    document.getElementById('courseInput').value = pistaMetros;
    s0 = Number(document.getElementById('positionInput').value) || 0;
    document.getElementById('positionInput').value = s0;
    
    if (s0 > pistaMetros) {
        document.getElementById('positionInput').value = pistaMetros;
        s0 = pistaMetros;
    }

    if (s0 < 0 || isNaN(s0)) {
        document.getElementById('positionInput').value = 0;
        s0 = 0;
    }

    // Limpar a tela antes de redesenhar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Determinar a posição em pixels
    let posicaoPx = (s0 / pistaMetros) * (canvas.width - carroImg.width);

    ctx.save(); // Salva o estado do contexto

    if (carros[carro].direction === 'left') {
        ctx.scale(-1, 1);
        ctx.drawImage(carroImg, -posicaoPx - carros[carro].width, carros[carro].posY, carros[carro].width, carros[carro].height);
    } else {
        ctx.drawImage(carroImg, posicaoPx, carros[carro].posY, carros[carro].width, carros[carro].height);
    }

    ctx.restore(); // Restaura o contexto
}


// Chame a função no carregamento da página para garantir que o carro comece na posição inicial
modeloCarro(1);
moverCarro();

document.getElementById('positionInput').addEventListener('input', moverCarro);

document.addEventListener("keydown", function(event) {
    if(event.key === "Enter" && !animating && stopped && t === 0) {
        document.getElementById('startBttn').classList.add("hover");
        setTimeout(() => document.getElementById('startBttn').classList.remove("hover"), 225);
        setTimeout(() => {start();}, 175);
    }

    else if(event.key === "p") {
        document.getElementById('stopBttn').classList.add("hover");
        setTimeout(() => document.getElementById('stopBttn').classList.remove("hover"), 175);
        setTimeout(() => {stop();}, 50);
    }

    else if(event.key === "r") {
        document.getElementById('resetBttn').classList.add("hover");
        setTimeout(() => document.getElementById('resetBttn').classList.remove("hover"), 175);
        setTimeout(() => {reset();}, 50);
    }
    return;
});

function reset() {
    animating = false;
    stopped = true;
    t = 0;
    halfTime = null;
    s0 = 0;
    v0 = 0;
    a = 0;

    speedChart.data.labels = [];
    speedChart.data.datasets[0].data = [];
    speedChart.update();

    positionChart.data.labels = [];
    positionChart.data.datasets[0].data = [];
    positionChart.update();

    accelChart.data.labels = [];
    accelChart.data.datasets[0].data = [];
    accelChart.update();

    moverCarro();
}