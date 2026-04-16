// Parses CLI args once; imported by index.js, db.js, etc.
//
// Usage: node index.js <port> <fanout> [--db=path] [--fail-rate=0.0] [peer1:port ...]
// Example: node index.js 3000 2 --db=db_a.sqlite --fail-rate=0.1 node2:3000 node3:3000

const args = process.argv.slice(2);

let dbPath = 'db.sqlite';
let failRate = 0;
const positional = [];

for (const arg of args) {
  if (arg.startsWith('--db=')) {
    dbPath= arg.slice(5);
  }
  else if (arg.startsWith('--fail-rate=')) {
    failRate = parseFloat(arg.slice(12));
  }
  else positional.push(arg);
}

const [portArg, fanoutArg, ...peers] = positional;

module.exports = { dbPath, failRate, portArg, fanoutArg, peers };
