#!/usr/bin/env bash
set -e

N1="10.200.125.71:12000"
N2="10.200.125.72:12000"
N3="10.200.125.73:12000"
N4="10.200.125.74:12000"
N5="10.200.125.75:12000"

echo "--- registering user ---"
curl -s -X POST http://$N1/users -H "Content-Type: application/json" -d '{"username":"grader"}'
echo ""

echo "--- posting review to node 1 ---"
curl -s -X POST http://$N1/reviews -H "Content-Type: application/json" -d '{"user_id":1,"rating":5,"subject":"Gossip Test","description":"testing propagation"}'
echo ""

echo "--- waiting 3s for gossip to propagate ---"
sleep 3

echo "--- checking all nodes for review ---"
echo "node 1:"; curl -s http://$N1/reviews; echo ""
echo "node 2:"; curl -s http://$N2/reviews; echo ""
echo "node 3:"; curl -s http://$N3/reviews; echo ""
echo "node 4:"; curl -s http://$N4/reviews; echo ""
echo "node 5:"; curl -s http://$N5/reviews; echo ""

echo "--- posting review with fail-rate=0.9 on node 2 ---"
echo "(on linux-072: Ctrl+C the node, run 'bash node2_failrate.sh', then press enter here)"
read

curl -s -X POST http://$N2/reviews -H "Content-Type: application/json" -d '{"user_id":1,"rating":3,"subject":"Fail Rate Test","description":"testing with high drop rate"}'
echo ""

echo "--- waiting 5s ---"
sleep 5

echo "--- checking propagation under failure ---"
echo "node 1:"; curl -s http://$N1/reviews; echo ""
echo "node 2:"; curl -s http://$N2/reviews; echo ""
echo "node 3:"; curl -s http://$N3/reviews; echo ""
echo "node 4:"; curl -s http://$N4/reviews; echo ""
echo "node 5:"; curl -s http://$N5/reviews; echo ""
