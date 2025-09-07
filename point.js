/**
 * Represents a point in 2D space with drawing capabilities
 */
class Point {
    /**
     * Create a new Point
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} [radius=2] - Radius of the point
     */
    constructor(x, y, radius = 2) {
        this.x = x;                 // X coordinate
        this.y = y;                 // Y coordinate
        this.diameter = 2 * radius; // Diameter for drawing
    }

    /**
     * Draw the point with a surrounding circle
     * @param {number} supportRadius - Radius of the surrounding circle
     */
    printMe(supportRadius) {
        // Draw the main point (green)
        noStroke();
        fill(0, 100, 0); // Green color
        ellipse(this.x, this.y, this.diameter, this.diameter);
        
        // Draw the surrounding circle (semi-transparent black)
        stroke(0, 50);
        noFill();
        ellipse(this.x, this.y, 2 * supportRadius, 2 * supportRadius);
    }

    /**
     * Draw the point on a specified graphics buffer
     * @param {Object} graphics - p5.js graphics buffer to draw on
     */
    print(graphics) {
        graphics.noStroke();
        graphics.fill(255, 0, 0); // Red color
        graphics.ellipse(this.x, this.y, this.diameter, this.diameter);
    }
}