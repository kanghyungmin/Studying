package main

import "fmt"

type Node struct {
	next  *Node
	value int
}

type List struct {
	head *Node
	len  int
}

func New() List {
	return List{
		head: nil,
		len:  0,
	}
}

func (l *List) Insert(v int) {
	node := Node{
		next:  nil,
		value: v,
	}

	if l.head != nil {
		node.next = l.head
	}

	l.head = &node
	l.len++
}

func (l *List) InsertOrdered(v int) {
	node := Node{
		next:  nil,
		value: v,
	}

	if l.head == nil {
		l.head = &node
		l.len++
		return
	}
	temp := l.head

	for temp.next != nil && temp.next.value < v {
		temp = temp.next
	}

	node.next = temp.next
	temp.next = &node

	l.len++
}

func (l *List) Remove(v int) {
	if l.head == nil {
		return
	}

	if l.len == 1 {
		l.head = nil
		l.len--
		return
	}

	for temp := l.head; temp != nil; temp = temp.next {
		if temp.next.value == v {
			node := temp.next
			temp.next = node.next
			node.next = nil
			l.len--
			return
		}
	}
}

func (l *List) Find(v int) *Node {
	for temp := l.head; temp != nil; temp = temp.next {
		if temp.value == v {
			return temp
		}
	}
	return nil
}

func (l *List) Concatenate(l2 List) {
	temp := l.head
	for temp.next != nil {
		temp = temp.next
	}
	temp.next = l2.head
	l2.head = nil
}

func (l *List) Print() {
	fmt.Print("[")
	for temp := l.head; temp != nil; temp = temp.next {
		fmt.Print(temp.value)
		if temp.next != nil {
			fmt.Printf("%v , ", temp.value)
		} else {
			fmt.Print(temp.value)
		}
	}
	fmt.Println("]")
}

func (l *List) Len() int {
	return l.len
}

func (l *List) Head() *Node {
	return l.head
}
