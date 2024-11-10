window.onload= ()=>{
    document.getElementById('my-button').onclick=()=>{
        console.log("working")
        init();
    }
}

async function init(){
    const stream=await navigator.mediaDevices.getUserMedia({video:true})
    document.getElementById("video").srcObject=stream;
    const peer=createPeer();
    stream.getTracks().forEach(track => peer.addTrack(track,stream))
}

function createPeer() {
    const peer = new RTCPeerConnection({
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302'
            }
        ]
    });

    peer.onnegotiationneeded = () => handleNegotiation(peer);
    return peer;
}


async function handlenegotiation(peer){
    const offer=await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload={
        sdp: peer.localDescription
    }
    const {data}= await axios.post('http://localhost:5000/broadcast', payload);
    const desc=new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch(e=>  console.log(e));    
}