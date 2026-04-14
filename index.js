const express = require('express');
const app = express();

// Usage: node index.js <port> <fanout> [peer1host:port] [peer2host:port] ...
// example: node index.js 3000 2 node2:3000 node3:3000
const [,, portArg, fanoutArg, ...peers] = process.argv;
const PORT = portArg || 3000;
const FANOUT = parseInt(fanoutArg) || 2;

const gossip = require('./gossip');
gossip.init(peers, FANOUT);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', require('./routes'));
app.use(express.static('.'))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Peers: ${peers.length ? peers.join(', ') : '(none)'}  fanout=${FANOUT}`);
});