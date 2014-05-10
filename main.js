// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(640, 640, Phaser.AUTO, 'game_div');
var tween;
var BOARD_COLS = 10;
var BOARD_ROWS = 10;
var SHIP_SIZE = 64;

// Creates a new 'main' state that will contain the game
var main_state = {

    preload: function() { 
		// Function called first to load all the assets
        // Change the background color of the game
        this.game.stage.backgroundColor = '#000000';

        // Load the spaceship sprite
        this.game.load.image('battle_cruiser', 'assets/battle_cruiser.png');
        this.game.load.image('battleship', 'assets/battleship.png');
        this.game.load.image('escort_frigate', 'assets/escort_frigate.png');

        this.game.load.image('move_tile', 'assets/move_tile.png');
        this.game.load.image('attack_tile', 'assets/attack_tile.png');
    },

    create: function() { 
    	// Fuction called after 'preload' to setup the game    
        this.spawnShips();

        // Display the ship on the screen
        this.ship = this.game.add.sprite(64, 64, 'battleship');
        // anchor ship to middle of image
        this.ship.anchor.set(0.5);
        // set is selected to false when we start the game
        this.ship.is_selected = false;
        
        // create ship selector


        // enable input actions for this image
        this.ship.inputEnabled = true;
        this.ship.events.onInputDown.add(this.selectship, this);
        this.game.input.onDown.add(this.moveto, this, this.ship);

    },
    
    update: function() {

    },

    // select the ship to move
    selectship: function(some_ship) {
        some_ship.is_selected = true;
        // draw possible moves
        this.moveLeft = this.game.add.sprite(some_ship.x - 64, some_ship.y, 'move_tile');
        this.moveLeft.anchor.set(0.5);
        this.moveRight = this.game.add.sprite(some_ship.x + 64, some_ship.y, 'move_tile');
        this.moveRight.anchor.set(0.5);
        this.moveUp = this.game.add.sprite(some_ship.x, some_ship.y - 64, 'move_tile');
        this.moveUp.anchor.set(0.5);
        this.moveDown = this.game.add.sprite(some_ship.x, some_ship.y + 64, 'move_tile');
        this.moveDown.anchor.set(0.5);
    },

    // Make the ship move
    moveto: function(pointer, some_ship) {
        // draw possible moves
        if (some_ship.is_selected === true) {
            some_ship.x = pointer.x;
            some_ship.y = pointer.y;
            some_ship.is_selected = false;
        }
    },

    spawnShips: function() {
        this.good_ships = this.game.add.group();
        this.good_ships.create(32, 32, "battle_cruiser");
         


        this.bad_ships = this.game.add.group();
        for (var i = 3; i < BOARD_COLS - 2; i++) {
            var bad_ship = this.bad_ships.create(i * SHIP_SIZE, (BOARD_ROWS-1) * SHIP_SIZE, "escort_frigate");
            bad_ship.inputEnabled = true;
        }
    },


};

// Add and start the 'main' state to start the game
game.state.add('main', main_state);  
game.state.start('main'); 
