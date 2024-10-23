package main

import (
	"container/heap"
	"fmt"
)

type Element struct {
	value int
}

type PriorityQueue []Element

func (pq PriorityQueue) Len() int {
	return len(pq)
}

func (pq PriorityQueue) Less(i, j int) bool {
	return pq[i].value < pq[j].value
}
func (pq PriorityQueue) Swap(i, j int) {
	if pq.Len() == 0 {
		return
	}
	pq[i], pq[j] = pq[j], pq[i]

}

func (pq *PriorityQueue) Push(x any) {
	element := Element{
		value: x.(int),
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

func main() {
	pq := make(PriorityQueue, 0)
	heap.Push(&pq, 27)
	heap.Push(&pq, 5)
	heap.Push(&pq, 1)
	heap.Push(&pq, 18)

	fmt.Println(pq)

	fmt.Println(heap.Pop(&pq))
	fmt.Println(heap.Pop(&pq))
	fmt.Println(heap.Pop(&pq))
	fmt.Println(heap.Pop(&pq))
}


// func main() {
// 	var s Stack
// 	s.Push(27)
// 	s.Push(5)
// 	s.Push(1)
// 	s.Push(18)

// 	fmt.Println(s)

// 	fmt.Println(s.Pop())
// 	fmt.Println(s.Pop())
// 	fmt.Println(s.Pop())
// 	fmt.Println(s.Pop())

// 	fmt.Println(s)

// }
