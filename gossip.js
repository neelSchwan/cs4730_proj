// Gossip protocol implementation.
//
// Peers are passed in at startup via CLI args (see index.js).
// Each peer is a "host:port" string, e.g. "node2:3000".
//
// Hotness impl:
//   1. Reviews start at hotness 5 on creation
//   2. Each gossip hop decrements hotness by 1 before sending
//   3. Reviews with hotness <= 1 are NOT spread further
//
// When multiple reviews are queued, hottest go first.
// Pass --fail-rate=0.0–1.0 as a CLI arg to simulate random send failures.

let FAIL_RATE = 0;
let peers = [];
let fanout = 2;

// Called once at startup with the list of peer "host:port" strings, fanout k,
// and optional failRate (0.0–1.0) to simulate random send failures.
function init(peerList, k, failRate = 0) {
  peers = peerList;
  fanout = k ?? 2;
  FAIL_RATE = failRate;
}

// prio queue: reviews waiting to be spread, sorted hottest-first.
// Each entry already has hotness decremented (ready to send).
const queue = [];
let draining = false;

// queue a review for gossip spread.
// Caller passes the review with its current hotness
// We decrement hotness here before queuing
function enqueue(review) {
  if (review.hotness <= 1) return; // nothing to spread

  const toSpread = { ...review, hotness: review.hotness - 1 };

  // Insert with hotness-descending order
  let i = 0;
  while (i < queue.length && queue[i].hotness >= toSpread.hotness) i++;
  queue.splice(i, 0, toSpread);

  if (!draining) drain();
}

async function drain() {
  if (queue.length === 0) { draining = false; return; }
  draining = true;
  const review = queue.shift(); // hottest first
  await spreadToPeers(review);
  drain();
}

// shuffle, returns a new array
function sample(arr, k) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, k);
}

async function spreadToPeers(review) {
  if (peers.length === 0) return;

  const targets = sample(peers, fanout);
  const sends = targets.map(async (peer) => {
    if (Math.random() < FAIL_RATE) {
      console.log(`[gossip] simulated failure — skipping ${peer}`);
      return;
    }
    try {
      const res = await fetch(`http://${peer}/internal/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      console.log(`[gossip] -> ${peer}  origin=${review.origin_id}  hotness=${review.hotness}  [${res.status}]`);
    } catch (err) {
      console.error(`[gossip] ${peer} unreachable: ${err.message}`);
    }
  });

  await Promise.all(sends);
}

module.exports = { init, enqueue };
