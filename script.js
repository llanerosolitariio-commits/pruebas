const peer = new Peer();
const noSleep = new NoSleep();
let localStream;

// 1. Manejo del ID de PeerJS
peer.on('open', (id) => {
    document.getElementById('my-id').innerText = id;
});

// 2. Activar NoSleep y Cámara (Requiere interacción del usuario)
document.getElementById('enable-nosleep').addEventListener('click', function() {
    noSleep.enable(); // Evita que la pantalla se apague
    startCamera();
    this.style.backgroundColor = "#555";
    this.innerText = "✓ Sistema Activo (No se dormirá)";
    document.getElementById('controls').style.display = "block";
});

async function startCamera() {
    try {
        // Configuramos para usar la cámara trasera por defecto (ideal para vigilancia)
        const constraints = { 
            video: { facingMode: "environment" }, 
            audio: true 
        };
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        document.getElementById('local-video').srcObject = localStream;
    } catch (err) {
        alert("Error al acceder a la cámara. Revisa los permisos HTTPS en GitHub.");
    }
}

// 3. Responder llamadas automáticamente
peer.on('call', (call) => {
    call.answer(localStream);
    call.on('stream', (remoteStream) => {
        document.getElementById('remote-video').srcObject = remoteStream;
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
