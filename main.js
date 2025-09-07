

const svgPath = document.querySelector('path');
const pathLength = svgPath.getTotalLength();


function fff(t) {
    // t = 1 - t
    const lengthAtT = t * pathLength;
    const point = svgPath.getPointAtLength(lengthAtT);
    return [-point.x / 300, point.y / 300];

    // return [2 * t, sin(t * 360)]

    // return [t * 4, (t > 0.5 ? 1 : -1)]
    // return [t * 3, 0]
}


function getEndPoint(centerPt, angle, stickLen) {
    const rotatedX = stickLen * sin(angle);
    const rotatedY = stickLen * cos(angle);

    const finalX = rotatedX + centerPt.x;
    const finalY = rotatedY + centerPt.y;

    return new Point(finalX, finalY)
}

class FourierDrawing {
    constructor(n, del, copyCanvas) {
        this.n = n
        this.del = del
        this.speeds = []
        this.arr = [new Point(300, 300)]
        this.lens = []
        this.rotates = []
        this.dict = {}
        this.copyCanvas = copyCanvas
        this.prevpnt = null
    }

    setup() {
        for (let i = 1; i <= this.n; i++) {
            this.#insertForI(i)
            this.#insertForI(-i)
        }
    }

    #recalculateNewPositionsForPoints() {
        for (let i = 1; i < this.arr.length; i++) {
            this.rotates[i - 1] += this.speeds[i - 1] / 3
            if (this.rotates[i - 1] > 360) this.rotates[i - 1] -= 360
            this.arr[i] = getEndPoint(this.arr[i - 1], this.rotates[i - 1], 100 * this.lens[i - 1])
        }
    }

    #drawRotatingVectors() {
        for (let i = 1; i < this.arr.length; i++) {
            stroke(0);
            strokeWeight(2)
            line(this.arr[i - 1].x, this.arr[i - 1].y, this.arr[i].x, this.arr[i].y)
            this.arr[i - 1].printMe(100 * this.lens[i - 1])
        }
    }

    drawFrame() {
        background(255)
        this.#recalculateNewPositionsForPoints()

        let curpnt = this.arr[this.arr.length - 1]
        if (this.prevpnt) {
            this.copyCanvas.strokeWeight(1)
            this.copyCanvas.stroke(255, 0, 0)
            // this.copyCanvas.line(this.prevpnt.x, this.prevpnt.y, curpnt.x, curpnt.y)
        }
        curpnt.print(this.copyCanvas) // print the endpoint(draws the trail) of the last vector
        this.prevpnt = curpnt
        image(this.copyCanvas, 0, 0)

        this.#drawRotatingVectors()
    }

    #getAnBn(n) {
        return this.#integrate(0, 1, n)
    }

    #insertForI(i) {
        if (i == 0) return
        this.arr.push(new Point(1, 1))
        this.speeds.push(i)
        let [An, Bn] = this.#getAnBn(i)
        this.lens.push(2 * Math.sqrt(An * An + Bn * Bn))
        let theta = atan(Bn / An)
        if (An >= 0)
            this.rotates.push(theta - 90)
        else if (An < 0)
            this.rotates.push(theta + 90)

    }


    #integrate(l, u, n) {
        let realpart = 0, imagpart = 0;
        for (let t = l; t <= u; t += this.del) {
            let cos2pint = Math.cos(2 * Math.PI * n * t)
            let sin2pint = Math.sin(2 * Math.PI * n * t)
            let [x, y] = [1, 2]
            if (this.dict[t]) [x, y] = this.dict[t]
            else this.dict[t] = [x, y] = fff(t)
            realpart += this.del * (x * cos2pint + y * sin2pint)
            imagpart += this.del * (y * cos2pint - x * sin2pint)
        }

        return [realpart, imagpart]
    }
}


let fdraw, copyCanvas

function setup() {
    createCanvas(600, 600);
    copyCanvas = createGraphics(600, 600);
    angleMode(DEGREES)
    fdraw = new FourierDrawing(200, 0.001, copyCanvas)
    fdraw.setup()
}


function draw() {
    fdraw.drawFrame()
}
