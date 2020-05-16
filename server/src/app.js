const http = require('http');
const server = http.createServer();

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server is ready to play on port ${PORT}`);
});
