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

function create() {
    	// Fuction called after 'preload' to setup the game    
        spawnShips();

        // Display the ship on the screen
        ship = game.add.sprite(128, 128, 'battleship');
        // anchor ship to middle of image
        ship.anchor.set(0.5);
        // set is selected to false when we start the game
        ship.is_selected = false;
        
        // create ship selector


        // enable input actions for this image
        ship.inputEnabled = true;
        ship.events.onInputDown.add(selectShip, ship);
        game.input.onDown.add(moveTo, ship);

}
    
function update() {

}


// select the ship to move
function selectShip() {
    this.is_selected = true;
    // draw possible moves
    moveLeft = game.add.sprite(this.x - 64, this.y, 'move_tile');
    moveLeft.anchor.set(0.5);
    moveRight = game.add.sprite(this.x + 64, this.y, 'move_tile');
    moveRight.anchor.set(0.5);
    moveUp = game.add.sprite(this.x, this.y - 64, 'move_tile');
    moveUp.anchor.set(0.5);
    moveDown = game.add.sprite(this.x, this.y + 64, 'move_tile');
    moveDown.anchor.set(0.5);
}

// Make the ship move
function moveTo(pointer) {
    if (this.is_selected === true) {
        this.x = pointer.x;
        this.y = pointer.y;
        this.is_selected = false;
    }
}

function spawnShips() {
    good_ships = game.add.group();
    good_ships.create(32, 32, "battle_cruiser");
     


    bad_ships = game.add.group();
    for (var i = 2; i < BOARD_COLS - 2; i++) {
         var bad_ship = bad_ships.create(i * SHIP_SIZE,
             (BOARD_ROWS-2) * SHIP_SIZE, "escort_frigate");
         bad_ship.inputEnabled = true;
    }
}

