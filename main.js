// Initialize Phaser, and creates a 640x640px game
var game = new Phaser.Game(640, 640, Phaser.CANVAS, 'game_div', 
    { preload: preload, create: create, update: update });

function preload() {

    // Change the background color of the game
    game.stage.backgroundColor = '#000000';

    // Load the spaceship sprite
    game.load.image('battle_cruiser', 'assets/images/battle_cruiser.png');
    game.load.image('battleship', 'assets/images/battleship.png');
    game.load.image('escort_frigate', 'assets/images/escort_frigate.png');

    game.load.image('move_tile', 'assets/images/move_tile.png');
    game.load.image('attack_tile', 'assets/images/attack_tile.png');
}

var BOARD_COLS = 10;
var BOARD_ROWS = 10;
var SHIP_SIZE = 64;
var TURN = "PLAYER1";
var MOVELOCK = false;

function create() {
    	// Fuction called after 'preload' to setup the game    
        spawnShips();

}
    
function update() {
    if (TURN == "PLAYER1") {
        // let player 1 move the good ships
        while (waitingShips(good_ships)) {
            good_ships.forEach(function(ship) {
                if (ship.moved == "MOVING")
                {
                    MOVELOCK = true;
                }
                else if (ship.moved == "WAITING" && MOVELOCK === false){
                    selectShip(ship);
                }
            });
        }
    }
    else if (TURN == "PLAYER2") {
        // let player 2 (or A.I.?) move the bad ships
    }
}

function waitingShips(fleet) {
    var waiting_ships = false;
    fleet.forEach(function(ship) {
        if (ship.moved == "WAITING") {
            waiting_ships = true;
        }
    });
    return waiting_ships;
}


// select the ship to move
function selectShip(ship) {
    ship.is_selected = true;
    if (ship.moved == "WAITING") {
        // draw possible moves
        ship.moveLeft = game.add.sprite(ship.x - 64, ship.y, 'move_tile');
        ship.moveLeft.anchor.set(0.5);
        ship.moveRight = game.add.sprite(ship.x + 64, ship.y, 'move_tile');
        ship.moveRight.anchor.set(0.5);
        ship.moveUp = game.add.sprite(ship.x, ship.y - 64, 'move_tile');
        ship.moveUp.anchor.set(0.5);
        ship.moveDown = game.add.sprite(ship.x, ship.y + 64, 'move_tile');
        ship.moveDown.anchor.set(0.5);
    }
    else if (ship.moved == "MOVED") {
        ship.is_selected = false;
    }
    ship.moved = "MOVING";
}

// Make the ship move
function moveTo(pointer) {
    if (this.is_selected === true) {
        legal_test = isLegal(this, this.x, this.y, pointer.x, pointer.y);
        if(legal_test["legal_move"] === true){
            this.x = legal_test["x"];
            this.y = legal_test["y"];
            this.is_selected = false;
            this.moved = "MOVED";
            clearMoves(this);
            MOVELOCK = false;
        }
    }
}

function isLegal(moving_ship, from_x, from_y, to_x, to_y) {
    // if another ship is there, don't move
    too_close = false;
    good_ships.forEach(function(ship) {
        if (Math.abs(to_x - ship.x) < 32 && Math.abs(to_y - ship.y) < 32) {
            too_close = true;
            //break;
        }
    });
    // short circuit next loop if already an illegal move
    bad_ships.forEach(function(ship) {
        if (Math.abs(to_x - ship.x) < 32 && Math.abs(to_y - ship.y) < 32) {
            too_close = true;
            //break;
        }
    });

    if (too_close === true) {
        return { "legal_move": false, "x": from_x, "y": from_y };
    }
    // check to make sure the click was in a square
    else if (Math.abs(from_x - to_x) > 96 || Math.abs(from_y - to_y) > 96) {
        return { "legal_move": false, "x": from_x, "y": from_y };
    }
    else if (to_y > (from_y + 32) && Math.abs(to_x - from_x) < 32) {
        // down
        return {"legal_move": true, "x": moving_ship.moveDown.x, "y": moving_ship.moveDown.y };
    }
    else if (to_y < (from_y - 32) && Math.abs(to_x - from_x) < 32) {
        // up
        return {"legal_move": true, "x": moving_ship.moveUp.x, "y": moving_ship.moveUp.y };
    }
    else if (to_x > (from_x + 32) && Math.abs(to_y - from_y) < 32) {
        // right
        return {"legal_move": true, "x": moving_ship.moveRight.x, "y": moving_ship.moveRight.y };
    }
    else if (to_x < (from_x - 32) && Math.abs(to_y - from_y) < 32) {
        // left
        return {"legal_move": true, "x": moving_ship.moveLeft.x, "y": moving_ship.moveLeft.y };
    }
    else
    {
        // stay where you are
        return { "legal_move": true, "x": from_x, "y": from_y };
    }
}

function clearMoves(ship) {
    ship.moveLeft.destroy();
    ship.moveRight.destroy();
    ship.moveUp.destroy();
    ship.moveDown.destroy();
}

function spawnShips() {
    good_ships = game.add.group();
    good_ship1 = good_ships.create(32, 32, "battle_cruiser");
    good_ship1.moved = "WAITING";
    good_ship1.inputEnabled = true;
    good_ship1.anchor.set(0.5);
    //good_ship1.events.onInputDown.add(selectShip, good_ship1);
    game.input.onDown.add(moveTo, good_ship1);

    good_ship2 = good_ships.create(96, 96, "battleship");
    good_ship2.moved = "WAITING";
    good_ship2.inputEnabled = true;
    good_ship2.anchor.set(0.5);
    //good_ship2.events.onInputDown.add(selectShip, good_ship2);
    game.input.onDown.add(moveTo, good_ship2);
     


    bad_ships = game.add.group();
    for (var i = 2; i < BOARD_COLS - 2; i++) {
         var bad_ship = bad_ships.create(i * SHIP_SIZE - 32,
             (BOARD_ROWS-2) * SHIP_SIZE - 32, "escort_frigate");
         bad_ship.moved = "WAITING";
         bad_ship.inputEnabled = true;
         bad_ship.anchor.set(0.5);
         //bad_ship.events.onInputDown.add(selectShip, bad_ship);
         game.input.onDown.add(moveTo, bad_ship);
    }
}

