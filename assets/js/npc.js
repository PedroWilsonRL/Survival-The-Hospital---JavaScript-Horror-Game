import { isBlocked } from './map.js';

export const npcImage = new Image();
npcImage.src = 'assets/characters/npc.png';

const FRAME_WIDTH = 195;
const FRAME_HEIGHT = 270;

export let npcDisplayWidth = 54;
export let npcDisplayHeight = 76;

export const npc = {
    x: 1000,
    y: 100,
    speed: 0,
    direction: 'down',
    currentFrame: 0,
    frameTimer: 0,
    frameInterval: 10,
    maxFrames: 2,
};

const possiblePositions = [
    { x: 300, y: 600 },
    { x: 800, y: 600 },
    { x: 1000, y: 600 },
    { x: 900, y: 300 },
    { x: 200, y: 300 },
    { x: 400, y: 200 },
    { x: 200, y: 200 },
    { x: 600, y: 100 },
    { x: 1000, y: 100 }
];

const npcMoveSound = new Audio('assets/sounds/Creepy_Bell_Sound_Effect.mp3'); 

let lastPositionIndex = -1; 

setInterval(() => {
    const randomIndex = Math.floor(Math.random() * possiblePositions.length);
    const newPos = possiblePositions[randomIndex];
    if (randomIndex !== lastPositionIndex) {  
        npc.x = newPos.x;
        npc.y = newPos.y;
        npcMoveSound.play().catch(error => {
            console.error("Erro ao tentar reproduzir o som de movimento do NPC:", error);
        });
        lastPositionIndex = randomIndex;
    }
}, 5000);

function getFrameCoordinates(direction, frame) {
    switch (direction) {
        case 'down': return { sx: frame * FRAME_WIDTH, sy: 0 };
        case 'left': return { sx: frame * FRAME_WIDTH, sy: 1 * FRAME_HEIGHT };
        case 'right': return { sx: (frame + 2) * FRAME_WIDTH, sy: 1 * FRAME_HEIGHT };
        case 'up': return { sx: (frame + 4) * FRAME_WIDTH, sy: 1 * FRAME_HEIGHT };
        case 'diagRightDown': return { sx: (frame + 3) * FRAME_WIDTH, sy: 0 };
        case 'diagLeftRight': return { sx: (frame + 5) * FRAME_WIDTH, sy: 0 };
        case 'diagUpLeftRight': return { sx: (frame + 4) * FRAME_WIDTH, sy: 1 * FRAME_HEIGHT };
        case 'diagLeftDown': return { sx: (frame + 5) * FRAME_WIDTH, sy: 0 };
        default: return { sx: 0, sy: 0 };
    }
}

export function updateNPC() {
    npc.frameTimer++;
    if (npc.frameTimer >= npc.frameInterval) {
        npc.currentFrame = (npc.currentFrame + 1) % npc.maxFrames;
        npc.frameTimer = 0;
    }
}

export function drawNPC(ctx) {
    if (['down', 'up', 'diagUpLeftRight'].includes(npc.direction)) {
        npc.maxFrames = 3;
    } else {
        npc.maxFrames = 2;
    }

    const coords = getFrameCoordinates(npc.direction, npc.currentFrame);

    ctx.drawImage(
        npcImage,
        coords.sx, coords.sy,
        FRAME_WIDTH, FRAME_HEIGHT,
        npc.x, npc.y,
        npcDisplayWidth, npcDisplayHeight
    );
}
