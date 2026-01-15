const peer = new Peer();
const noSleep = new NoSleep();
let localStream;
let mediaRecorder;
let recordedChunks = [];

// Obtener ID
peer.on('open', id => { 
    document.getElementById('my-id').innerText = id; 
});

// Activar sistema
async function activarSistemaCompleto() {
    noSleep.enable(); 
    const audio = document.getElementById('silent-audio');
    audio.volume = 0.01; 
    audio.play().catch(e => console.log("Audio requiere click"));

    try {
        localStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" }, 
            audio: true 
        });
        document.getElementById('local-video').srcObject = localStream;
        document.getElementById('btn-init').innerText = "✓ SISTEMA ACTIVO";
        document.getElementById('btn-init').style.background = "#444";
    } catch (err) {
        alert("Error de cámara: " + err);
    }
}

// Recibir llamada
peer.on('call', call => {
    call.answer(localStream);
    call.on('stream', remoteStream => {
        document.getElementById('remote-video').srcObject = remoteStream;
    });
});

// Llamar
function connectToPeer() {
    const rId = document.getElementById('remote-id').value;
    if (!rId) return alert("Falta ID");
    const call = peer.call(rId, localStream);
    call.on('stream', rs => {
        document.getElementById('remote-video').srcObject = rs;
    });
}

// Grabación
function startRecording() {
    if (!localStream) return alert("Inicia la cámara primero");
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(localStream);
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'video.webm';
        a.click();
    };
    mediaRecorder.start();
    document.getElementById('start-rec').style.display = 'none';
    document.getElementById('stop-rec').style.display = 'inline-block';
    document.getElementById('recording-status').style.display = 'block';
}

function stopRecording() {
    mediaRecorder.stop();
    document.getElementById('start-rec').style.display = 'inline-block';
    document.getElementById('stop-rec').style.display = 'none';
    document.getElementById('recording-status').style.display = 'none';
}