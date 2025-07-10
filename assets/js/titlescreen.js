const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const logoImage = new Image();
logoImage.src = 'assets/titlescreen/logo_menu.png';

const startButtonImage = new Image();
startButtonImage.src = 'assets/titlescreen/start_button.png'; 


const instructionsButtonImage = new Image();
instructionsButtonImage.src = 'assets/titlescreen/instruction_button.png'; 

const instructionsScreenImage = new Image();
instructionsScreenImage.src = 'assets/titlescreen/instructions.png'; 

const backButtonImage = new Image();
backButtonImage.src = 'assets/titlescreen/back_button.png'; 

export function startTitleScreen(startGameCallback) {
    let gameStarted = false;
    let showingInstructions = false;

    const logoWidth = 450;
    const logoHeight = 450;
    const logoX = (GAME_WIDTH - logoWidth) / 2;
    const logoY = (GAME_HEIGHT - logoHeight) / 2 - 100;

    const startButtonWidth = 250;
    const startButtonHeight = 100;
    const startButtonX = (GAME_WIDTH - startButtonWidth) / 2;
    const startButtonY = logoY + logoHeight + 20; 

    const instructionsButtonWidth = 250;
    const instructionsButtonHeight = 100;
    const instructionsButtonX = (GAME_WIDTH - instructionsButtonWidth) / 2;
    const instructionsButtonY = startButtonY + startButtonHeight + 5;

    const backButtonWidth = 200;
    const backButtonHeight = 80;
    const backButtonX = (GAME_WIDTH - backButtonWidth) / 2;
    const backButtonY = GAME_HEIGHT - backButtonHeight - 30; 

    let hoverButton = null; 

    function drawTitleScreen() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        if (logoImage.complete) {
            ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
        }

        if (startButtonImage.complete) {
            ctx.drawImage(startButtonImage, startButtonX, startButtonY, startButtonWidth, startButtonHeight);
            if (hoverButton === 'start') {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillRect(startButtonX, startButtonY, startButtonWidth, startButtonHeight);
            }
        }

        if (instructionsButtonImage.complete) {
            ctx.drawImage(instructionsButtonImage, instructionsButtonX, instructionsButtonY, instructionsButtonWidth, instructionsButtonHeight);
            if (hoverButton === 'instructions') {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillRect(instructionsButtonX, instructionsButtonY, instructionsButtonWidth, instructionsButtonHeight);
            }
        }
    }

    function drawInstructionsScreen() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        if (instructionsScreenImage.complete) {
            ctx.drawImage(instructionsScreenImage, 0, 0, GAME_WIDTH, GAME_HEIGHT);
        } else {
            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Carregando instruções...', GAME_WIDTH / 2, GAME_HEIGHT / 2);
        }

        if (backButtonImage.complete) {
            ctx.drawImage(backButtonImage, backButtonX, backButtonY, backButtonWidth, backButtonHeight);
            if (hoverButton === 'back') {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillRect(backButtonX, backButtonY, backButtonWidth, backButtonHeight);
            }
        }
    }

    function mainLoop() {
        if (showingInstructions) {
            drawInstructionsScreen();
        } else {
            drawTitleScreen();
        }

        if (!gameStarted) {
            requestAnimationFrame(mainLoop);
        }
    }

    function isInside(x, y, w, h, mouseX, mouseY) {
        return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
    }

    function onClick(e) {
        if (gameStarted) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (showingInstructions) {
            if (
                isInside(backButtonX, backButtonY, backButtonWidth, backButtonHeight, mouseX, mouseY)
            ) {
                showingInstructions = false;
            }
            return;
        }

        if (
            isInside(startButtonX, startButtonY, startButtonWidth, startButtonHeight, mouseX, mouseY)
        ) {
            gameStarted = true;
            canvas.removeEventListener('click', onClick);
            canvas.removeEventListener('mousemove', onMouseMove);
            startGameCallback();
            return;
        }

        if (
            isInside(instructionsButtonX, instructionsButtonY, instructionsButtonWidth, instructionsButtonHeight, mouseX, mouseY)
        ) {
            showingInstructions = true;
            return;
        }
    }

    function onMouseMove(e) {
        if (gameStarted) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (showingInstructions) {
            if (isInside(backButtonX, backButtonY, backButtonWidth, backButtonHeight, mouseX, mouseY)) {
                hoverButton = 'back';
            } else {
                hoverButton = null;
            }
        } else {
            if (isInside(startButtonX, startButtonY, startButtonWidth, startButtonHeight, mouseX, mouseY)) {
                hoverButton = 'start';
            } else if (isInside(instructionsButtonX, instructionsButtonY, instructionsButtonWidth, instructionsButtonHeight, mouseX, mouseY)) {
                hoverButton = 'instructions';
            } else {
                hoverButton = null;
            }
        }
    }

    canvas.addEventListener('click', onClick);
    canvas.addEventListener('mousemove', onMouseMove);

    mainLoop();
}
