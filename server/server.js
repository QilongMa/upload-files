const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');

const server = new express();

server.use(cors());

server.get('/test', (req, res) => {
    res.end('api test success!')
})

server.post('/api/upload', (req, res) => {
    console.log('server received ---', req, res);
    res.json({
        status: 200
    })
})

server.listen(3000, () => {
    console.log('server is running on port 3000, cors enabled!')
})