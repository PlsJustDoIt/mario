


document.addEventListener('DOMContentLoaded', function() {

    const canvas: HTMLCanvasElement = document.getElementById('cvs') as HTMLCanvasElement;
    canvas.style.backgroundColor = '#00F8'

    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('2d context not supported');
    }

    const ratio = window.devicePixelRatio;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    ctx.scale(ratio,ratio);
    ctx.font = "96px Arial";
    

    const gravity = 0.3;

    
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

        collisionDetection(platform: Platform):void {
            if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
                player.velocity.y = 0;
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
            
            
            if (this.position.y + this.height + this.velocity.y <= canvas.height-300) {
                this.velocity.y += gravity;
            } else {
                this.velocity.y = 0;
            }

            // prevent from going right too far
            if (this.position.x + this.width >= canvas.width) {
                this.velocity.x = 0;
            } 

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
                this.velocity.y = -8;
                // audio.addEventListener('canplay', e => {
                //     console.log('canplay');
                //     audio.play();
                //   });
                audio.play();
            }

        }

        run() {
            this.velocity.x *= 1.5;
        }

        goLeft() {

            //prevent from going out of the screen
            if (this.position.x > 0) {
                this.velocity.x = -5;
            }

        }

        
        goRight() {

            //prevent from going out of the screen
            if (this.position.x < canvas.width - this.width) {
                this.velocity.x = 5;
            }
        }
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
            this.width = 135;
            this.height = 83;
        }

        draw() {
            if (ctx != null) {
                // ctx.fillStyle = "#64ab54";
                // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
                ctx?.drawImage(platform,this.position.x, this.position.y, this.width, this.height);
                // ctx.fillStyle = "black";
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
    const platform = new Image(135,83);
    platform.src = 'assets/platform.png';




    const flag = new Image(263,705);
    flag.src = 'assets/flag.png';

    console.log(flag.complete);
    flag.onload = function() {
        console.log('object loaded');
        ctx?.drawImage(flag, canvas.width - 300, canvas.height-200, 132, 352);
    }

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

    for (let platform of platforms) {
        platform.draw();
    }

    function animate() {
        if (ctx != null) {
            requestAnimationFrame(animate);

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
           
            if (keys.right.pressed == true) {
                console.log('right is pressed');
                player.goRight();
            } else {
                console.log('right is not pressed');
                //player.velocity.x = 0;
            }

            if (keys.left.pressed) {
                player.goLeft();
            }

            if (keys.space.pressed) {
                player.jump();
            }

            if (keys.shift.pressed) {
                player.run();
            }
            // && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width
            // && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width
            //  && player.position.x <= platform.position.x + platform.width
           

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            player.update();
            for (let platform of platforms) {
                platform.draw();
            }
            ctx?.drawImage(flag, canvas.width - 300, 315, 132, 352);
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

    



    animate();

});