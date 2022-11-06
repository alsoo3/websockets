const express = require("express");
const app = express();
const server = require('http').Server(app);

const WebSocket = require('ws');

const wss = new WebSocket.Server({ server });
app.use(express.json({ limit: '5mb' }));
app.use(express.static(__dirname));

server.listen(1350, () => {
  console.log("Open the panel at http://localhost:1350");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

function chunk(s, maxBytes) {
  let buf = Buffer.from(s);
  const result = [];
  while (buf.length) {
    result.push(buf.slice(0, maxBytes).toString());
    buf = buf.slice(maxBytes);
  }
  return result;
}

app.post("/", (req, res) => {
  var message = req.body;
  var script = chunk(message.script, 60000); // max size for a websocket message is 64 kb so break that shit up
  if (message.receiver == "all") {
    wss.clients.forEach((client) => {
      if (client.name != undefined && client.readyState == WebSocket.OPEN) {
        client.send("BEGIN SCRIPT");
        script.forEach((script) => {
          client.send(script);
        });
        client.send("END SCRIPT");
      }
    });
  } else {
    wss.clients.forEach((client) => {
      if (client.name == message.receiver && client.readyState == WebSocket.OPEN) {
        client.send("BEGIN SCRIPT");
        script.forEach((script) => {
          client.send(script);
        });
        client.send("END SCRIPT");
      }
    });
  }
  res.sendStatus(200);
});
wss.on('connection', (ws) => {
ws.on('message', (message) => {
    
    message = JSON.parse(message);
    
console.log(message)
wss.clients.forEach((client) => {

client.send(JSON.stringify(message))
    

}
)
}
)
}
)


