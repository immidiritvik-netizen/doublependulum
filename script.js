const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

let cx = canvas.width / 2;
let cy = 100;

let a1 = Math.PI / 2;
let a2 = Math.PI / 2;

let a1_v = 0;
let a2_v = 0;

let m1 = 10, m2 = 10;
let r1 = 150, r2 = 150;
let g = 1.0;

let ia1 = 90, ia2 = 90;
let iv1 = 0, iv2 = 0;

let trail = [];
let maxTrail = 500;

function getSliderVals() {
    m1 = parseFloat(document.getElementById('m1').value);
    m2 = parseFloat(document.getElementById('m2').value);
    r1 = parseFloat(document.getElementById('l1').value);
    r2 = parseFloat(document.getElementById('l2').value);
    g = parseFloat(document.getElementById('g').value);

    ia1 = parseFloat(document.getElementById('ia1').value);
    ia2 = parseFloat(document.getElementById('ia2').value);
    iv1 = parseFloat(document.getElementById('iv1').value);
    iv2 = parseFloat(document.getElementById('iv2').value);

    document.getElementById('m1val').textContent = m1;
    document.getElementById('m2val').textContent = m2;
    document.getElementById('l1val').textContent = r1;
    document.getElementById('l2val').textContent = r2;
    document.getElementById('gval').textContent = g.toFixed(1);

    document.getElementById('ia1val').textContent = ia1 + '°';
    document.getElementById('ia2val').textContent = ia2 + '°';
    document.getElementById('iv1val').textContent = iv1.toFixed(2);
    document.getElementById('iv2val').textContent = iv2.toFixed(2);
}

document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener('input', getSliderVals);
});

document.getElementById('resetBtn').addEventListener('click', () => {
    a1 = ia1 * Math.PI / 180;
    a2 = ia2 * Math.PI / 180;
    a1_v = iv1;
    a2_v = iv2;
    trail = [];
});

document.getElementById('clearBtn').addEventListener('click', () => {
    trail = [];
});

function calcPhysics() {
    let num1 = -g * (2 * m1 + m2) * Math.sin(a1);
    let num2 = -m2 * g * Math.sin(a1 - 2 * a2);
    let num3 = -2 * Math.sin(a1 - a2) * m2;
    let num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * Math.cos(a1 - a2);
    let den = r1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
    let a1_a = (num1 + num2 + num3 * num4) / den;

    num1 = 2 * Math.sin(a1 - a2);
    num2 = (a1_v * a1_v * r1 * (m1 + m2));
    num3 = g * (m1 + m2) * Math.cos(a1);
    num4 = a2_v * a2_v * r2 * m2 * Math.cos(a1 - a2);
    den = r2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
    let a2_a = (num1 * (num2 + num3 + num4)) / den;

    a1_v += a1_a;
    a2_v += a2_a;
    a1 += a1_v;
    a2 += a2_v;

    a1_v *= 0.9999;
    a2_v *= 0.9999;
}

function draw() {
    ctx.fillStyle = 'rgba(13, 13, 13, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let x1 = r1 * Math.sin(a1) + cx;
    let y1 = r1 * Math.cos(a1) + cy;

    let x2 = x1 + r2 * Math.sin(a2);
    let y2 = y1 + r2 * Math.cos(a2);

    ctx.strokeStyle = '#ff009dff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.fillStyle = '#11ff00ff';
    ctx.beginPath();
    ctx.arc(x1, y1, m1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff0084ff';
    ctx.beginPath();
    ctx.arc(x2, y2, m2, 0, Math.PI * 2);
    ctx.fill();

    trail.push({ x: x2, y: y2 });
    if (trail.length > maxTrail) {
        trail.shift();
    }

    for (let i = 1; i < trail.length; i++) {
        let alpha = i / trail.length;
        ctx.strokeStyle = `rgba(255, 107, 74, ${alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
    }
}

function loop() {
    calcPhysics();
    draw();
    requestAnimationFrame(loop);
}

getSliderVals();
loop();