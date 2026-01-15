const peer = new Peer();
const noSleep = new NoSleep();
let localStream;
let mediaRecorder;
let recordedChunks = [];

peer.on('open', id => { 
    document.getElementById('my-id').innerText = id; 
});

async function activarSistema() {
    noSleep.enable(); 
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" }, 
            audio: true 
        });
        document.getElementById('local-video').srcObject = localStream;
        document.getElementById('btn-init').innerText = "✓ SISTEMA ACTIVO";
        document.getElementById('btn-init').style.background = "#555";
    } catch (err) {
        alert("Error: " + err);
    }
}

peer.on('call', call => {
    call.answer(localStream);
    call.on('stream', remoteStream => {
        document.getElementById('remote-video').srcObject = remoteStream;
    });
});

function connectToPeer() {
    const remoteId = document.getElementById('remote-id').value;
    const call = peer.call(remoteId, localStream);
    call.on('stream', remoteStream => {
        document.getElementById('remote-video').srcObject = remoteStream;
    });
}

function startRecording() {
    if (!localStream) return alert("Primero activa la cámara");
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(localStream);
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'grabacion.webm';
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
}        document.getElementById('remote-video').srcObject = remoteStream;
    });
});

// 4. Función para llamar
function connectToPeer() {
    const remoteId = document.getElementById('remote-id').value;
    if (!remoteId) return alert("Introduce un ID válido");
    
    const call = peer.call(remoteId, localStream);
    call.on('stream', (remoteStream) => {
        document.getElementById('remote-video').srcObject = remoteStream;
    });
}
