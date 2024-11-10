const express=require('express')
const parser=require('body-parser');
const bodyParser = require('body-parser');
const webrtc=require('wrtc')
const app=express();
const cors=require('cors')
const path=require('path')
app.use(cors({
    origin: '*',
}))
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json)

let senderStream;
app.post("/consumer", async ({body},res)=>{
    const peer=new webrtc.RTCPeerConnection({
        iceServers:[
            {
                urls: 'stun:stun.l.google.com:19302'
            }
        ]
    })
    peer.ontrack=(e)=> handleTrackEvent(e,peer);
    const desc=new webrtc.RTCSessionDescription(body.sdp);
    senderStream.getTracks().forEach(track=> peer.addTrack(track,senderStream))
    const answer=await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload={
        sdp:peer.localDescription
    }
    console.log(senderStream)
    res.json(payload);
})
 


//streamer will connect to this 
app.post('/broadcast', async ({body},res)=>{
    const peer=new webrtc.RTCPeerConnection({
        iceServers:[
            {
                urls:['stun:stun.l.google.com:19302'],
            }
        ]
    })
    console.log("broadcast working")
    peer.ontrack=(e)=> handleTrackEvent(e,peer);
    const desc=new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    const answer=await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload={
        sdp:peer.localDescription
    }
    console.log(payload)
    return res.json(payload);
})

app.listen(5000, ()=> console.log('server started') );