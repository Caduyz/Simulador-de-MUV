let s0, v0, a, track, carro, midTrack;
let t = 0;
let animando = false;
let framesCount = 0;

const carros = { // objeto com os carros e seus parametros
    carro1: {
        img: 'https://images.vexels.com/media/users/3/258907/isolated/preview/63b3084a2e3abf46c1ff1f1163278631-transporte-de-carro-esporte-amarelo.png',
        width: 120,
        height: 220,
        direction: 'left',
        posY: (window.innerWidth * 0.21) -142,
    },
    carro2: {
        img: 'https://images.vexels.com/media/users/3/243727/isolated/preview/961170707cab73907669cc9af41209fb-transporte-notebookdoodle-colorvinyl-cr-3.png',
        width: 120,
        height: 220,
        direction: 'right',
        posY: (window.innerWidth * 0.21) -146,
    },
    carro3: {
        img: 'https://static.vecteezy.com/system/resources/thumbnails/023/524/637/small_2x/red-sport-car-design-transparent-background-free-png.png',
        width: 110,
        height: 56,
        direction: 'right',
        posY: (window.innerWidth * 0.21) -61,
    }
}

const canvas = document.getElementById("canvas"); // cria o canvas (tela) onde o carro será animado
canvas.width = window.innerWidth * 0.88;
canvas.height = window.innerWidth * 0.21;
const ctx = canvas.getContext("2d"); // define o canvas como 2d
let dt = Number((1 / 60).toFixed(10));

const carroImg = new Image(); // cria a imagem do carro

function selecionarCarro(idCarro) { // funcao para selecionar o carro
    carroImg.src = carros[idCarro].img; // define a imagem do carro com base no objeto com os carros
    carroImg.onload = function() { // garante que a imagem do carro vai ter carregado antes de aplicar as dimensoes
        carroImg.width = carros[idCarro].width;
        carroImg.height = carros[idCarro].height;
    };
    document.querySelectorAll('.car').forEach(element => element.classList.remove('active')); // retira a borda ao redor dos carros nao selecionados
    document.getElementById(idCarro).classList.add('active'); // coloca a borda ao redor do carro selecionado
    carro = idCarro;
    moverCarro();
}

window.onload = function() {
    selecionarCarro('carro1');
};

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
            tension: 0,
            pointRadius: 0
        }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true, 
                labels: {
                    usePointStyle: false,
                    boxWidth: 0
                }
            }
        },
        scales: {
            x: { title: { display: true, text: 'Tempo (s)' } },
            y: { title: { display: true, text: 'Velocidade (m/s)' } }
        },
        animation: {
            easing: 'linear'
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
            tension: 0,
            pointRadius: 0 
        }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    usePointStyle: false,
                    boxWidth: 0
                }
            }
        },
        scales: {
            x: { title: { display: true, text: 'Tempo (s)' } },
            y: { title: { display: true, text: 'Aceleração (m/s²)' } }
        },
        animation: {
            easing: 'linear'
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
            tension: 0,
            pointRadius: 0
        }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    usePointStyle: false,
                    boxWidth: 0 
                }
            }
        },
        scales: {
            x: { title: { display: true, text: 'Tempo (s)' } },
            y: { title: { display: true, text: 'Posição (m)' } }
        },
        animation: {
            easing: 'linear'
        }
    }
});

function moverCarro() {
    s0 = Number(document.getElementById('posInput').value) || 0;
    document.getElementById('posInput').value = s0;

    track = Number(document.getElementById('trackInput').value) || 100;
    document.getElementById('trackInput').value = track;

    if(track <= 0 || isNaN(track)) {
        track = 100;
        document.getElementById('trackInput').value = 100;
    }

    if(s0 > track) {
        s0 = track;
        document.getElementById('posInput').value = s0;
    }

    if(s0 < 0) {
        s0 = 0;
        document.getElementById('posInput').value = s0;
    }
    
    document.getElementById('halfTrackLength').textContent = `${track/2}m`;
    document.getElementById('trackLength').textContent = `${track}m`;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // limpa a tela
    let posX = (s0 / track) * (canvas.width - carroImg.width);
    ctx.save();

    if(carros[carro].direction === 'left') {
        ctx.scale(-1, 1);
        ctx.drawImage(carroImg, -posX - carros[carro].width, carros[carro].posY, carros[carro].width, carros[carro].height);
    }
    else {
        ctx.drawImage(carroImg, posX, carros[carro].posY, carros[carro].width, carros[carro].height); // define a posicao do carro no canvas
    }
    ctx.restore();
}

function animarCarro() {
    t += dt;
    let v = v0 + a * t;
    if(!animando || s0 === 0 && v <= 0 && t === 0) return;
    framesCount++;
    let s = s0 + v0 * t + 0.5 * a * t ** 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // limpa a tela

    let posX = (s / track) * (canvas.width - carroImg.width);

    ctx.save();

    if(s >= track/2 && !midTrack && s0 <= track/2) {
        if(s0 === track/2) {
            midTrack = 0;
        }
        else midTrack = t;
        document.getElementById('halfTimer').textContent = `${midTrack.toFixed(3)}s`;
    }
    else if(s < track/2) {
        document.getElementById('halfTimer').textContent = `${t.toFixed(3)}s`;
    }

    document.getElementById('fullTimer').textContent = `${t.toFixed(3)}s`;

    if(carros[carro].direction === 'left') {
        ctx.scale(-1, 1);
        ctx.drawImage(carroImg, -posX - carros[carro].width, carros[carro].posY, carros[carro].width, carros[carro].height);
    }
    else {
        ctx.drawImage(carroImg, posX, carros[carro].posY, carros[carro].width, carros[carro].height); // define a posicao do carro no canvas
    }

    ctx.restore();

    if (framesCount % 5 === 0) { // atualiza os gráficos a cada 5 frames
        speedChart.data.labels.push(t.toFixed(3));
        speedChart.data.datasets[0].data.push(v.toFixed(3));
        speedChart.update();

        accelChart.data.labels.push(t.toFixed(3));
        accelChart.data.datasets[0].data.push(a.toFixed(3));
        accelChart.update();

        positionChart.data.labels.push(t.toFixed(3));
        positionChart.data.datasets[0].data.push(s.toFixed(3));
        positionChart.update();

        document.getElementById('speed').textContent = `${v.toFixed(1)}m/s`;
        document.getElementById('position').textContent = `${s.toFixed(1)}m`;
    }

    if(s >= track || s <= 0 && v < 0) {
        t = 0;
        midTrack = null;
        animando = false;
        document.getElementById('position').textContent = `${track.toFixed(1)}m`;
        return;
    }

    requestAnimationFrame(animarCarro);
}

function start() {
    if(animando) return;
    
    v0 = Number(document.getElementById('speedInput').value) || 0;
    a = Number(document.getElementById('accelInput').value) || 0;
    if(!v0 && !a) return;

    // reseta os gráficos
    speedChart.data.labels = [];
    speedChart.data.datasets[0].data = [];
    speedChart.update();

    accelChart.data.labels = [];
    accelChart.data.datasets[0].data = [];
    accelChart.update();

    positionChart.data.labels = [];
    positionChart.data.datasets[0].data = [];
    positionChart.update();

    animando = true;
    requestAnimationFrame(animarCarro);
}

function pause() {
    if(animando) {
        animando = false;
    }
    else if(!animando && t != 0) {
        animando = true;
        requestAnimationFrame(animarCarro);
    }
}

function reset() {
    animando = false;
    midTrack = null;
    t = 0;

    // reseta os gráficos
    speedChart.data.labels = [];
    speedChart.data.datasets[0].data = [];
    speedChart.update();

    accelChart.data.labels = [];
    accelChart.data.datasets[0].data = [];
    accelChart.update();

    positionChart.data.labels = [];
    positionChart.data.datasets[0].data = [];
    positionChart.update();

    moverCarro();
}

document.addEventListener("keydown", function(event) { // teclas para ativar os botoes mais facilmente
    if(event.key === "Enter") { // Enter pra comecar
        document.getElementById('startBttn').classList.add("hover");
        setTimeout(() => document.getElementById('startBttn').classList.remove("hover"), 225);
        setTimeout(() => {start();}, 175);
    }

    if(event.key === "p") { // P para pausar
        document.getElementById('stopBttn').classList.add("hover");
        setTimeout(() => document.getElementById('stopBttn').classList.remove("hover"), 175);
        setTimeout(() => {pause();}, 50);
    }

    if(event.key === "r") { // R para resetar
        document.getElementById('resetBttn').classList.add("hover");
        setTimeout(() => document.getElementById('resetBttn').classList.remove("hover"), 175);
        setTimeout(() => {reset();}, 75);
    }
    return;
});

document.getElementById('posInput').value = 0;
document.getElementById('trackInput').value = 100;