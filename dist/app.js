
// Initialize Phaser, and create a 400x490px game
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

// Create our 'main' state that will contain the game
var mainState = {


    preload: function () {

        game.stage.backgroundColor = '#71c5cf';
        game.load.image('player', '../assets/sprites/player.png');
        game.load.image('zombie', '../assets/sprites/zombie.png');
        game.load.image('bullet', 'assets/sprites/bullet.png');
        game.load.image('ammo', 'assets/sprites/ammo.png');

    },

    create: function () {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.initPlayer();

        this.initZombies(5);

        this.initBullets(50);

        this.initKeys();

        this.initAmmo(2);

        this.graphics = game.add.graphics(0, 0);

    },


    update: function () {

        this.player.rotation = game.physics.arcade.angleToPointer(this.player);

        if (game.input.activePointer.isDown) {
                this.fire();
        }

        for (var i = 0; i < this.zombies.length; i++) {
            game.physics.arcade.collide(this.player, this.zombies[i]);
            game.physics.arcade.overlap(this.bullets, this.zombies[i], this.bulletHitEnemy, null, this);
        }

        for (var i = 0; i < this.ammoBox.length; i++) {
            game.physics.arcade.overlap(this.ammoBox[i], this.player, this.getAmmo, null, this);
        }


        this.checkAggro(150);

    },

    initPlayer : function () {
        this.player = this.game.add.sprite(100, 245, 'player');
        this.player.anchor.setTo(0.3, 0.2);
        this.game.physics.enable(this.player);
        this.player.body.collideWorldBounds = true;
    },

    initZombies : function (zombieCount) {
        this.zombies = [];
        for (var i = 0; i < zombieCount; i++) {
            this.zombies[i] = this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, 'zombie');
            this.game.physics.enable(this.zombies[i]);
            this.zombies[i].anchor.setTo(0.5, 0.5);
            this.zombies[i].body.collideWorldBounds = true;


            var angle = Math.floor((Math.random() * 180));
            var flip = Math.floor((Math.random() * 9));

            if(flip > 4) {
                angle *= -1;
            }

            this.zombies[i].rotation = angle;
        }
    },

    initBullets : function(bulletsCount) {
        this.nextFire = 0;
        this.fireRate = 100;
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.bullets.createMultiple(bulletsCount, 'bullet');
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);
    },


    initKeys : function() {
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

    initAmmo : function(ammoBoxCount) {

        this.ammo = 10;

        this.ammoBox = [];

        for (var i = 0; i < ammoBoxCount; i++) {
            this.ammoBox[i] = this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, 'ammo');
            this.game.physics.enable(this.ammoBox[i]);
            this.ammoBox[i].anchor.setTo(0.5, 0.5);
            this.ammoBox[i].body.collideWorldBounds = true;
        }
    },

    fire : function(){
        console.log('fire');
        if(this.ammo > 0) {
            if (game.time.now > this.nextFire && this.bullets.countDead() > 0) {
                this.ammo--;
                this.nextFire = game.time.now + this.fireRate;
                var bullet = this.bullets.getFirstDead();
                bullet.rotation= this.player.rotation;
                bullet.reset(this.player.x, this.player.y);
                game.physics.arcade.moveToPointer(bullet, 300);
                this.checkAggro(300);
            }
        }
    },

    checkAggro : function(min_distance) {
        for (var i = 0; i < this.zombies.length; i++) {
            var zombie = this.zombies[i];
            var distance = game.physics.arcade.distanceBetween(this.player, zombie);
            if (distance <= min_distance) {
                zombie.rotation = game.physics.arcade.angleToXY(zombie, this.player.body.x, this.player.body.y);
                game.physics.arcade.moveToObject(zombie, this.player, 20);
            }
        }
    },

    bulletHitEnemy : function  (zombie, bullet) {
        bullet.kill();
        zombie.kill();
    },

    getAmmo : function(ammoBox) {
      ammoBox.kill()
      this.ammo += 10;
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

    render : function () {

    game.debug.text('Ammo: ' + this.ammo, 32, 32);

}

};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);
game.state.start('main');