package main

import "fmt"

type Node struct {
	value  int
	left   *Node
	right  *Node
	parent *Node
}

type BinaryTree struct {
	root *Node
}

func (t *BinaryTree) Insert(node *Node, side string, value int) *Node {
	newNode := &Node{value, nil, nil, nil}

	if t.root == nil {
		t.root = newNode
		return t.root
	}

	if side == "left" {
		if node.left == nil {
			node.left = newNode
		} else {
			newNode.left = node.left
			node.left = newNode
		}
	} else {
		if node.right == nil {
			node.right = newNode
		} else {
			newNode.right = node.right
			node.right = newNode
		}
	}
	newNode.parent = node

	return newNode
}

func (n *Node) DeleteLeaf() {
	if n.parent.left == n {
		n.parent.left = nil
	} else {
		n.parent.right = nil
	}
}

func (n *Node) findLeftmost() *Node {
	node := n
	next := n

	for next != nil {
		node = next
		if next.left != nil {
			next = next.left
		} else {
			next = next.right
		}
	}
	return node
}

func (bt *BinaryTree) Delete(node *Node) {
	if node.left == nil && node.right == nil {
		if node == bt.root {
			bt.root = nil
		} else {
			node.DeleteLeaf()
		}
	} else {
		leftmostNode := node.findLeftmost()
		node.value = leftmostNode.value
		leftmostNode.DeleteLeaf()
	}
}

func (bt *BinaryTree) GetRoot() *Node {
	return bt.root
}

func main() {
	var bt BinaryTree
	node18 := bt.Insert(nil, "left", 18)
	node8 := bt.Insert(node18, "left", 8)
	node25 := bt.Insert(node18, "right", 25)
	node5 := bt.Insert(node8, "left", 5)

	bt.Insert(node8, "right", 9)
	bt.Insert(node25, "left", 21)
	bt.Insert(node25, "right", 27)

	bt.Delete(node25)
	bt.Delete(node5)
}

func Preorder(node *Node) {
	if node != nil {
		fmt.Println(node.value)
		Preorder(node.left)
		Preorder(node.right)

	}
}

func Inorder(node *Node) {
	if node != nil {
		Inorder(node.left)
		fmt.Println(node.value)
		Inorder(node.right)
	}
}

func Postorder(node *Node) {
	if node != nil {
		Postorder(node.left)
		Postorder(node.right)
		fmt.Println(node.value)
	}
}
