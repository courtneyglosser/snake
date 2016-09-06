// Script for tile filling game


var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var gameState = "active"


var leftMargin = 250
var topMargin = 90
var boardWidth = 460
var boardHeight = 460

var wUnit = Math.floor(boardWidth / 50)
var hUnit = Math.floor(boardHeight / 50)

var treatSize = 2
var numTreats = 5

var score = 0

var snakeX = 260
var snakeY = 100
var snakeSpeed = 3
var xVel = snakeSpeed
var yVel = 0

var levelTreats = []

for (var i = 0; i < numTreats; i++) {
    tx = getRandomInt ((0 + wUnit), ((boardWidth - treatSize * wUnit) - wUnit))
    ty = getRandomInt ((0 + hUnit), ((boardHeight - treatSize * hUnit) - hUnit))
    var newTreat = {
        x: tx + leftMargin,
        y: ty + topMargin,
        eaten: false
    }

    levelTreats.push(newTreat)
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}


function drawBoard() {
    // Draw an outline
    ctx.beginPath();
    ctx.rect(leftMargin, topMargin, boardWidth, boardHeight);
    ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
    ctx.stroke();
    ctx.closePath();
}

function drawTreats() {
    levelTreats.forEach(function (val, key) {
        if (!val.eaten) {
            drawTreat(val)
        }
    })
}

function drawTreat(treat) {
    ctx.beginPath();
//    ctx.arc(leftMargin, topMargin, wUnit, 0, Math.PI*2, false);
    ctx.rect(treat.x, treat.y, wUnit * treatSize, hUnit * treatSize)
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();

}

function drawSnake() {
    ctx.beginPath();
    ctx.rect(snakeX, snakeY, wUnit, hUnit);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();

}

function moveSnake() {
    snakeX += xVel
    snakeY += yVel

    checkWallCollide()
    checkTreatCollide()
}

function drawWin() {
    ctx.font = "26px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Winner! ", canvas.width / 2 - 20, canvas.height / 2);
}

function drawLose() {
    ctx.font = "26px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Loser :( ", canvas.width / 2 - 20, canvas.height / 2);
}

function drawPause() {
    ctx.font = "26px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Pause! ", canvas.width / 2 - 20, canvas.height / 2);
}

function draw() {
    // drawing code
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (gameState == "active") {
        moveSnake()

        drawBoard()

        drawSnake()
        drawTreats()


        drawScore()
    }
    else if (gameState == "win") {
        drawWin()
    }
    else if (gameState == "lose") {
        drawLose()
    }
    else if (gameState == "pause" ) {
        drawPause()
    }

}


setInterval(draw, 1000/30);

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
    switch (e.keyCode) {
        // Left
        case 65:
        case 37:
            if (xVel != snakeSpeed) {
                xVel = -snakeSpeed
                yVel = 0
            }
            break

        // Down
        case 83:
        case 40:
            if (yVel != -snakeSpeed) {
                xVel = 0
                yVel = snakeSpeed
            }
            break

        // Right
        case 68:
        case 39:
            if (xVel != -snakeSpeed) {
                xVel = snakeSpeed
                yVel = 0
            }
            break

        // Up
        case 87:
        case 38:
            if (yVel != snakeSpeed) {
                xVel = 0
                yVel = -snakeSpeed
            }
            break

        // Spacebar pause
        case 32:
            if (gameState == "pause") {
                gameState = "active"
            }
            else {
                gameState = "pause"
            }
            break

        default:
            if (gameState == "pause") {
                gameState = "active"
            }
            else {
                console.log("Unrecognized Command: ", e.keyCode)
            }

    }
}


//
//ctx.beginPath();
//ctx.rect(20, 40, 50, 50);
//ctx.fillStyle = "#FF0000";
//ctx.fill();
//ctx.closePath();
//
//ctx.beginPath();
//ctx.arc(240, 160, 20, 0, Math.PI*2, false);
//ctx.fillStyle = "green";
//ctx.fill();
//ctx.closePath();
//
//ctx.beginPath();
//ctx.rect(160, 10, 100, 40);
//ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
//ctx.stroke();
//ctx.closePath();

//function keyUpHandler(e) {
//    if(e.keyCode == 39) {
//        rightPressed = false;
//    }
//    else if(e.keyCode == 37) {
//        leftPressed = false;
//    }
//}

//var red = 0
//var green = 0
//var blue = 255
//var color = "rgba(" + red + "," + green + "," + blue + ", 1)"

function checkWallCollide() {
    if (snakeX <= leftMargin) {
        gameState = "lose"
    }

    if (snakeX + wUnit >= leftMargin + boardWidth) {
        gameState = "lose"
    }

    if (snakeY <= topMargin) {
        gameState = "lose"
    }

    if (snakeY + hUnit >= topMargin + boardHeight) {
        gameState = "lose"
    }
}

function checkTreatCollide() {
    // Need to go through treat array and "remove" any that the snake touches.

    levelTreats.forEach(function (val, key) {
        if (!val.eaten) {
            if (snakeX + wUnit >= val.x
                && snakeX <= val.x + treatSize * wUnit
                && snakeY + wUnit >= val.y
                && snakeY <= val.y + treatSize * hUnit) {
                val.eaten = true
            }
        }
    })
}
