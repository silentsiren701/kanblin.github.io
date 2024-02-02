//board
let tileSize = 128;
let rows = 6;
let columns = 3;

let board;
let boardWidth = tileSize * columns; // 32 * 16
let boardHeight = tileSize * rows; // 32 * 16
let context;

//ship
let shipWidth = tileSize;
let shipHeight = tileSize * 2;
let shipX = tileSize;
let shipY = tileSize * rows - tileSize * 2;

let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight,
};

let shipImg;
let shipVelocityX = tileSize; //ship moving speed



let score = 0;
let gameOver = false;


/**
 * Problem 1: Rocks should be a 2D array
 * 
 * 
 */


window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); //used for drawing on the board

    //load images
    shipImg = new Image();
    shipImg.src = "./canoe.png";
    shipImg.onload = function () {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    };

    rockImg = new Image();
    rockImg.src = "./rock.png";
    createRocks();

    requestAnimationFrame(update);  // each 10ms this update will be called once
    setInterval(createRocks, 5000); // every 5 seconds
    document.addEventListener("keydown", moveShip);
};

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "blue";
    context.fillRect(0, 0, board.width, board.height);
    //ship
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    //rock
    for (let i = 0; i < rockArray.length; i++) {
        let rock = rockArray[i];
        if (rock.alive) {
            // rock.x += rockVelocityX;
            rockArray[i].y += rockVelocityY;
            //if rock touches the borders

            context.drawImage(rockImg, rock.x, rock.y, rock.width, rock.height);

            if (detectCollision(ship, rock)) {
                gameOver = true;
            }
            // if (rock.y >= ship.y) {
            //     rock.alive = false;
            //     createRocks();
            // }
            
            // check if touch the bottom
            if (rock.y >= boardHeight) {
                rock.alive = false;
                score += 10;
            }
        }
    }

    //score
    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText(score, 5, 20);
}

function moveShip(e) {
    if (gameOver) {
        return;
    }

    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX; //move left one tile
    } else if (
        e.code == "ArrowRight" &&
        ship.x + shipVelocityX + ship.width <= board.width
    ) {
        ship.x += shipVelocityX; //move right one tile
    }
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

//rocks
// let rockArray = [];
// let rockWidth = tileSize * 2;
// let rockWidth = boardwidth / 3 - tileSize;
// let rockHeight = tileSize;
// let rockX = tileSize;
// let rockY = tileSize;
// let rockImg;

// let rockRows = ;
// let rockColumns = 3;

let rockVelocityY = 1; //rock moving speed

function createRocks() {
    if (gameOver) {
        return;
    }
    rockArray = []; // Clear the existing rocks


    let rockWidth = tileSize;  //I figure if we use 3 cols this will scale better
    let rockHeight = tileSize;

    // Randomly generate boolean array prepopulated with values tehen check if rocks are at a feasible position
    let rocksInRow = rockGenerator()

    // Loop to create rocks
    for (let c = 0; c < rocksInRow.length; c++) {
        if (rocksInRow[c]) {
            // Calculate the x-coordinate of the rock
            let rockX = c * rockWidth;
            let rockY = getRandomInt(rows / 5) * tileSize;

            let rock = {
                img: rockImg,
                x: rockX,
                y: rockY,
                width: rockWidth,
                height: rockHeight,
                alive: true,
            };

            rockArray.push(rock);
        }
    }

}


function detectCollision(a, b) {
    return (
        a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x && //a's top right corner passes b's top left corner
        a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y    //a's bottom left corner passes b's top left corner
    ); 
}



/**
 * This function will generate randomly a column of rocks
 * @returns the boolean array indicate of rocks
 */
function rockGenerator() {
    let rocksInRow = [Math.random() < 0.5, Math.random() < 0.5, Math.random() < 0.5];

    if (rocksInRow.every(position => position)) {
        rocksInRow[Math.floor(Math.random() * rocksInRow.length)] = false;
    }
    if (rocksInRow.every(position => !position)) {
        rocksInRow[Math.floor(Math.random() * rocksInRow.length)] = true;
    }
    return rocksInRow;
}
