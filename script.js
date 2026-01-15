const peer = new Peer();
const noSleep = new NoSleep();
let localStream;
let mediaRecorder;
let recordedChunks = [];

// Mostrar ID cuando PeerJS esté listo
peer.on('open', id => { 
    document.getElementById('my-id').innerText = id; 
});

// Función Maestra para activar todo
async function activarSistemaCompleto() {
    // 1. Evitar que la pantalla se apague (simulación visual)
    noSleep.enable(); 
    
    // 2. Activar audio silencioso (simulación de proceso activo para Android)
    const audio = document.getElementById('silent-audio');
    audio.volume = 0.01; 
    audio.play();

    try {
        // 3. Solicitar Cámara y Micrófono
        localStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: "environment", // Usa la cámara trasera
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }, 
            audio: true 
        });
        
        document.getElementById('local-video').srcObject = localStream;
        document.getElementById('btn-init').innerText = "✓ SISTEMA TOTALMENTE ACTIVO";
        document.getElementById('btn-init').style.background = "#444";
        
        console.log("Persistencia de hardware iniciada.");
    } catch (err) {
        alert("Error de acceso: " + err);
    }
}

// Escuchar llamadas entrantes
peer.on('call', call => {
    call.answer(localStream);
    call.on('stream', remoteStream => {
        document.getElementById('remote-video').srcObject = remoteStream;
    });
});

// Llamar a otro celular
function connectToPeer() {
    const remoteId = document.getElementById('remote-id').value;
    if (!remoteId) return alert("Ingresa un ID");
    
    const call = peer.call(remoteId, localStream);
    call.on('stream', remoteStream => {
        document.getElementById('remote-video').srcObject = remoteStream;
    });
}

// Lógica de Grabación de Video
function startRecording() {
    if (!localStream) return alert("Primero activa el sistema");
    
    recordedChunks = [];
    // Intentamos usar un formato compatible con móviles
    mediaRecorder = new MediaRecorder(localStream, { mimeType: 'video/webm;codecs=vp8' });
    
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
    
    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vigilancia_${new Date().getTime()}.webm`;
        a.click();
    };

    mediaRecorder.start();
    document.getElementById('start-rec').style.display = 'none';
    document.getElementById('stop-rec').style.display = 'inline-block';
    document.getElementById('recording-status').style.display = 'block';
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        document.getElementById('start-rec').style.display = 'inline-block';
        document.getElementById('stop-rec').style.display = 'none';
        document.getElementById('recording-status').style.display = 'none';
    }
}}
