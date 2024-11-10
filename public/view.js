window.onload= ()=>{
    document.getElementById('my-button').onClick=()=>{
        init();
    }
}

async function init(){
    const peer=createPeer();
    peer.addTransceiver("video",{direction:"recvonly"})
}

function createPeer(){
    const peer=new RTCPeerConnection();
    iceServer:[
        {
            urls: 'stun:stun.l.google.com:19302'
        }
    ]
    peer.ontrack=handleTrackEvent;
    peer.onnegotiationneeded=()=> handlenegotiation(peer);
    
    return peer;
}

async function handlenegotiation(peer){
    const offer=await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload={
        sdp: peer.localDescription
    }
    const {data}= await axios.post('http://localhost:5000/consumer', payload);
    const desc=new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch(e=>  console.log(e));    
}

function handleTrackEvent(e){
    document.getElementById("video").srcObject=e.streams[0];
}