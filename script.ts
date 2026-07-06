

document.addEventListener('DOMContentLoaded', function() {

    const canvas: HTMLCanvasElement = document.getElementById('cvs') as HTMLCanvasElement;
    canvas.style.backgroundColor = '#00F8'

    const ctx = canvas.getContext('2d');
    const gravity = 0.825;

    if (!ctx) {
        throw new Error('2d context not supported');
    }

    // Logical (CSS pixel) dimensions used by the whole game logic.
    // The canvas buffer is scaled by devicePixelRatio for crisp rendering,
    // but everything below reasons in these logical units.
    let viewWidth = window.innerWidth;
    let viewHeight = window.innerHeight;

    // Ground level: top of the green floor.
    function groundLevel(): number {
        return viewHeight - viewHeight / 3.5;
    }

    function resizeCanvas(ctx: CanvasRenderingContext2D) {

        const ratio = window.devicePixelRatio || 1;

        viewWidth = window.innerWidth;
        viewHeight = window.innerHeight;

        // Buffer size in device pixels so the rendering stays sharp on HiDPI screens.
        canvas.width = viewWidth * ratio;
        canvas.height = viewHeight * ratio;

        // CSS size in logical pixels so the canvas exactly fills the window
        // instead of overflowing by a factor of `ratio`.
        canvas.style.width = viewWidth + 'px';
        canvas.style.height = viewHeight + 'px';

        // Draw using logical pixel coordinates. setTransform resets any previous
        // scaling, so repeated resizes never compound the scale factor.
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    resizeCanvas(ctx);

    // Redimensionner le canvas à chaque fois que la fenêtre change de taille
    window.addEventListener('resize', () => {
        resizeCanvas(ctx); }
    );
    ctx.font = "96px Arial";

    let gameWon = false;

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
                ctx.drawImage(mario, this.position.x, this.position.y, this.width, this.height);
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
            }
        }


        update() {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            // Rester au sol : appliquer la gravité tant qu'on est au-dessus du sol.
            if (this.position.y + this.height + this.velocity.y <= groundLevel()) {
                this.velocity.y += gravity;
            } else {
                this.velocity.y = 0;
            }

            // prevent from going right too far
            if (this.position.x + this.width >= viewWidth) {
                this.velocity.x = 0;
            }


            // prevent from going left too far
            if (this.position.x  < 0) {
                this.velocity.x = 0;

            }

            for (const platform of platforms) {
                this.collisionDetection(platform);
            }

            if (!gameWon &&
                this.position.x + this.width >= viewWidth - 300 &&
                this.position.y + this.height >= viewHeight - 300) {
                gameWon = true;
                audioWin.play();
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
            if (this.position.x < viewWidth - this.width) {
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
                ctx.drawImage(platform, this.position.x, this.position.y, this.width, this.height);
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
        platforms.push(new Platform(400 + 200*i + 50, viewHeight - 400 - 50*i));

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

    // Poll keyboard/gamepad state and translate it into player intents.
    function processInput() {
        const gamepad = navigator.getGamepads()[0];
        if (gamepad) {
            const joystickThreshold = 0.2;
            const joystickX = gamepad.axes[0];
            const buttonA = gamepad.buttons[0].pressed;
            const buttonB = gamepad.buttons[1].pressed;

            const dpadRight = gamepad.buttons[15].pressed;
            const dpadLeft = gamepad.buttons[14].pressed;

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

        if (keys.space.pressed) {
            player.jump();
        }

        if (keys.shift.pressed) {
            player.run();
        }
    }

    // Draw the current game state. Called once per animation frame.
    function render() {
        if (ctx == null) {
            return;
        }

        ctx.clearRect(0, 0, viewWidth, viewHeight);

        if (gameWon) {
            ctx.fillStyle = "black";
            ctx.fillText('You win', viewWidth / 2 - 200, viewHeight / 2);
            return;
        }

        player.draw();

        for (const platform of platforms) {
            platform.draw();
        }
        for (let i = 0; i < 5; ++i) {
            ctx.strokeRect(400 + 200*i + 50, viewHeight - 600 - 50*i, 30, 30);
        }
        ctx.drawImage(flag, viewWidth - 300, groundLevel() - 352, 132, 352);
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(0, groundLevel(), viewWidth, 300);
    }

    // Fixed physics step (in ms). The simulation always advances in 1/60 s
    // increments regardless of the display's refresh rate, so the game runs
    // at the same speed on 60, 120 or 144 Hz monitors.
    const timestep = 1000 / 60;
    let previousTime = performance.now();
    let accumulator = 0;

    function animate(currentTime = performance.now()) {
        requestAnimationFrame(animate);

        if (ctx == null) {
            return;
        }

        let frameTime = currentTime - previousTime;
        previousTime = currentTime;

        // Clamp large gaps (e.g. after the tab was in the background) to avoid
        // the "spiral of death" where too many physics steps queue up at once.
        if (frameTime > 250) {
            frameTime = 250;
        }

        accumulator += frameTime;

        while (accumulator >= timestep) {
            if (!gameWon) {
                processInput();
                player.update();
            }
            accumulator -= timestep;
        }

        render();
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
