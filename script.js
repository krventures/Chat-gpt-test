const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let img = new Image();

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
});

document.getElementById('retouchBtn').addEventListener('click', () => {
    if (!img.src) return;
    // Simple retouch: increase brightness
    const imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
    const data = imgData.data;
    for (let i=0; i<data.length; i+=4) {
        data[i] = Math.min(255, data[i] + 30);     // R
        data[i+1] = Math.min(255, data[i+1] + 30); // G
        data[i+2] = Math.min(255, data[i+2] + 30); // B
    }
    ctx.putImageData(imgData,0,0);
});

document.getElementById('bgRemoveBtn').addEventListener('click', () => {
    if (!img.src) return;
    const imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
    const data = imgData.data;
    // naive background removal based on top-left pixel
    const r0 = data[0], g0 = data[1], b0 = data[2];
    for (let i=0; i<data.length; i+=4) {
        const dr = Math.abs(data[i]-r0);
        const dg = Math.abs(data[i+1]-g0);
        const db = Math.abs(data[i+2]-b0);
        if (dr<20 && dg<20 && db<20) {
            data[i+3] = 0; // transparent
        }
    }
    ctx.putImageData(imgData,0,0);
});
