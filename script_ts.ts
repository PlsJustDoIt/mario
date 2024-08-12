

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
    

    const gravity = 0.3;

    
    // ctx.globalCompositeOperation = 'destination-over'
    // ctx.fillStyle = "blue";
    // console.log(ctx.fillRect(0, 0, canvas.width, canvas.height));

    class Player {
        position: { x: number; y: number; };
        width: number;
        height: number;
        velocity: { x: number; y: number; };

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

        }

        draw() {
            if (ctx != null ) {
                ctx.fillStyle = "red";
                ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
                ctx.fillStyle = "lightgreen";
                console.log(ctx.fillRect(0,canvas.height-300,canvas.width,300));
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

        }

        jump() {

            //prevent from jumping mid air
            if (this.position.y + this.height >= canvas.height-300) {
                console.log(('ggg'));
                this.velocity.y = -8;
            }

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

    

        const player = new Player();
        const keys = {
            right: {
                pressed: false
            },
            left: {
                pressed: false
            },
            space: {
                pressed: false
            }

        }
        player.draw();

       
        
        function animate() {
            if (ctx != null) {
                requestAnimationFrame(animate);
                
                if (keys.right.pressed == true) {
                    console.log('right is pressed');
                    player.goRight();
                } else {
                    console.log('right is not pressed');
                    player.velocity.x = 0;
                }

                if (keys.left.pressed) {
                    player.goLeft();
                }

                if (keys.space.pressed) {
                    player.jump();
                }


                ctx.clearRect(0, 0, canvas.width, canvas.height);
                player.update();
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
                    
            }
        });

        



        animate();

});