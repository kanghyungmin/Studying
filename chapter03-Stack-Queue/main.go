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

// type Queue struct {
// 	queue *list.List
// }

// func New() *Queue {
// 	return &Queue{
// 		queue: list.New(),
// 	}
// }

// func (q *Queue) Enqueue(v int) {
// 	q.queue.PushFront(v)
// }

// func (q *Queue) Dequeue() int {
// 	if q.queue.Len() == 0 {
// 		return -1
// 	}
// 	element := q.queue.Back()
// 	q.queue.Remove(element)
// 	return element.Value.(int)
// }

// func (q *Queue) Print() {
// 	fmt.Print("[")
// 	for e := q.queue.Front(); e != nil; e = e.Next() {
// 		if e.Next() != nil {
// 			fmt.Print(e.Value, ", ")
// 		} else {
// 			fmt.Print(e.Value)
// 		}
// 	}
// 	fmt.Println("]")
// }
// func main() {
// 	q := New()
// 	q.Enqueue(27)
// 	q.Enqueue(5)
// 	q.Enqueue(1)
// 	q.Enqueue(18)
// 	q.Print()

// 	fmt.Println(q.Dequeue())
// 	fmt.Println(q.Dequeue())
// 	fmt.Println(q.Dequeue())
// 	fmt.Println(q.Dequeue())
// 	q.Print()
// }

// import "fmt"

// // func Push(v int) {
// // 	sp = sp + 1
// // 	stack[sp] = v
// // }

// // func Pop() int {
// // 	if sp == 1 {
// // 		return -1
// // 	}

// //		v := stack[sp]
// //		sp = sp - 1
// //		return v
// //	}
// //
// //	func main() {
// //		defer fmt.Println("Stack and Queue")
// //		fmt.Print("begin")
// //	}
// type Stack struct {
// 	stack        []int
// 	stackPointer int
// }

// func (s *Stack) Push(v int) {
// 	s.stackPointer++
// 	s.stack = append(s.stack, v)
// }

// func (s *Stack) Pop() int {
// 	if s.stackPointer == 0 {
// 		return -1
// 	}
// 	s.stackPointer--
// 	element := s.stack[s.stackPointer]
// 	s.stack = s.stack[:s.stackPointer]

// 	return element
// }

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
