package graph

import (
	"container/heap"
	"fmt"
)

type Node struct {
	value int
}

type WeightedEdge struct {
	u, v   Node
	weight int
}

type Element struct {
	value WeightedEdge
}

type PriorityQueue []Element

func (pq PriorityQueue) Len() int {
	return len(pq)
}

func (pq PriorityQueue) Less(i, j int) bool {
	return pq[i].value.weight < pq[j].value.weight
}
func (pq PriorityQueue) Swap(i, j int) {
	if pq.Len() == 0 {
		return
	}
	pq[i], pq[j] = pq[j], pq[i]

}

func (pq *PriorityQueue) Push(x any) {
	element := Element{
		value: x.(WeightedEdge),
	}
	*pq = append(*pq, element)
}

func (pq *PriorityQueue) Pop() any {
	if pq.Len() == 0 {
		return -1
	}

	queue := *pq
	n := pq.Len() - 1
	element := queue[n]
	*pq = queue[:n]
	return element
}

type MST struct {
	nodes map[Node]struct{}
	edges map[WeightedEdge]struct{}
}

type WeightedGraph struct {
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

func Kruskal(wg *WeightedGraph) *MST {
	treeEdges := make(map[WeightedEdge]struct{})
	pq := make(PriorityQueue, 0)

	for e := range wg.edges {
		heap.Push(&pq, e)
	}

	forest := make(map[int][]Node)
	i := 0

	for node := range wg.nodes {
		forest[i] = append(forest[i], node)
		i++
	}

	for n := 0; n < len(wg.nodes)-1 || pq.Len() == 0; {
		edge := heap.Pop(&pq).(Element).value
		i := findInForest(forest, edge.u.value)
		j := findInForest(forest, edge.v.value)
		if i != j {
			treeEdges[edge] = struct{}{}
			forest[i] = append(forest[i], forest[j]...)
			delete(forest, j)
			n++
		}
	}
	return &MST{wg.nodes, treeEdges}
}

func findInForest(forest map[int][]Node, node int) int {
	for i, v := range forest {
		for _, n := range v {
			if n.value == node {
				return i
			}
		}
	}
	return -1
}

func (g *WeightedGraph) AddNode(n Node) {
	g.nodes[n] = struct{}{}
}

func (g *WeightedGraph) AddEdge(u, v Node, weight int) {
	g.edges[WeightedEdge{u, v, weight}] = struct{}{}
}

func (wg *WeightedGraph) RemoveNode(n Node) {
	delete(wg.nodes, n)
}
func NewNode(value int) Node {
	return Node{value}
}
func NewWeightedGraph() *WeightedGraph {
	return &WeightedGraph{
		nodes: make(map[Node]struct{}),
		edges: make(map[WeightedEdge]struct{}),
	}
}

func Warshall(a [][]bool) (p [][]bool) {
	n := len(a)
	for k := 0; k < n; k++ {
		for i := 0; i < n; i++ {
			for j := 0; j < n; j++ {
				a[i][j] = a[i][j] || (a[i][k] && a[k][j])
			}
		}
	}
	return p
}

func Floyd(w [][]int) (d [][]int) {
	d = w
	for k := 0; k < len(w); k++ {
		for i := 0; i < len(w); i++ {
			for j := 0; j < len(w); j++ {
				if d[i][j] > d[i][k]+d[k][j] {
					d[i][j] = d[i][k] + d[k][j]
				}
			}
		}
	}
	return
}

func Dijkstra(start int, w [][]int) (d map[int]int) {
	n := len(w)
	s := make(map[int]struct{})

	s[start] = struct{}{}
	v := make(map[int]struct{})
	d = make(map[int]int)

	for i := 0; i < n; i++ {
		if i != start {
			v[i] = struct{}{}
			d[i] = w[start][i]
		}
	}
	for len(v) != 0 {
		i := findMin(d, v)
		s[i] = struct{}{}
		delete(v, i)
		for j := range v {
			if d[j] > d[i]+w[i][j] {
				d[j] = d[i] + w[i][j]
			}
		}

	}
	return
}

func findMin(d map[int]int, v map[int]struct{}) int {
	min := 99999
	var minNode int
	for i := range v {
		if d[i] < min {
			min = d[i]
			minNode = i
		}
	}
	return minNode
}
