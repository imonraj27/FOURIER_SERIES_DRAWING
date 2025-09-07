

// Get the SVG path element and its total length
const svgPath = document.querySelector('path');
const pathLength = svgPath.getTotalLength();

/**
 * Converts a parameter t (0-1) to a point on the SVG path
 * @param {number} t - Parameter between 0 and 1 representing position along the path
 * @returns {number[]} [x, y] coordinates of the point on the path
 */
function getPathPoint(t) {
    // t = 1 - t  // Uncomment to reverse direction
    const lengthAtT = t * pathLength;  // Convert t to actual length
    const point = svgPath.getPointAtLength(lengthAtT);
    
    // Return normalized coordinates (centered and scaled)
    return [-point.x / 300, point.y / 300];
    
    // Alternative path definitions (commented out for reference):
    // return [2 * t, sin(t * 360)]
    // return [t * 4, (t > 0.5 ? 1 : -1)]
    // return [t * 3, 0]
}


/**
 * Calculates the endpoint of a line segment given center point, angle, and length
 * @param {Object} centerPt - The starting point of the line {x, y}
 * @param {number} angle - Angle in degrees
 * @param {number} stickLen - Length of the line segment
 * @returns {Point} A new Point at the calculated endpoint
 */
function getEndPoint(centerPt, angle, stickLen) {
    // Calculate x and y components using trigonometry
    const rotatedX = stickLen * sin(angle);
    const rotatedY = stickLen * cos(angle);

    // Add components to center point
    const finalX = rotatedX + centerPt.x;
    const finalY = rotatedY + centerPt.y;

    return new Point(finalX, finalY);
}

/**
 * Class that handles the Fourier series drawing logic
 */
class FourierDrawing {
    /**
     * @param {number} n - Number of harmonics to use in the Fourier series
     * @param {number} del - Time step for the animation
     * @param {Object} copyCanvas - p5.js graphics buffer for drawing
     */
    constructor(n, del, copyCanvas) {
        this.n = n;                     // Number of harmonics
        this.del = del;                 // Time step for animation
        this.speeds = [];               // Rotation speeds for each harmonic
        this.arr = [new Point(300, 300)]; // Points representing the drawing
        this.lens = [];                 // Amplitudes of each harmonic
        this.rotates = [];              // Current rotation angles
        this.dict = {};                 // Cache for calculated points
        this.copyCanvas = copyCanvas;    // Canvas for drawing the trail
        this.prevpnt = null;             // Previous point (for drawing lines)
    }

    /**
     * Set up the Fourier series by calculating harmonics
     */
    setup() {
        // Calculate both positive and negative harmonics
        for (let i = 1; i <= this.n; i++) {
            this.#insertForI(i);    // Positive harmonic
            this.#insertForI(-i);   // Negative harmonic
        }
    }

    /**
     * Update the positions of all points in the drawing
     * @private
     */
    #recalculateNewPositionsForPoints() {
        // Update each point's position based on rotation
        for (let i = 1; i < this.arr.length; i++) {
            // Update rotation angle (divided by 3 to slow down)
            this.rotates[i - 1] += this.speeds[i - 1] / 3;
            
            // Keep angle within 0-360 degrees
            if (this.rotates[i - 1] > 360) this.rotates[i - 1] -= 360;
            
            // Calculate new position based on previous point, angle, and amplitude
            this.arr[i] = getEndPoint(
                this.arr[i - 1], 
                this.rotates[i - 1], 
                100 * this.lens[i - 1]  // Scale amplitude for visibility
            );
        }
    }

    /**
     * Draw the rotating vectors that make up the Fourier series
     * @private
     */
    #drawRotatingVectors() {
        // Draw each vector in the series
        for (let i = 1; i < this.arr.length; i++) {
            // Set line style for the vector
            stroke(0);
            strokeWeight(2);
            
            // Draw line from previous point to current point
            line(
                this.arr[i - 1].x, 
                this.arr[i - 1].y, 
                this.arr[i].x, 
                this.arr[i].y
            );
            
            // Draw the circle at the base of the vector
            this.arr[i - 1].printMe(100 * this.lens[i - 1]);
        }
    }

    /**
     * Draw a single frame of the animation
     */
    drawFrame() {
        // Clear the canvas
        background(255);
        
        // Update point positions based on current angles
        this.#recalculateNewPositionsForPoints();

        // Get the current end point (tip of the last vector)
        let currentPoint = this.arr[this.arr.length - 1];
        
        // Draw the trail (temporarily disabled)
        if (this.prevpnt) {
            this.copyCanvas.strokeWeight(1);
            this.copyCanvas.stroke(255, 0, 0);
            // Uncomment to draw a line from last point to current point
            // this.copyCanvas.line(
            //     this.prevpnt.x, 
            //     this.prevpnt.y, 
            //     currentPoint.x, 
            //     currentPoint.y
            // );
        }
        
        // Draw the current point on the copy canvas
        currentPoint.print(this.copyCanvas);
        this.prevpnt = currentPoint;
        
        // Display the copy canvas (contains the trail)
        image(this.copyCanvas, 0, 0);

        // Draw all the rotating vectors
        this.#drawRotatingVectors();
    }

    /**
     * Calculate the Fourier coefficients An and Bn for harmonic n
     * @private
     */
    #getAnBn(n) {
        return this.#integrate(0, 1, n);
    }

    /**
     * Insert a new harmonic into the Fourier series
     * @param {number} i - The harmonic number (can be positive or negative)
     * @private
     */
    #insertForI(i) {
        if (i === 0) return;  // Skip 0th harmonic
        
        // Add a new point to the array (initial position will be updated)
        this.arr.push(new Point(1, 1));
        
        // Store the rotation speed (proportional to harmonic number)
        this.speeds.push(i);
        
        // Get Fourier coefficients for this harmonic
        let [An, Bn] = this.#getAnBn(i);
        
        // Calculate amplitude (magnitude) of this harmonic
        this.lens.push(2 * Math.sqrt(An * An + Bn * Bn));
        
        // Calculate phase angle (with quadrant correction)
        let theta = atan(Bn / An);
        if (An >= 0) {
            this.rotates.push(theta - 90);  // Adjust phase for proper orientation
        } else if (An < 0) {
            this.rotates.push(theta + 90);  // Adjust phase for negative x-axis
        }
    }


    /**
     * Numerically integrate over the path to calculate Fourier coefficients
     * @param {number} l - Lower bound of integration
     * @param {number} u - Upper bound of integration
     * @param {number} n - Harmonic number
     * @returns {number[]} [realPart, imagPart] of the integral
     * @private
     */
    #integrate(l, u, n) {
        let realpart = 0, imagpart = 0;
        
        // Sample points along the path and accumulate the integral
        for (let t = l; t <= u; t += this.del) {
            // Precompute trigonometric terms
            const angle = 2 * Math.PI * n * t;
            const cos2pint = Math.cos(angle);
            const sin2pint = Math.sin(angle);
            
            // Get point from cache or calculate it
            let [x, y] = this.dict[t] || (this.dict[t] = getPathPoint(t));
            
            // Accumulate the integral terms
            realpart += this.del * (x * cos2pint + y * sin2pint);
            imagpart += this.del * (y * cos2pint - x * sin2pint);
        }

        return [realpart, imagpart];
    }
}


// Global variables
let fdraw;          // Main Fourier drawing object
let copyCanvas;     // Offscreen buffer for drawing the trail

/**
 * p5.js setup function - runs once at startup
 */
function setup() {
    // Create main canvas and drawing buffer
    createCanvas(600, 600);
    copyCanvas = createGraphics(600, 600);
    
    // Set angle mode to degrees for easier understanding
    angleMode(DEGREES);
    
    // Initialize the Fourier drawing system
    fdraw = new FourierDrawing(200, 0.001, copyCanvas);
    fdraw.setup();
}

/**
 * p5.js draw function - runs every frame
 */
function draw() {
    // Draw the current frame of the animation
    fdraw.drawFrame();
}
