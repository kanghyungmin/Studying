package main

import "fmt"

func main() {
	m := make(map[string]int)

	m["banana"] = 2
	m["apple1"] = 8
	fruit := m["orange1"]
	fmt.Println(m, fruit)

	fruit, ok := m["orange11"]
	fmt.Println(fruit, ok)

	for key, element := range m {
		fmt.Println(key, element)
	}
}
