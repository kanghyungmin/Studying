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

func main() {
	node27 := NewNode(27)
	node18 := NewNode(18)
	node21 := NewNode(21)
	node9 := NewNode(9)
	node5 := NewNode(5)
	node25 := NewNode(25)

	g := New()
	g.AddNode(node27)
	g.AddNode(node18)
	g.AddNode(node21)
	g.AddNode(node9)
	g.AddNode(node5)
	g.AddNode(node25)

	g.AddEdge(node27, node18)
	g.AddEdge(node27, node21)

	g.AddEdge(node27, node9)
	g.AddEdge(node18, node5)

	g.AddEdge(node21, node5)
	g.AddEdge(node21, node25)

	g.AddEdge(node9, node25)
	g.AddEdge(node5, node25)

	fmt.Println("BFS")
	BFS(g, &node27)
	fmt.Println("DFS")
	DFS(g, &node27)

}
