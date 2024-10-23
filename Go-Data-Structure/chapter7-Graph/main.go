package main

import "fmt"

type Node struct {
	value int
}

type Edge struct {
	u, v Node
}

func NewNode(value int) Node {
	return Node{value}
}

type Graph struct {
	nodes map[Node]struct{}
	edges map[Edge]struct{}
}

func New() *Graph {
	return &Graph{
		nodes: make(map[Node]struct{}),
		edges: make(map[Edge]struct{}),
	}
}

func (g *Graph) AddNode(n Node) {
	g.nodes[n] = struct{}{}
}

func (g *Graph) AddEdge(u, v Node) {
	g.edges[Edge{u, v}] = struct{}{}
}

func (g *Graph) RemoveNode(n Node) {
	delete(g.nodes, n)

	for e := range g.edges {
		if e.u == n || e.v == n {
			delete(g.edges, e)
		}
	}
}

type Queue struct {
	nodes []*Node
}

func NewQueue() *Queue {
	return &Queue{nodes: []*Node{}}
}

func (q *Queue) Enqueue(n *Node) {
	q.nodes = append(q.nodes, n)
}

func (q *Queue) Dequeue() *Node {
	if len(q.nodes) == 0 {
		return nil
	}
	node := q.nodes[0]
	q.nodes = q.nodes[1:]
	return node
}

func (q *Queue) Len() int {
	return len(q.nodes)
}

func (q *Queue) IsEmpty() bool {
	return len(q.nodes) == 0
}

func BFS(g *Graph, start *Node) {
	visit := make(map[int]bool)
	for n := range g.nodes {
		visit[n.value] = false
	}

	visit[start.value] = true
	queue := NewQueue()
	queue.Enqueue(start)

	for !queue.IsEmpty() {
		u := queue.Dequeue()
		fmt.Println(u.value)
		for edge := range g.edges {
			if edge.u.value == u.value && !visit[edge.v.value] {
				visit[edge.v.value] = true
				n := edge.v
				queue.Enqueue(&n)
			}
		}
	}
}

func DFS(g *Graph, start *Node) {
	visit := make(map[int]bool)
	for n := range g.nodes {
		visit[n.value] = false
	}
	dfsVisit(g, start, visit)
	fmt.Println(visit)
}

func dfsVisit(g *Graph, u *Node, visit map[int]bool) {
	visit[u.value] = true
	fmt.Println(u.value)
	for edge := range g.edges {
		if edge.u.value == u.value && !visit[edge.v.value] {
			n := edge.v
			dfsVisit(g, &n, visit)
		}
	}
}

type WeightedEdge struct {
	u, v   Node
	weight int
}

type WeightedGraph struct {
	nodes map[Node]struct{}
	edges map[WeightedEdge]struct{}
}

func NewWeightedGraph() *WeightedGraph {
	return &WeightedGraph{
		nodes: make(map[Node]struct{}),
		edges: make(map[WeightedEdge]struct{}),
	}
}

func (g *WeightedGraph) AddNode(n Node) {
	g.nodes[n] = struct{}{}
}

func (g *WeightedGraph) AddEdge(u, v Node, weight int) {
	g.edges[WeightedEdge{u, v, weight}] = struct{}{}
}

func (wg *WeightedGraph) RemoveNode(n Node) {
	delete(wg.nodes, n)

	for e := range wg.edges {
		if e.u == n || e.v == n {
			delete(wg.edges, e)
		}
	}
}

type MST struct {
	nodes map[Node]struct{}
	edges map[WeightedEdge]struct{}
}

func (m MST) Print() {
	fmt.Println("Nodes: ")
	for n := range m.nodes {
		fmt.Printf("%v ", n.value)
	}
	fmt.Println()
	fmt.Println("Edges: ")
	for e := range m.edges {
		fmt.Printf("%v ", e)
	}
}

func Prim(wg *WeightedGraph, start *Node) *MST {
	treeNodes := make(map[Node]struct{})
	treeEdges := make(map[WeightedEdge]struct{})

	treeNodes[*start] = struct{}{}

	for len(treeNodes) != len(wg.nodes) {
		node, minEdge := minEdge(wg, treeNodes)
		treeNodes[node] = struct{}{}
		treeEdges[minEdge] = struct{}{}
	}
	return &MST{treeNodes, treeEdges}
}
func minEdge(wg *WeightedGraph, nodes map[Node]struct{}) (n Node, we WeightedEdge) {
	min := 10000
	for e := range wg.edges {
		_, ok1 := nodes[e.u]
		_, ok2 := nodes[e.v]
		if ok1 && !ok2 && e.weight < min {
			min = e.weight
			n = e.v
			we = e
		}
	}
	return
}

func main() {
	node27 := NewNode(27)
	node18 := NewNode(18)
	node21 := NewNode(21)
	node9 := NewNode(9)
	node5 := NewNode(5)
	// node25 := NewNode(25)

	wg := NewWeightedGraph()
	wg.AddNode(node21)
	wg.AddNode(node27)
	wg.AddNode(node18)
	wg.AddNode(node5)
	wg.AddNode(node9)
	wg.AddEdge(node21, node27, 5)
	wg.AddEdge(node21, node18, 10)
	wg.AddEdge(node27, node18, 25)

	wg.AddEdge(node27, node5, 15)
	wg.AddEdge(node18, node9, 20)
	wg.AddEdge(node5, node9, 30)

	mstPrim := Prim(wg, &node21)
	mstPrim.Print()

}
