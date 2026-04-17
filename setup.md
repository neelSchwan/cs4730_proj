## Setup and Running Instructions (Khoury Linux Cluster)

### Prerequisites
- SSH access to linux-071 through linux-076
- Node.js should be pre-installed on the Khoury Machines

### Step 1 - Clone the repo (run on each of linux-071 through linux-075)

```bash
ssh <username>@linux-071.khoury.northeastern.edu
cd ~
git clone https://github.com/neelSchwan/cs4730_proj
cd cs4730_proj
npm install better-sqlite3@9
npm install
```
and repeat this for linux-072 through linux-075

### Step 2 - Start each node

Run the corresponding script on each node:

```bash
# linux-071
bash node1.sh
```

```bash
# linux-072
bash node2.sh
```

```bash
# linux-073
bash node3.sh
```

```bash
# linux-074
bash node4.sh
```

```bash
# linux-075
bash node5.sh
```

Each node will print its port, db path, fail-rate, and peer list on startup. All nodes will listen on port 12000.
### Step 3 - Run the test from linux-076

```bash
ssh <username>@linux-076.khoury.northeastern.edu
cd ~
# this might already be here by this point because the machines share some data
git clone https://github.com/neelSchwan/cs4730_proj
cd cs4730_proj
bash test.sh
```

After some time, the script will pause and print:
(on linux-072: Ctrl+C the node, run 'bash node2_failrate.sh', then press enter here)

At this point, switch to the linux-072 terminal, press Cntrl+C to stop node 2, then run:

```bash
bash node2_failure.sh
```

Then switch back to linux-076 and press Enter to continue the test