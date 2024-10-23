package queue

import (
	"container/list"
	"fmt"
)

type Queue struct {
	queue *list.List
}

func NewQ() *Queue {
	return &Queue{
		queue: list.New(),
	}
}

func (q *Queue) Enqueue(v int) {
	q.queue.PushFront(v)
}

func (q *Queue) Dequeue() int {
	if q.queue.Len() == 0 {
		return -1
	}
	element := q.queue.Back()
	q.queue.Remove(element)
	return element.Value.(int)
}

func (q *Queue) Print() {
	fmt.Print("[")
	for e := q.queue.Front(); e != nil; e = e.Next() {
		if e.Next() != nil {
			fmt.Print(e.Value, ", ")
		} else {
			fmt.Print(e.Value)
		}
	}
	fmt.Println("]")
}

// func Push(v int) {
// 	sp = sp + 1
// 	stack[sp] = v
// }

// func Pop() int {
// 	if sp == 1 {
// 		return -1
// 	}

//		v := stack[sp]
//		sp = sp - 1
//		return v
//	}
//
//	func main() {
//		defer fmt.Println("Stack and Queue")
//		fmt.Print("begin")
//	}
type Stack struct {
	stack        []int
	stackPointer int
}

func (s *Stack) Push(v int) {
	s.stackPointer++
	s.stack = append(s.stack, v)
}

func (s *Stack) Pop() int {
	if s.stackPointer == 0 {
		return -1
	}
	s.stackPointer--
	element := s.stack[s.stackPointer]
	s.stack = s.stack[:s.stackPointer]

	return element
}
