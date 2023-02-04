

var c = document.getElementById("arcanoidCanvas");
var ctx = c.getContext("2d");
/*
ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();
*/
var radio = 10;
var x = c.width / 2;
var y = c.height - radio;
var dx = 2;
var dy = -2;
//aspecto paleta
var paletax = c.width / 2;
var paletay = c.height - 10;
var paletaW = 60;
var paletaH = 12;

//variables para el movimiento de la paleta
var rightMover = false;
var leftMover = false;

//creando los ladrillos para derribar
//filas y columnas
var columnaLadrillos = 5;
var filaLadrillos = 3;
// medida de los ladrillos
var anchoLadrillos = 60;
var altoLadrillos = 20;
//espacios entre los ladrillos
var paddingLadrillos = 12;
var distanciaArLadrillos = 30;
var distanciaIzLadrillos = 100;

//definimos objetivos del juego
var record = 0;
var vidas = 3;

//definimos un ojeto que contenga los ladrillos
var ladrillos = [];
for (let i = 0; i < columnaLadrillos; i++) {
    ladrillos[i] = [];
    for (let j = 0; j < filaLadrillos; j++) {
        ladrillos[i][j] = { x: 0, y: 0, dibujarLadrillos: true };
    }
}

document.addEventListener("keydown", precionarTecla, false);
document.addEventListener("keyup", soltarTecla, false);
document.addEventListener("mousemove", movimientoMouse, false);

function precionarTecla(e) {
    if (e.keyCode == 37) {
        leftMover = true;
    } else {
        if (e.keyCode == 39)
            rightMover = true;
    }
}

function soltarTecla(e) {
    if (e.keyCode == 37) {
        leftMover = false;
    } else {
        if (e.keyCode == 39)
            rightMover = false;
    }
}

// funcion de formato de la bola
function dibujarBola() {
    ctx.beginPath();
    ctx.arc(x, y, radio, 0, 2 * Math.PI);
    ctx.fillStyle = "#33ccff";
    ctx.fill();
    ctx.closePath();

}
// formato de la paleta
function dibujarPaleta() {
    ctx.beginPath();
    ctx.rect(paletax, paletay, paletaW, paletaH);
    ctx.fillStyle = "#ffff00";
    ctx.fill();
    ctx.closePath();
}
// formato de diseño de los ladrillos
function dibujarLadrillos() {
    for (let i = 0; i < columnaLadrillos; i++) {
        for (let j = 0; j < filaLadrillos; j++) {
            if (ladrillos[i][j].dibujarLadrillos) {
                var ladriX = (i * (anchoLadrillos + paddingLadrillos)) + distanciaIzLadrillos;
                var ladriY = (j * (altoLadrillos + paddingLadrillos)) + distanciaArLadrillos;
                ladrillos[i][j].x = ladriX;
                ladrillos[i][j].y = ladriY;
                ctx.rect(ladriX, ladriY, anchoLadrillos, altoLadrillos);
                ctx.fillStyle = "#ffff00";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function golpearLadrillo() {
    for (let i = 0; i < columnaLadrillos; i++) {
        for (let j = 0; j < filaLadrillos; j++) {
            var ladrillo = ladrillos[i][j];
            if (ladrillos[i][j].dibujarLadrillos) {


                if (x > ladrillo.x && x < ladrillo.x + anchoLadrillos && y > ladrillo.y && y < ladrillo.y + altoLadrillos) {
                    dy = - dy;
                    ladrillo.dibujarLadrillos = false;
                    record++;
                    if (record == columnaLadrillos * filaLadrillos) {
                        alert("Felicitaciones, completaste el juego!!")
                    }
                }

            }
        }
    }
}

function dibujarRecord() {
    ctx.font = "15px Arial";
    ctx.fillText("Record: " + record, 10, 15);
    ctx.fillStyle = "#ffff00";
    ctx.fill();
}

function dibujarVidas() {
    ctx.font = "15px Arial";
    ctx.fillText("Vidas: " + vidas, c.width - 60, 15);
    ctx.fillStyle = "#ffff00";
    ctx.fill();
}

function moviMouse() {
    if (e.keyCode == 37) {
        leftMover = false;
    } else {
        if (e.keyCode == 39)
            rightMover = false;
    }
}
// definimos codigo para poder darle movilidad a la paleta a travez del mouse
function movimientoMouse(e) {
    var mouseX = e.clientX - c.offsetLeft;
    if (mouseX > 0 && mouseX < c.width) {
        paletax = mouseX- paletaW / 2
    }
}


//movimiento de rebote de la bola
function dibujar() {
    ctx.clearRect(0, 0, c.width, c.height);
    dibujarPaleta();
    dibujarBola();
    dibujarLadrillos();
    golpearLadrillo();
    dibujarRecord();
    dibujarVidas();
    
    if (x + dx > c.width - radio || x + dx < radio) {
        dx = - dx;
    }
    // Condicion para perder el juego cuando toca pa parte inferior
    if (y + dy < radio) {
        dy = - dy;
    } else { //accion para que la bola rebote con la paleta
        if (y + dy > c.height - radio) {
            if (x > paletax && x < paletax + paletaW) {
                dy = - dy;
            } else { // codificamos para poder obtener 3 vidas y reiniciar cuando ocurra el game over
                vidas--;
                if (vidas <= 0) {
                    gameOver();
                    return;
                } else {
                    x = c.width / 2;
                    y = c.height - radio;
                    dx = 2;
                    dy = -2;
                    paletax = c.width / 2;

                }
            }
        }
    }


    //movimiento hacia la izquierda
    if (leftMover && paletax > 0) {
        paletax -= 8;
    } //movimiento hacia la derecha
    if (rightMover && paletax < c.width - 60) {
        paletax += 8;
    }
    x += dx;
    y += dy;
}

function gameOver() {
    document.getElementById("arcanoidGO").style.display = "block";
    ctx.font = "40px Arial";
    ctx.fillStyle = "#ffff00";
    ctx.fillText("Intentalo de nuevo! ", c.width /4, c.height/2);
    
    
}

//funcion para dar movimiento a la bola
setInterval(dibujar, 10);