const express = require('express');
// const http = require('http');
const path = require('path');
const cors = require('cors');
const control = require('./controller');

const storePath = path.resolve(__dirname, "..", "target");
const server = new express();
const controller = new control(storePath);

server.use(cors());

server.post('/api/merge', async (req, res) => {
    console.log('---merge request---');
    await controller.handleMerge(req, res);
    res.end('api merge request!')
    return;
})

server.post('/api/upload', async (req, res) => {
    console.log('server received ---');
    await controller.handleUpload(req, res);
    res.json({
        status: 200
    })
    return;
})
server.post('/api/verify', async (req, res) => {
    console.log('server verify ---');
    // 
    await controller.handleVerify(req, res);
    return;
})

server.listen(3000, () => {
    console.log('server is running on port 3000, cors enabled!')
})