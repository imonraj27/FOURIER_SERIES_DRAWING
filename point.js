class Point {
    constructor(x, y, rad = 2) {
        this.x = x
        this.y = y
        this.diameter = 2 * rad
    }

    printMe(lenofsupportrad) {
        noStroke()
        fill(0, 100, 0)
        ellipse(this.x, this.y, this.diameter, this.diameter)
        stroke(0, 50)
        noFill()
        ellipse(this.x, this.y, 2 * lenofsupportrad, 2 * lenofsupportrad)
    }

    print(copy) {
        copy.noStroke()
        copy.fill(255, 0, 0)
        copy.ellipse(this.x, this.y, this.diameter, this.diameter)
    }
}