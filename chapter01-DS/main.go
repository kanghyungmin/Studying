package main

import "fmt"

type Point struct {
	X int
	Y int
}

var (
	p1 = Point{27, 5}
	p2 = Point{X: 18}
	p3 = Point{}
)

func main() {
	p := Point{27, 5}
	p.X = 18
	// pp := &p

	i := 5
	pi := &i
	inc(pi)
	fmt.Println(i)
}
func inc(p *int) {
	*p++
}
