//William Bukowski was here
class PongGame {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.context = this.canvas.getContext("2d");

        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            radius: 10,
            dx: 0,
            dy: 0,
            speed: 4,
            isMoving: false
        };

        this.paddle = {
            width: 10,
            height: 60,
            x: 30,
            y: this.canvas.height / 2 - 30,
            dy: 4
        };
        this.opponentPaddle = {
            width: 10,
            height: 60,
            x: this.canvas.width - 40,
            y: this.canvas.height / 2 - 30,
            dy: 2 + Math.random() * 2 // Random speed for opponent paddle
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Touch event listeners
        this.canvas.addEventListener("touchstart", this.touchStartHandler.bind(this));
        this.canvas.addEventListener("touchmove", this.touchMoveHandler.bind(this));
        this.canvas.addEventListener("touchend", this.touchEndHandler.bind(this));

        // Mouse event listeners
        this.canvas.addEventListener("mousedown", this.mouseDownHandler.bind(this));
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
        this.canvas.addEventListener("mouseup", this.mouseUpHandler.bind(this));

        // Keyboard event listener
        document.addEventListener("keydown", this.keyDownHandler.bind(this));

        // Fullscreen button event listener
        const fullscreenButton = document.getElementById("fullscreenButton");
        fullscreenButton.addEventListener("click", this.toggleFullscreen.bind(this));
    }

    touchStartHandler(event) {
        event.preventDefault();
        this.touchStartY = event.touches[0].clientY;
        this.startGame();
    }

    touchMoveHandler(event) {
        event.preventDefault();
        const touchY = event.touches[0].clientY;

        if (touchY < this.touchStartY) {
            this.movePaddleUp();
        } else if (touchY > this.touchStartY) {
            this.movePaddleDown();
        }
    }

    touchEndHandler(event) {
        event.preventDefault();
        this.stopPaddleMovement();
    }

    mouseDownHandler(event) {
        event.preventDefault();
        this.isMousePressed = true;
        this.startGame();
    }

    mouseMoveHandler(event) {
        event.preventDefault();
        if (this.isMousePressed) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseY = event.clientY - rect.top;
            if (mouseY < this.paddle.y) {
                this.movePaddleUp();
            } else {
                this.movePaddleDown();
            }
        }
    }

    mouseUpHandler(event) {
        event.preventDefault();
        this.isMousePressed = false;
        this.stopPaddleMovement();
    }

    keyDownHandler(event) {
        if (event.key === "ArrowUp" || event.key === "Up") {
            this.movePaddleUp();
        } else if (event.key === "ArrowDown" || event.key === "Down") {
            this.movePaddleDown();
        }
    }

    movePaddleUp() {
        this.paddle.y -= this.paddle.dy;
    }

    movePaddleDown() {
        this.paddle.y += this.paddle.dy;
    }

    drawBall() {
        this.context.beginPath();
        this.context.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2, false);
        this.context.fillStyle = "#FFFFFF";
        this.context.fill();
        this.context.closePath();
    }

    drawPaddle() {
        this.context.fillStyle = "#FFFFFF";
        this.context.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
    }

    drawOpponentPaddle() {
        this.context.fillStyle = "#FFFFFF";
        this.context.fillRect(this.opponentPaddle.x, this.opponentPaddle.y, this.opponentPaddle.width, this.opponentPaddle.height);
    }

    update() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBall();
        this.drawPaddle();
        this.drawOpponentPaddle();

        if (this.ball.isMoving) {
            this.ball.x += this.ball.dx;
            this.ball.y += this.ball.dy;

            if (this.ball.y + this.ball.radius > this.canvas.height || this.ball.y - this.ball.radius < 0) {
                this.ball.dy *= -1;
            }

            if (this.ball.x - this.ball.radius < this.paddle.x + this.paddle.width &&
                this.ball.y > this.paddle.y &&
                this.ball.y < this.paddle.y + this.paddle.height) {
                this.ball.dx *= -1;
            }

            if (this.ball.x + this.ball.radius > this.opponentPaddle.x &&
                this.ball.y > this.opponentPaddle.y &&
                this.ball.y < this.opponentPaddle.y + this.opponentPaddle.height) {
                this.ball.dx *= -1;
            }

            if (this.ball.x - this.ball.radius < 0) {
                alert("Game Over");
                this.resetGame();
                return;
            }
        }

        this.moveOpponentPaddle(); // Move the opponent paddle
        requestAnimationFrame(this.update.bind(this));
    }

    moveOpponentPaddle() {
        const ballCenterY = this.ball.y;
        const paddleCenterY = this.opponentPaddle.y + this.opponentPaddle.height / 2;

        if (paddleCenterY < ballCenterY) {
            this.opponentPaddle.y += this.opponentPaddle.dy;
        } else {
            this.opponentPaddle.y -= this.opponentPaddle.dy;
        }
    }

    resetGame() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.dx = 0;
        this.ball.dy = 0;
        this.ball.isMoving = false;
    }

    startGame() {
        if (!this.ball.isMoving) {
            this.ball.dx = 3;
            this.ball.dy = 3;
            this.ball.isMoving = true;
            this.update();
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            if (this.canvas.requestFullscreen) {
                this.canvas.requestFullscreen();
            } else if (this.canvas.mozRequestFullScreen) { // Firefox
                this.canvas.mozRequestFullScreen();
            } else if (this.canvas.webkitRequestFullscreen) { // Chrome, Safari and Opera
                this.canvas.webkitRequestFullscreen();
            } else if (this.canvas.msRequestFullscreen) { // IE/Edge
                this.canvas.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
        }
    }
}

// Create an instance of the PongGame class
const game = new PongGame();
