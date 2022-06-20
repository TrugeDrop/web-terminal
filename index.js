const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const bodyParser = require('body-parser');
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended: true}));

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    if(msg == 'ipconfig') return io.emit('chat message', 'ipconfig komutunu kullanmak mı istiyorsun? Çok beklersin! \n');
      
    const child_process = require('child_process');
    
    const process = child_process.exec(msg, function (error, stdout, stderr) {
        if (error) return io.emit('chat message', 'Output: something went wrong! \n');
        
        io.emit('chat message', stdout);
    });

    process.on('exit', function (code, signal) {
        console.log('Process completed: ' + msg);
    });
  });
});

app.get('/', (req,res) => {
    var options = {
        root: path.join(__dirname)
    };
    res.sendFile('index.html', options)
});

app.post('/cmd', (req,res) => {
    
    const child_process = require('child_process');

    const islem = child_process.exec(req.body.cmd, function (error, stdout, stderr) {

    if (error) throw error;

        'stdout: ' + stdout + 'stderr: ' + stderr

    });

    islem.on('exit', function (code, signal) {
        'İşlem tamamlandı. İşlem kodu:  ' + code
    });
});

server.listen(2999, () => console.log('reaady'));