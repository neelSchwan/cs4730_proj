const express = require('express');
const app = express();

// Usage: node index.js <port> <fanout> [--db=path] [--fail-rate=0.0] [peer1:port ...]
// example: node index.js 3000 2 --db=db_a.sqlite --fail-rate=0.1 node2:3000 node3:3000
const { portArg, fanoutArg, peers, failRate, dbPath } = require('./config');
const PORT = portArg || 3000;
const FANOUT = parseInt(fanoutArg) || 2;

const gossip = require('./gossip');
gossip.init(peers, FANOUT, failRate);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', require('./routes'));
app.use(express.static('.'))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`DB: ${dbPath}  fail-rate=${failRate}`);
  console.log(`Peers: ${peers.length ? peers.join(', ') : '(none)'}  fanout=${FANOUT}`);
});