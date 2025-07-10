import { drawMap, drawMapUpper } from './map.js';
import { player, updatePlayer, drawPlayer, displayWidth, displayHeight } from './player.js';
import { papers, drawPapers, checkPaperInteraction, handleZPress } from './paper.js';
import { startTitleScreen } from './titlescreen.js';
import { npc, updateNPC, drawNPC, npcDisplayWidth, npcDisplayHeight } from './npc.js'; 

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const zoom = 2;
let showingPaperImage = null;
let gameOver = false;

let interactedPaperCount = 0;
const paperIcon = new Image();
paperIcon.src = 'assets/icons/paper.png';  

const backgroundMusic = new Audio('assets/sounds/Horror_Music_Background.mp3'); 
backgroundMusic.loop = true;  
backgroundMusic.volume = 0.5; 

const interactionSound = new Audio('assets/sounds/Paper_Sound_Effect.mp3'); 
interactionSound.volume = 0.5;

function startBackgroundMusic() {
    backgroundMusic.play().catch(error => {
        console.error("Erro ao tentar reproduzir a música de fundo:", error);
    });
}

function playInteractionSound() {
    interactionSound.play().catch(error => {
        console.error("Erro ao tentar reproduzir o som de interação:", error);
    });
}

window.addEventListener('keydown', (e) => {
    if (gameOver) return;

    if (e.key === 'z' || e.key === 'Z') {
        if (showingPaperImage === null) {
            handleZPress((image) => {
                showingPaperImage = image;
                interactedPaperCount++;

                playInteractionSound();

                if (interactedPaperCount === 8) {
                    setTimeout(() => {
                        restartGame();  
                    }, 500); 
                }
            });
        } else {
            showingPaperImage = null;
        }
    }
});

function gameLoop() {
    if (gameOver) return; 

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayer();

    const cameraX = player.x + displayWidth / 2 - (GAME_WIDTH / (2 * zoom));
    const cameraY = player.y + displayHeight / 2 - (GAME_HEIGHT / (2 * zoom));

    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(-cameraX, -cameraY);

    drawMap(ctx);
    drawPapers(ctx);

    updateNPC();
    drawNPC(ctx);
    drawPlayer(ctx);
    drawMapUpper(ctx);

    ctx.restore();

    if (showingPaperImage) {
        ctx.drawImage(showingPaperImage, 0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    if (!showingPaperImage) {
        const playerScreenX = (player.x - cameraX) * zoom;
        const playerScreenY = (player.y - cameraY) * zoom;

        const lightRadius = 350;
        const gradient = ctx.createRadialGradient(
            playerScreenX + displayWidth / 2, playerScreenY + displayHeight / 2, 10,
            playerScreenX + displayWidth / 2, playerScreenY + displayHeight / 2, lightRadius
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.95)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    checkPaperInteraction(player);
    checkCollisionWithNPC(); 
    drawPaperCount();

    requestAnimationFrame(gameLoop);
}

function checkCollisionWithNPC() {
    const px = player.x + displayWidth / 2;
    const py = player.y + displayHeight / 2;
    const nx = npc.x + npcDisplayWidth / 2;
    const ny = npc.y + npcDisplayHeight / 2;

    const dx = Math.abs(px - nx);
    const dy = Math.abs(py - ny);

    const overlapX = dx < (displayWidth + npcDisplayWidth) / 2;
    const overlapY = dy < (displayHeight + npcDisplayHeight) / 2;

    if (overlapX && overlapY) {
        endGame(); 
    }
}

function drawPaperCount() {
    const iconSize = 45;
    const padding = 10;
    const xPos = GAME_WIDTH - iconSize - padding;
    const yPos = GAME_HEIGHT - iconSize - padding;

    ctx.drawImage(paperIcon, xPos, yPos, iconSize, iconSize);
    ctx.font = '45px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`${interactedPaperCount}/8`, xPos - 70, yPos + iconSize - 5);  
}

function endGame() {
    gameOver = true;
    backgroundMusic.pause();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '60px BEBAS NEUE';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('YOU GOT CAUGHT!', canvas.width / 2, canvas.height / 2);

    setTimeout(() => {
        restartGame();
        gameOver = false;
        startBackgroundMusic();
    }, 3000);
}

function restartGame() {
    interactedPaperCount = 0;
    player.x = 100;
    player.y = 100;

    papers.forEach(paper => paper.isInteracted = false);

    startTitleScreen(() => {
        gameLoop();  
    });
}

startTitleScreen(() => {
    startBackgroundMusic();  
    gameLoop();
});
