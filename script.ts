


document.addEventListener('DOMContentLoaded', function() {

    const canvas: HTMLCanvasElement = document.getElementById('cvs') as HTMLCanvasElement;
    canvas.style.backgroundColor = '#00F8'

    const ctx = canvas.getContext('2d');
    const gravity = 0.825;

    if (!ctx) {
        throw new Error('2d context not supported');
    }

    function resizeCanvas(ctx:CanvasRenderingContext2D) {
        
        const ratio = window.devicePixelRatio || 1;

        console.log("ratio : ",ratio);
        
        // Ajuster la taille du canvas pour correspondre à la taille de la fenêtre
        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;
        
        ctx.setTransform(1, 0, 0, 1, 0, 0);


        ctx.scale(ratio, ratio);
    

    }

    resizeCanvas(ctx);

    console.log(canvas.height-canvas.height/3.5);

// Redimensionner le canvas à chaque fois que la fenêtre change de taille
    window.addEventListener('resize', () => {
        resizeCanvas(ctx); }
    );
    ctx.font = "96px Arial";
    

    

    
    // ctx.globalCompositeOperation = 'destination-over'
    // ctx.fillStyle = "blue";
    // console.log(ctx.fillRect(0, 0, canvas.width, canvas.height));

    class Player {
        position: { x: number; y: number; };
        width: number;
        height: number;
        velocity: { x: number; y: number; };
        isRunning: boolean;

        constructor() {
            this.position = {
                x: 100,
                y: 100
            };
            this.velocity = {
                x: 0,
                y: 0
            };
            
            this.width = 29;
            this.height = 40;

            this.isRunning = false;

        }

        draw() {
            if (ctx != null ) {

                // ctx.fillStyle = "red";
                // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
                ctx?.drawImage(mario,this.position.x, this.position.y, this.width, this.height);

            }
        }

        collisionDetection(platform: Platform): void {
            if (
                this.position.y + this.height <= platform.position.y &&
                this.position.y + this.height + this.velocity.y >= platform.position.y &&
                this.position.x + this.width >= platform.position.x &&
                this.position.x <= platform.position.x + platform.width
            ) {
                this.velocity.y = 0;
                console.log('blocker collision');
            }
        }


        update() {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            // if (this.velocity.x >= 0.5) {
            //     this.velocity.x-=0.5;
            // }

            // if (this.velocity.y >=0.5) {
            //     this.velocity.y-=0.5;
            // }
            
            // ptn c'est le truc qui fait rester au sol, mais c'est pas bon ca 
            if (this.position.y + this.height + this.velocity.y <= canvas.height-canvas.height/3.5) {
                this.velocity.y += gravity;
                //console.log('totot');
            } else {
                this.velocity.y = 0;
            }

            // prevent from going right too far
            if (this.position.x + this.width >= canvas.width) {
                this.velocity.x = 0;
            } 


            // prevent from going left too far
            if (this.position.x  < 0) {
                this.velocity.x = 0;

            }

            for (const platform of platforms) {
                this.collisionDetection(platform);
            }

            if (this.position.x + this.width >= canvas.width-300 && this.position.y + this.height >= canvas.height-300) {
                audioWin.play();
                console.log('you win');
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
                ctx?.fillText('You win', canvas.width/2 -200, 400);
            }


        }

        jump() {

            //prevent from jumping mid air
            if (this.velocity.y == 0) {
                this.velocity.y = -18;
                audio.play();
            }

        }

        run() {
            if (keys.right.pressed || keys.left.pressed) {
                this.velocity.x *= 1.5;
            } else {
                this.velocity.x = 0;
            }
        }

        goLeft() {

            //prevent from going out of the screen
            if (this.position.x > 0) {
                this.velocity.x = -13.75;
            }

        }

        
        goRight() {

            //prevent from going out of the screen
            if (this.position.x < canvas.width - this.width) {
                this.velocity.x = 13.75;
            }
        }
    }

    class Coin {



        
    }

    class Platform {
        position: { x: number; y: number; };
        width: number;
        height: number;

        constructor(x: number, y: number) {
            this.position = {
                x: x,
                y: y
            };
            this.width = 130;
            this.height = 78;
        }

        draw() {
            if (ctx != null) {
                // ctx.fillStyle = "#64ab54";
                ctx?.drawImage(platform, this.position.x, this.position.y, this.width, this.height);
                // ctx.fillStyle = "black";
                // // ctx.strokeRect(this.position.x + 2, this.position.y + 4, this.width - 10, this.height - 10);   ctx.fillStyle = "orange";
                // ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
            }
        }
    }

    const gamepads: Record<number, Gamepad> = {};

    function gamepadHandler(event:GamepadEvent, connecting:boolean) {
        const gamepad:Gamepad = event.gamepad;
        // Note :
        // gamepad === navigator.getGamepads()[gamepad.index]

        if (connecting) {
            gamepads[gamepad.index] = gamepad;
        } else {
            delete gamepads[gamepad.index];
        }
    }

    window.addEventListener(
        "gamepadconnected",
        function (e:GamepadEvent) {
          gamepadHandler(e, true);
        },
        false,
      );
      window.addEventListener(
        "gamepaddisconnected",
        function (e:GamepadEvent) {
          gamepadHandler(e, false);
        },
        false,
      );

    
    const audio:HTMLAudioElement = new Audio('assets/yahoo_effect.mp3');
    const player:Player = new Player();
    const audioWin:HTMLAudioElement = new Audio('assets/mario bros flagpole  Sound Effect.mp3');
    const mario = new Image(29,40);
    mario.src = 'assets/mario.png';
    const platform = new Image(130,78);
    platform.src = 'assets/platform.png';
    const coin = new Image(30,30);



    const flag = new Image(263,705);
    flag.src = 'assets/flag.png';

   // const obstacle = new Platform;

  

    const platforms: Platform[] = [];
    for (let i = 0; i < 5; i++) {
        platforms.push(new Platform(400 + 200*i + 50,canvas.height-400 - 50*i)); 
       
    }
    //const platform = new Platform(500, canvas.height-350);
    const keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        },
        space: {
            pressed: false
        },
        shift: {
            pressed: false
        }

    }
    player.draw();

    for (const platform of platforms) {
        platform.draw();
    }

    const desiredFPS = 60;
    const frameDuration = 1000 / desiredFPS;
    let lastFrameTime = 0;

    let frames = 0;

    function animate(currentTime = 0) {
        if (ctx != null) {
            requestAnimationFrame(animate);

            console.log(player.velocity.y);

             // Check for gamepad input
            const gamepad = navigator.getGamepads()[0];
            if (gamepad) {
                const joystickThreshold = 0.2;
                const joystickX = gamepad.axes[0];
                const buttonA = gamepad.buttons[0].pressed;
                const buttonB = gamepad.buttons[1].pressed;

                const dpadRight = gamepad.buttons[15].pressed;
                const dpadLeft = gamepad.buttons[14].pressed;

                //add dpad support

             

                if (joystickX < -joystickThreshold || dpadLeft)  {
                    player.goLeft();
                } else if (joystickX > joystickThreshold || dpadRight)  {
                    player.goRight();
                } else {
                    player.velocity.x = 0;
                }

                if (buttonA) {
                    player.jump();
                }

                if (buttonB) {
                    player.run();
                }
            }

            if (keys.left.pressed) {
                player.goLeft();
            } else if (keys.right.pressed) {
                player.goRight();
            } else {
                player.velocity.x = 0;
            }
           
            // if (keys.left.pressed) {
            //     player.goLeft();
            // } else if (keys.right.pressed) {
            //     player.goRight();
            // } else {
            //     player.velocity.x = 0;
            // }

            if (keys.space.pressed) {
                player.jump();
            }

            if (keys.shift.pressed) {
                player.run();
            }
            // && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width
            // && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width
            //  && player.position.x <= platform.position.x + platform.width
           
            const delta = currentTime - lastFrameTime;
            if (delta < frameDuration) {
                return;
            }
            const excessTime = delta % frameDuration;

            frames++;
            lastFrameTime = currentTime - excessTime;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            player.update();

            for (const platform of platforms) {
                platform.draw();
            }
            for (let i = 0;i<5;++i) {
                ctx.strokeRect(400 + 200*i + 50,canvas.height-600 - 50*i,30,30);
            }
            ctx?.drawImage(flag, canvas.width - 300, (canvas.height-canvas.height/3.5)-352, 132, 352);
            ctx.fillStyle = "lightgreen";
            ctx.fillRect(0,canvas.height-canvas.height/3.5,canvas.width,300);


            

        

        }
    }

    window.addEventListener("keydown", function(e) {


        switch (e.key) {
            case " ":
                keys.space.pressed = true;
                break;
            case "d":
            case "ArrowRight":
                keys.right.pressed = true;
                break;
            case "q":
            case "ArrowLeft":
                keys.left.pressed = true;
                break;

            case "Shift":

                keys.shift.pressed = true;
                break;
            case 'r':
                location.reload();
                break;
            
        }

    });

    window.addEventListener("keyup", function(e) {
        switch (e.key) {
            case "d":
            case "ArrowRight":
                keys.right.pressed = false;
                break;
            case "q":
            case "ArrowLeft":
                keys.left.pressed = false;
                break;

            case " ":
                keys.space.pressed = false;
                break;
                
            case "Shift":
                keys.shift.pressed = false;
                break;
        }
    });

    setInterval(() => {
        console.log(frames%60);
      }, 1000)

    animate();

});