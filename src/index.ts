import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 3000 });

interface User{
  socket:WebSocket
  room:string
}


const allSockets: User[] = [];

wss.on('connection', function connection(socket) {
  
  
  socket.on('error', console.error);
  console.log('--:>connected');

  socket.on('message', function message(data) {
    const parsedData = JSON.parse(data as unknown as string);
if(parsedData.type === 'join'){
  allSockets.push({
    socket,
    room: parsedData.payload.roomId
  })
}

if(parsedData.type === 'chat'){
  const currentUserRoom = allSockets.find((x)=>x.socket==socket)!.room
  allSockets.forEach((x)=>{
    if(x.room === currentUserRoom){
      x.socket.send(JSON.stringify(parsedData.payload.message))
    }
  })
}

if(parsedData.type === 'typing'){
   
  const currentUserRoom = allSockets.find((x)=>x.socket==socket)!.room

  allSockets.forEach((x)=>{
    if(x.room === currentUserRoom){
      x.socket.send(JSON.stringify(parsedData.payload.isTyping))
      console.log(JSON.stringify(parsedData.payload.isTyping))
    }
  })
}
});

// final git pushing
});