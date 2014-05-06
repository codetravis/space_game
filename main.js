// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(500, 500, Phaser.AUTO, 'game_div');
var tween;
// Creates a new 'main' state that will contain the game
var main_state = {

    preload: function() { 
		// Function called first to load all the assets
        // Change the background color of the game
        this.game.stage.backgroundColor = '#71c5cf';

        // Load the bird sprite
        this.game.load.image('ship', 'assets/ship.png');

        // Load the pipe image
    },

    create: function() { 
    	// Fuction called after 'preload' to setup the game    

        // Display the ship on the screen
        this.ship = this.game.add.sprite(100, 245, 'ship');

        // select the ship when the mouse is clicked
        this.game.input.onDown.add(this.moveto, this);

    },
    
    update: function() {

    },

    // Make the ship move
    moveto: function(pointer) {
        this.ship.x = pointer.x;
        this.ship.y = pointer.y;

    },


};

// Add and start the 'main' state to start the game
game.state.add('main', main_state);  
game.state.start('main'); 
