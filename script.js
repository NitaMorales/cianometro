const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture');
const result = document.getElementById('result');
const downloadBtn = document.getElementById('download');

nnavigator.mediaDevices.getUserMedia({
  video: {
    facingMode: "environment"
  }
})
.then(stream => {
  video.srcObject = stream;
})
.catch(error => {
  console.error("No se pudo acceder a la cámara:", error);
});
  .then(stream => {
    video.srcObject = stream;
  });

captureBtn.addEventListener('click', () => {
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const avgColor = getAverageColor(imageData.data);
  const cyanometerTone = matchCyanometer(avgColor);

  result.innerHTML = `Tono aproximado del cianómetro: <strong>${cyanometerTone}</strong>`;
  ctx.font = "30px serif";
  ctx.fillStyle = "white";
  ctx.fillText(`Tono: ${cyanometerTone}`, 20, 40);

  canvas.style.display = "block";
  downloadBtn.style.display = "inline-block";
});

function getAverageColor(data) {
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i+1];
    b += data[i+2];
  }
  const pixelCount = data.length / 4;
  return {
    r: Math.round(r / pixelCount),
    g: Math.round(g / pixelCount),
    b: Math.round(b / pixelCount)
  };
}

// Aproximación simple: tono = más azul, menos rojo y verde
function matchCyanometer({r, g, b}) {
  const blueRatio = b - (r + g) / 2;
  let tone = Math.floor((blueRatio / 127) * 53);
  tone = Math.max(1, Math.min(tone, 53));
  return tone;
}

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'cianometro_cielo.png';
  link.href = canvas.toDataURL();
  link.click();
});