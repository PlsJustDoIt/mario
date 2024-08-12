
// const GRAVITY = 0.001;
const GRAVITY = 0.00;
const JUMP_SPEED = 0.25;
const OBSTACLE_WIDTH = 56;
const OBSTACLE_MIN_OPENING = 80;
const SPACE_BETWEEN_OBSTACLES = 300;

const ANIM_DELAY = 50;

// les 5 Ã©tats du jeu (cf. diagramme Ã©tats-transitions)
const GAME_STATES = { LOADING: 0, WAITING: 1, PLAYING: 2, PAUSED: 3, GAMEOVER: 4 };




document.addEventListener('DOMContentLoaded', function() {

    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = window.devicePixelRatio;

    class Game {

        constructor() {

            this.perso = new personnage();
            this.score = 0;
            this.state = GAME_STATES.LOADING;

    
        }

        start() {
            this.state = GAME_STATES.PLAYING;
        }

        update(dt) {
            if (this.state != GAME_STATES.PLAYING) {
                return ;
            }


            this.perso.update(dt);

            this.score = 0;
        }

        render(ctx) {
            ctx.clearRect(0,0,width,height);
            if (this.state == GAME_STATES.LOADING) {
                ctx.fillText("Loading...", width/2, height/2);
                return;
            }

            this.perso.render(ctx);
            context.fillStyle = "lightgreen";
           // context.fillRect(0,height-300,width,300);

            if (this.state == GAME_STATES.WAITING) {
                ctx.fillText("Press Space to start", width/2, height/2);
            }
        }


        keydown(key) {
            switch(key) {
                case "Space":
                    if (this.state == GAME_STATES.WAITING) {
                        this.state = GAME_STATES.PLAYING;
                        return;
                    }
                    if (this.state == GAME_STATES.PLAYING) {
                        this.perso.jump();
                        return;
                    }
                    break;
                case "KeyR":
                    if (this.state == GAME_STATES.GAMEOVER) {
                        this.perso.reset();
                        this.state = GAME_STATES.PLAYING;
                        return;
                    }
                    break;
            }
        }

        keypressed(key) {
            switch(key) {
                case "ArrowLeft":
                    if (this.state == GAME_STATES.PLAYING) {
                        this.perso.goLeft();
                        return;
                    }
                    break;
                case "ArrowRight":
                    if (this.state == GAME_STATES.PLAYING) {
                        this.perso.goRight();
                        return;
                    }
                    break;
            }
        }
    
    }   
    
    class Entity {
    
        constructor(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
            this.speedX = 0;
            this.speedY = 0;
            this.accX = 0;
            this.accY = 0;
            this.vecX = 0;
            this.vecY = 0;
        }
    
        /**
         * Mise Ã  jour de l'Ã©tat de l'entitÃ©
         * @param {number} dt dÃ©lai Ã©coulÃ© entre deux mises Ã  jour (en ms)
         */
        update(dt) {
            
            // mise Ã  jour de la vitesse en fonction de l'accÃ©lÃ©ration et du temps
            // this.speedX += this.accX ;
            // this.speedY += this.accY ;
            
            // mise Ã  jour de la position en fonction de la vitesse et du temps
            this.x += this.vecX * this.speedX ;
            this.y += this.vecY * this.speedY ;
            console.log(this.x,this.y);

        }
    
        /**
         * Affichage de l'entitÃ©.
         * @param {2DContext} ctx le contexte de dessin (issu du canvas)
         * @param {string} color la couleur du dessin
         */
        render(ctx, color) {
            ctx.strokeStyle = color;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
    
    class personnage extends Entity {
    
        constructor() {
            super(200,height-300,10,20);
            this.vie = 3;
            this.accY = GRAVITY;
            this.accX = 0.05;
            this.vecY = 1;
            this.vecX = 1;
            this.anim = 0;
            this.delay = 0;
        }
    
        reset() {
            this.x = 200;
            this.y = height-300;
            this.vie = 3;
            this.speedY = 0;
            this.speedX = 0;
        }
    
        jump() {
            if (this.vie > 0) {
                this.speedY = - 0.25;
                this.delay = ANIM_DELAY;
            }
        }

        goLeft() {
            this.speedX -=1;
        }

        goRight() {
            this.speedX += 1;
        }
    
        update(dt) {
            if (this.vie > 0) {
                super.update(dt);
            }
        }
    
        render(ctx) {
            ctx.fillStyle = "red";
            ctx.fillRect(this.x,this.y,10,20);
        }
    
    
    
    }

    const canvas = document.getElementById("cvs");

    const context = canvas.getContext("2d");

 

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    canvas.style.width=width +"px";
    canvas.style.height=height+"px";
    context.scale(ratio,ratio);


    context.fillStyle = "lightgreen";
    context.fillRect(0,height-300,width,300);

    const game = new Game();
    document.addEventListener("keydown", function(e) {
        console.log(e.code);
        game.keydown(e.code);
    });

    document.addEventListener("keypress", function(e) {
        console.log(e.code);
        game.keypressed(e.code);
    });

    game.start();
    let last = Date.now();

    (function loop() {
        // prÃ©calcul de la prochaine image
        requestAnimationFrame(loop);
        // mise Ã  jour du modÃ¨le de donnÃ©es
        let now = Date.now();
        game.update(now - last);    // intervalle de temps entre deux passage dans la boucle de jeu
        last = now;
        // affichage de la nouvelle image 
        game.render(context);
    })();


});