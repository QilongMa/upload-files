const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const control = require('./controller');

const storePath = path.resolve(__dirname, "..", "target");
const server = http.createServer()
const controller = new control(storePath);


server.on("request", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "*")
    if (req.method === "OPTIONS") {
      res.status = 200
      res.end()
      return
    }
    if (req.method === "POST") {
      if (req.url == '/api/upload') {
        await controller.handleUpload(req, res);
        return 
      }
      if (req.url == '/api/merge') {
        await controller.handleMerge(req, res);
        return 
      }
      if (req.url == '/api/verify') {
        await controller.handleVerify(req, res);
        return 
      }
    }
  
  })

server.listen(3000, () => {
    console.log('server is running on port 3000, cors enabled!')
})