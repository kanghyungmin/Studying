package main

import (
	"example/graph"
	"fmt"
)

func main() {
	// node27 := graph.NewNode(27)
	// node18 := graph.NewNode(18)
	// node21 := graph.NewNode(21)
	// node9 := graph.NewNode(9)
	// node5 := graph.NewNode(5)
	// // node25 := NewNode(25)

	// wg := graph.NewWeightedGraph()
	// wg.AddNode(node21)
	// wg.AddNode(node27)
	// wg.AddNode(node18)
	// wg.AddNode(node5)
	// wg.AddNode(node9)
	// wg.AddEdge(node21, node27, 5)
	// wg.AddEdge(node21, node18, 10)
	// wg.AddEdge(node27, node18, 25)

	// wg.AddEdge(node27, node5, 15)
	// wg.AddEdge(node18, node9, 20)
	// wg.AddEdge(node5, node9, 30)

	// mstPrim := graph.Kruskal(wg)
	// mstPrim.Print()

	// a := [][]bool{
	// 	{false, true, false, true, false},
	// 	{false, false, false, false, true},
	// 	{false, false, false, true, true},

	// 	{false, false, false, false, false},
	// 	{false, false, false, true, false},
	// }
	// p := graph.Warshall(a)
	// fmt.Println(p)
	// fmt.Println(a)

	const INF = 99999
	// w := [][]int{
	// 	{0, 5, INF, INF, INF},
	// 	{INF, 0, INF, INF, 10},
	// 	{INF, INF, 0, 3, 6},
	// 	{INF, INF, INF, 0, INF},
	// 	{INF, INF, INF, 9, 0},
	// }
	// d := graph.Floyd(w)
	// fmt.Println(d)

	w := [][]int{
		{0, 5, INF, 7, INF},
		{INF, 0, INF, INF, 10},
		{INF, INF, 0, INF, INF},
		{INF, INF, 3, 0, INF},
		{INF, INF, 6, 9, 0},
	}
	d := graph.Dijkstra(0, w)
	fmt.Println(d)
}
