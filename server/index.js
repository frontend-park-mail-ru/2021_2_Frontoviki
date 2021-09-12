const http = require('http');
const fs = require('fs');

const page404 = fs.readFileSync('./public/404.html')

const server = http.createServer((req, res) => {
    const path = req.url === '/' ? '/index.html' : req.url
    console.log('request', req.url, path, req.headers['user-agent']);



    fs.readFile(`./public${path}`, (err, data) => {
        if (err) {
            data = page404
        }
        if (/.(jpg)$/.test(path)) {
            res.writeHead(200, {'Content-Type': 'image/jpg'});
            res.end(data,'Base64');
        } else {
            res.write(data);
            res.end();
        }
    });
});


console.log("listening at http://127.0.0.1:8080")
server.listen(8080)