
// Initialize Phaser, and create a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game');






// Create our 'main' state that will contain the game
var mainState = {


    preload: function () {

        game.stage.backgroundColor = '#71c5cf';
        game.load.image('player', '../assets/sprites/player.png');
        game.load.image('bullet', 'assets/sprites/bullet.png');
    },

    create: function () {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.player = this.game.add.sprite(100, 245, 'player');
        this.player.anchor.setTo(0.3, 0.2);

        this.game.physics.enable(this.player)


        this.nextFire = 0;
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.bullets.createMultiple(50, 'bullet');
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);

        var upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.add(this.up, this);
        upKey.onUp.add(this.yStop, this);
        var downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        downKey.onDown.add(this.down, this);
        downKey.onUp.add(this.yStop, this);
        var leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        leftKey.onDown.add(this.left, this);
        leftKey.onUp.add(this.xStop, this);
        var rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        rightKey.onDown.add(this.right, this);
        rightKey.onUp.add(this.xStop, this);

    },


    update: function () {
        this.player.rotation = game.physics.arcade.angleToPointer(this.player);

        if (game.input.activePointer.isDown) {
            this.fire();
        }
    },

    up : function(){
        this.player.body.velocity.y = -100;
    },

    yStop : function(){
        this.player.body.velocity.y = 0;
    },


    down : function(){
        this.player.body.velocity.y = +100;
    },

    left : function(){
        this.player.body.velocity.x = -100;
    },

    right : function(){
        this.player.body.velocity.x = +100;
    },

    xStop : function(){
        this.player.body.velocity.x = 0;
    },

    fire : function(){
        console.log('fire');

        if (game.time.now > this.nextFire && this.bullets.countDead() > 0) {

            nextFire = game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();
            bullet.rotation= this.player.rotation;
            bullet.reset(this.player.x, this.player.y);
            

            game.physics.arcade.moveToPointer(bullet, 300);
        }

    }
};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);
game.state.start('main');