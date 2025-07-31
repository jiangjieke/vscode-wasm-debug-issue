#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

// Define the port to use
const PORT = 3002;

// Create the server
const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Construct the file path
  let filePath = path.join(process.cwd(), req.url);
  
  // If requesting the root or a directory, serve a simple message
  if (req.url === '/' || req.url.endsWith('/')) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Test server for WASM files');
    return;
  }
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }
    
    // Read and serve the file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading file');
        return;
      }
      
      // Set content type based on file extension
      const ext = path.extname(filePath);
      let contentType = 'application/octet-stream';
      if (ext === '.js') contentType = 'application/javascript';
      if (ext === '.wasm') contentType = 'application/wasm';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}/`);
});

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});