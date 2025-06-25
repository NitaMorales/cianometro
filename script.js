const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture');
const downloadBtn = document.getElementById('download');
const resetBtn = document.getElementById('reset');
const toneOverlay = document.getElementById('toneOverlay');
const afterCapture = document.getElementById('afterCapture');

// Cámara trasera
navigator.mediaDevices.getUserMedia({
  video: { facingMode: { ideal: "environment" } },
  audio: false
})
.then(stream => {
  video.srcObject = stream;
})
.catch(error => {
  console.error("No se pudo acceder a la cámara:", error);
});

captureBtn.addEventListener('click', () => {
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const avgColor = getAverageColor(imageData.data);
  const toneNumber = matchCyanometer(avgColor);

  // Mostrar resultado sobre la imagen
  const toneColor = cyanometerTones.find(t => t.tone === toneNumber);
  toneOverlay.style.backgroundColor = `rgb(${toneColor.r}, ${toneColor.g}, ${toneColor.b})`;
  toneOverlay.textContent = toneNumber;
  toneOverlay.style.display = 'flex';

  // Ocultar video y mostrar canvas
  video.style.display = 'none';
  canvas.style.display = 'block';

  // Mostrar acciones post-captura
  afterCapture.style.display = 'block';
  captureBtn.style.display = 'none';
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'cianometro_cielo.png';
  link.href = canvas.toDataURL();
  link.click();
});

resetBtn.addEventListener('click', () => {
  // Resetear la vista
  canvas.style.display = 'none';
  video.style.display = 'block';
  toneOverlay.style.display = 'none';
  captureBtn.style.display = 'inline-block';
  afterCapture.style.display = 'none';
});

function getAverageColor(data) {
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  const pixelCount = data.length / 4;
  return {
    r: Math.round(r / pixelCount),
    g: Math.round(g / pixelCount),
    b: Math.round(b / pixelCount)
  };
}

function matchCyanometer({r, g, b}) {
  let closest = cyanometerTones[0];
  let minDist = Number.MAX_VALUE;

  cyanometerTones.forEach(tone => {
    const dist = Math.sqrt(
      Math.pow(r - tone.r, 2) +
      Math.pow(g - tone.g, 2) +
      Math.pow(b - tone.b, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      closest = tone;
    }
  });

  return closest.tone;
}

const cyanometerTones = [
  { tone: 1, r: 172, g: 184, b: 196 },
  { tone: 2, r: 168, g: 180, b: 194 },
  { tone: 3, r: 160, g: 172, b: 188 },
  { tone: 4, r: 146, g: 164, b: 189 },
  { tone: 5, r: 150, g: 166, b: 185 },
  { tone: 6, r: 132, g: 154, b: 183 },
  { tone: 7, r: 122, g: 141, b: 173 },
  { tone: 8, r: 118, g: 141, b: 173 },
  { tone: 9, r: 117, g: 139, b: 176 },
  { tone: 10, r: 102, g: 127, b: 168 },
  { tone: 11, r: 103, g: 124, b: 167 },
  { tone: 12, r: 94, g: 116, b: 164 },
  { tone: 13, r: 83, g: 103, b: 145 },
  { tone: 14, r: 89, g: 108, b: 147 },
  { tone: 15, r: 243, g: 237, b: 222 },
  { tone: 16, r: 82, g: 103, b: 147 },
  { tone: 17, r: 78, g: 99, b: 150 },
  { tone: 18, r: 69, g: 91, b: 141 },
  { tone: 19, r: 65, g: 86, b: 132 },
  { tone: 20, r: 63, g: 86, b: 139 },
  { tone: 21, r: 57, g: 76, b: 124 },
  { tone: 22, r: 53, g: 68, b: 106 },
  { tone: 23, r: 55, g: 70, b: 109 },
  { tone: 24, r: 47, g: 60, b: 98 },
  { tone: 25, r: 40, g: 53, b: 90 },
  { tone: 26, r: 34, g: 47, b: 81 },
  { tone: 27, r: 33, g: 47, b: 82 },
  { tone: 28, r: 28, g: 42, b: 76 },
  { tone: 29, r: 25, g: 40, b: 75 },
  { tone: 30, r: 25, g: 38, b: 74 },
  { tone: 31, r: 20, g: 35, b: 70 },
  { tone: 32, r: 17, g: 30, b: 65 },
  { tone: 33, r: 18, g: 29, b: 63 },
  { tone: 34, r: 16, g: 28, b: 60 },
  { tone: 35, r: 14, g: 25, b: 55 },
  { tone: 36, r: 13, g: 24, b: 53 },
  { tone: 37, r: 13, g: 22, b: 49 },
  { tone: 38, r: 12, g: 20, b: 47 },
  { tone: 39, r: 10, g: 17, b: 41 },
  { tone: 40, r: 9, g: 16, b: 39 },
  { tone: 41, r: 7, g: 14, b: 36 },
  { tone: 42, r: 6, g: 11, b: 29 },
  { tone: 43, r: 5, g: 10, b: 28 },
  { tone: 44, r: 5, g: 9, b: 24 },
  { tone: 45, r: 4, g: 7, b: 21 },
  { tone: 46, r: 4, g: 6, b: 19 },
  { tone: 47, r: 3, g: 5, b: 15 },
  { tone: 48, r: 3, g: 4, b: 14 },
  { tone: 49, r: 2, g: 3, b: 10 },
  { tone: 50, r: 2, g: 2, b: 9 },
  { tone: 51, r: 1, g: 2, b: 6 },
  { tone: 52, r: 1, g: 1, b: 4 },
  { tone: 53, r: 0, g: 0, b: 2 }
];

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'cianometro_cielo.png';
  link.href = canvas.toDataURL();
  link.click();
});