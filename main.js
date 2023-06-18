import PongGame from './pong.js';

// Create an instance of the PongGame class
const game = new PongGame();

// Additional main program logic
console.log("Main program is running");

// Example event listener
document.addEventListener("keydown", function(event) {
    console.log("Key pressed:", event.key);
});
