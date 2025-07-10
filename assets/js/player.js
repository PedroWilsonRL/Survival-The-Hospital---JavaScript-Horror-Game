import { isBlocked } from './map.js';

export const playerImage = new Image();
playerImage.src = 'assets/characters/player.png';

const FRAME_WIDTH = 195;
const FRAME_HEIGHT = 270;

export let displayWidth = 54;
export let displayHeight = 76;

export const player = {
    x: 20,
    y: 600,
    speed: 2,
    direction: 'down', 
    currentFrame: 0,
    frameTimer: 0,
    frameInterval: 10,
    maxFrames: 2,
};

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};

window.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }
});
window.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

export function updatePlayer() {
    let moving = false;

    const up = keys.ArrowUp;
    const down = keys.ArrowDown;
    const left = keys.ArrowLeft;
    const right = keys.ArrowRight;

    let newX = player.x;
    let newY = player.y;

    if (up && left && right) {
        newY -= player.speed * 0.7;
        player.direction = 'diagUpLeftRight';
        moving = true;
    } else if (up && right) {
        newX += player.speed * 0.7;
        newY -= player.speed * 0.7;
        player.direction = 'diagUpLeftRight';
        moving = true;
    } else if (up && left) {
        newX -= player.speed * 0.7;
        newY -= player.speed * 0.7;
        player.direction = 'diagUpLeftRight';
        moving = true;
    } else if (down && right) {
        newX += player.speed * 0.7;
        newY += player.speed * 0.7;
        player.direction = 'diagRightDown';
        moving = true;
    } else if (down && left) {
        newX -= player.speed * 0.7;
        newY += player.speed * 0.7;
        player.direction = 'diagLeftDown';  
        moving = true;
    } else if (left && right) {
        player.direction = 'diagLeftRight';
        moving = true;
    } else if (up) {
        newY -= player.speed;
        player.direction = 'up';
        moving = true;
    } else if (down) {
        newY += player.speed;
        player.direction = 'down';
        moving = true;
    } else if (left) {
        newX -= player.speed;
        player.direction = 'left';
        moving = true;
    } else if (right) {
        newX += player.speed;
        player.direction = 'right';
        moving = true;
    }

    const centerX = newX + displayWidth / 2;
    const centerY = newY + displayHeight / 2;

    if (!isBlocked(centerX, centerY)) {
        player.x = newX;
        player.y = newY;
    }

    if (!moving) {
        player.currentFrame = 0;
        player.frameTimer = 0;
        return;
    }

    player.frameTimer++;
    if (player.frameTimer >= player.frameInterval) {
        player.currentFrame = (player.currentFrame + 1) % player.maxFrames;
        player.frameTimer = 0;
    }
}


function getFrameCoordinates(direction, frame) {
    switch (direction) {
        case 'down':
            return { sx: frame * FRAME_WIDTH, sy: 0 };
        case 'left':
            return { sx: frame * FRAME_WIDTH, sy: 1 * FRAME_HEIGHT };
        case 'right':
            return { sx: (frame + 2) * FRAME_WIDTH, sy: 1 * FRAME_HEIGHT };
        case 'up':
            return { sx: (frame + 4) * FRAME_WIDTH, sy: 1 * FRAME_HEIGHT };
        case 'diagRightDown':
            return { sx: (frame + 3) * FRAME_WIDTH, sy: 0 };
        case 'diagLeftRight':
            return { sx: (frame + 5) * FRAME_WIDTH, sy: 0 };
        case 'diagUpLeftRight':
            return { sx: (frame + 4) * FRAME_WIDTH, sy: 1 * FRAME_HEIGHT };
        case 'diagLeftDown':  
            return { sx: (frame + 5) * FRAME_WIDTH, sy: 0 };
        default:
            return { sx: 0, sy: 0 };
    }
}

export function drawPlayer(ctx) {
    if (['down', 'up', 'diagUpLeftRight'].includes(player.direction)) {
        player.maxFrames = 3;
    } else {
        player.maxFrames = 2;
    }

    const coords = getFrameCoordinates(player.direction, player.currentFrame);

    ctx.drawImage(
        playerImage,
        coords.sx, coords.sy,
        FRAME_WIDTH, FRAME_HEIGHT,
        player.x, player.y,
        displayWidth, displayHeight
    );
}
