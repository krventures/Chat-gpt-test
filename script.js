const heroFile = document.getElementById('heroFile');
const heroChooseBtn = document.getElementById('heroChooseBtn');
const startBtn = document.getElementById('startBtn');
const selectBtn = document.getElementById('selectBtn');
const imageInput = document.getElementById('imageInput');
const canvasBefore = document.getElementById('canvasBefore');
const canvasAfter = document.getElementById('canvasAfter');
const ctxBefore = canvasBefore.getContext('2d');
const ctxAfter = canvasAfter.getContext('2d');
const editor = document.getElementById('editor');
let img = new Image();

function drawCentered(image, ctx, canvas) {
    const ratio = Math.min(canvas.width / image.width, canvas.height / image.height);
    const w = image.width * ratio;
    const h = image.height * ratio;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, x, y, w, h);
}

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = ev => {
        img.onload = () => {
            drawCentered(img, ctxBefore, canvasBefore);
            drawCentered(img, ctxAfter, canvasAfter);
        };
        img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
}

function checkImageLoaded() {
    if (!img.src) {
        alert("Veuillez d'abord choisir une image.");
        return false;
    }
    return true;
}

heroChooseBtn.addEventListener('click', () => heroFile.click());
selectBtn.addEventListener('click', () => imageInput.click());

heroFile.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        loadImage(file);
        imageInput.files = e.target.files;
    }
});

imageInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) loadImage(file);
});

startBtn.addEventListener('click', () => {
    editor.scrollIntoView({ behavior: 'smooth' });
});

// Retouche AI : simple éclaircissement
const retouchBtn = document.getElementById('retouchBtn');
retouchBtn.addEventListener('click', () => {
    if (!checkImageLoaded()) return;
    const imgData = ctxAfter.getImageData(0, 0, canvasAfter.width, canvasAfter.height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] + 30);
        data[i + 1] = Math.min(255, data[i + 1] + 30);
        data[i + 2] = Math.min(255, data[i + 2] + 30);
    }
    ctxAfter.putImageData(imgData, 0, 0);
});

// Suppression d'arrière-plan : approche naïve basée sur le pixel coin
const bgRemoveBtn = document.getElementById('bgRemoveBtn');
bgRemoveBtn.addEventListener('click', () => {
    if (!checkImageLoaded()) return;
    const imgData = ctxAfter.getImageData(0, 0, canvasAfter.width, canvasAfter.height);
    const data = imgData.data;
    const r0 = data[0], g0 = data[1], b0 = data[2];
    for (let i = 0; i < data.length; i += 4) {
        const dr = Math.abs(data[i] - r0);
        const dg = Math.abs(data[i + 1] - g0);
        const db = Math.abs(data[i + 2] - b0);
        if (dr < 20 && dg < 20 && db < 20) {
            data[i + 3] = 0;
        }
    }
    ctxAfter.putImageData(imgData, 0, 0);
});

// Reset
const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', () => {
    if (!checkImageLoaded()) return;
    drawCentered(img, ctxAfter, canvasAfter);
});
