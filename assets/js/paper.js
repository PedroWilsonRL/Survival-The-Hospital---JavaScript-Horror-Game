const paperIcon = new Image();
paperIcon.src = 'assets/icons/paper.png';

const paperImages = [];
for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = `assets/papers/paper${i}.png`;
    paperImages.push(img);
}

export const papers = [
    { x: 300, y: 100, isInteracted: false },
    { x: 50, y: 120, isInteracted: false },
    { x: 500, y: 90, isInteracted: false },
    { x: 900, y: 140, isInteracted: false },
    { x: 80, y: 380, isInteracted: false },
    { x: 450, y: 380, isInteracted: false },
    { x: 850, y: 400, isInteracted: false },
    { x: 1200, y: 400, isInteracted: false },
];

let activePaperIndex = null;

export function drawPapers(ctx) {
    for (let i = 0; i < papers.length; i++) {
        const paper = papers[i];
        if (!paper.isInteracted) {
            ctx.drawImage(paperIcon, paper.x, paper.y, 32, 32);
        }
    }
}

export function checkPaperInteraction(player, onOpenPaper) {
    for (let i = 0; i < papers.length; i++) {
        const paper = papers[i];
        const dx = player.x - paper.x;
        const dy = player.y - paper.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 40 && !paper.isInteracted) {
            activePaperIndex = i;
            return;
        }
    }
    activePaperIndex = null;
}

export function handleZPress(showImageCallback) {
    if (activePaperIndex !== null) {
        const paper = papers[activePaperIndex];
        paper.isInteracted = true;
        showImageCallback(paperImages[activePaperIndex]);
    }
}
