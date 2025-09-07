# Fourier Series Drawing Visualization

A creative visualization of how Fourier series can be used to approximate complex shapes using rotating vectors (epicycles). This project demonstrates the mathematical beauty of Fourier transforms through interactive animation.

![Fourier Series Visualization](https://via.placeholder.com/800x400?text=Fourier+Series+Drawing+Visualization)

## Features

- Visual representation of Fourier series approximation
- Interactive animation showing the construction of shapes using rotating vectors
- Clean, responsive design
- Built with p5.js for smooth animations

## How It Works

The project uses the mathematical concept of Fourier series to break down complex shapes into a series of rotating vectors. Each vector rotates at a different frequency, and when combined, they trace out the desired shape.

1. The SVG path is sampled to extract points
2. The Fourier transform calculates the necessary frequencies and amplitudes
3. The animation shows how these rotating vectors combine to recreate the original shape

## Getting Started

### Prerequisites

- A modern web browser
- A local web server (for running locally)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fourier-drawing.git
   cd fourier-drawing
   ```

2. Open [index.html](cci:7://file:///c:/Users/hp/Desktop/nodejs/FOURIER_SERIES_DRAWING/index.html:0:0-0:0) in your browser or use a local server:
   ```bash
   # Using Python's built-in server
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000` in your browser.

## Usage

1. The animation will start automatically when you open the page
2. Watch as the Fourier series approximation builds up over time
3. The visualization shows both the rotating vectors and the resulting shape

## Customization

You can modify the following parameters in [main.js](cci:7://file:///c:/Users/hp/Desktop/nodejs/FOURIER_SERIES_DRAWING/main.js:0:0-0:0):
- Number of vectors used in the approximation
- Animation speed
- Line thickness and colors

## Technologies Used

- [p5.js](https://p5js.org/) - JavaScript library for creative coding
- HTML5 Canvas - For rendering graphics
- Vanilla JavaScript - For core functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by the mathematical beauty of Fourier transforms
- Built with the amazing p5.js library
- Special thanks to the math and creative coding communities