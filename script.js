const peer = new Peer();
let localStream;

// Obtener ID del dispositivo actual
peer.on('open', (id) => {
    document.getElementById('my-id').innerText = id;
});

// Pedir permiso de cámara al cargar
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: true })
    .then((stream) => {
        localStream = stream;
        document.getElementById('local-video').srcObject = stream;
    })
    .catch(err => {
        alert("Error de cámara: " + err);
    });

// Responder llamadas automáticas
peer.on('call', (call) => {
    call.answer(localStream);
    call.on('stream', (remoteStream) => {
        document.getElementById('remote-video').srcObject = remoteStream;
    });
});

// Función para llamar al ID ingresado
function connectToPeer() {
    const remoteId = document.getElementById('remote-id').value;
    if (!remoteId) return alert("Ingresa un ID");
    
    const call = peer.call(remoteId, localStream);
    call.on('stream', (remoteStream) => {
        document.getElementById('remote-video').srcObject = remoteStream;
    });
}
