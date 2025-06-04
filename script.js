// Script commun pour les pages d'édition
const fileInput = document.getElementById('imageInput');
const selectBtn = document.getElementById('selectBtn');
const canvasBefore = document.getElementById('canvasBefore');
const canvasAfter = document.getElementById('canvasAfter');

if (selectBtn && fileInput) {
    selectBtn.addEventListener('click', () => fileInput.click());
}

if (fileInput && canvasBefore && canvasAfter) {
    const ctxBefore = canvasBefore.getContext('2d');
    const ctxAfter = canvasAfter.getContext('2d');
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

    fileInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) loadImage(file);
    });

    const bgRemoveBtn = document.getElementById('bgRemoveBtn');
    if (bgRemoveBtn) {
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
    }

    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (!checkImageLoaded()) return;
            drawCentered(img, ctxAfter, canvasAfter);
        });
    }
}
