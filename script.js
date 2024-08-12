"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('cvs');
    canvas.style.backgroundColor = '#00F8';
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('2d context not supported');
    }
    const ratio = window.devicePixelRatio;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    ctx.scale(ratio, ratio);
    const gravity = 0.3;
    // ctx.globalCompositeOperation = 'destination-over'
    // ctx.fillStyle = "blue";
    // console.log(ctx.fillRect(0, 0, canvas.width, canvas.height));
    class Player {
        position;
        width;
        height;
        velocity;
        isRunning;
        constructor() {
            this.position = {
                x: 100,
                y: 100
            };
            this.velocity = {
                x: 0,
                y: 0
            };
            this.width = 20;
            this.height = 40;
            this.isRunning = false;
        }
        draw() {
            if (ctx != null) {
                ctx.fillStyle = "red";
                ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
                ctx.fillStyle = "lightgreen";
                ctx.fillRect(0, canvas.height - 300, canvas.width, 300);
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
            if (this.position.y + this.height + this.velocity.y <= canvas.height - 300) {
                this.velocity.y += gravity;
            }
            else {
                this.velocity.y = 0;
            }
            // prevent from going right too far
            if (this.position.x + this.width >= canvas.width) {
                this.velocity.x = 0;
            }
            if (this.position.x < 0) {
                this.velocity.x = 0;
            }
        }
        jump() {
            //prevent from jumping mid air
            if (this.position.y + this.height >= canvas.height - 300) {
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
        position;
        width;
        height;
        constructor(x, y) {
            this.position = {
                x: x,
                y: y
            };
            this.width = 200;
            this.height = 20;
        }
        draw() {
            if (ctx != null) {
                ctx.fillStyle = "#64ab54";
                ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
            }
        }
    }
    const audio = new Audio('assets/yahoo_effect.mp3');
    console.log(audio);
    const player = new Player();
    const platform = new Platform(500, canvas.height - 350);
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
    };
    player.draw();
    platform.draw();
    function animate() {
        if (ctx != null) {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            player.update();
            platform.draw();
            if (keys.right.pressed == true) {
                console.log('right is pressed');
                player.goRight();
            }
            else {
                console.log('right is not pressed');
                player.velocity.x = 0;
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
            if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
                player.velocity.y = 0;
            }
        }
    }
    window.addEventListener("keydown", function (e) {
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
        }
    });
    window.addEventListener("keyup", function (e) {
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
