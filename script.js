const GAP = 20;
const DOT_SIZE = 6;

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const stage = new createjs.Stage(canvas);
const container = new createjs.Container();
stage.addChild(container);

let containerWidth = 0;

// Resize canvas to fit the window dynamically
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stage.update();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Ticker for animation
createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener("tick", () => {
  container.x -= 3; // Move left
  if (container.x + containerWidth < 0) {
    container.x = canvas.width; // Reset position when it moves out of view
  }
  stage.update();
});

function fetchBitcoinPrice() {
  fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
    .then(response => response.json())
    .then(data => {
      const btcUsd = data.bpi.USD.rate_float.toFixed(2);
      const btcCad = (btcUsd * 1.25).toFixed(2); // Assuming approximate conversion
      updateDisplay(`BTC/USD: ${btcUsd}   BTC/CAD: ${btcCad}`);
    })
    .catch(error => console.error('Error fetching Bitcoin price:', error));
}

function updateDisplay(textContent) {
  // Draw the text to an off-screen canvas to avoid flickering
  const offScreenCanvas = document.createElement("canvas");
  const offScreenContext = offScreenCanvas.getContext("2d");
  offScreenCanvas.width = canvas.width;
  offScreenCanvas.height = canvas.height;

  const text = new createjs.Text(textContent, "18px 'Roboto', sans-serif", "#fff");
  text.letterSpacing = 8; // Increase spacing between letters
  const WIDTH = text.getMeasuredWidth() | 0;
  const HEIGHT = text.getMeasuredHeight() | 0;

  if (WIDTH === 0 || HEIGHT === 0) {
    return;
  }

  text.x = 0;
  text.y = 0; // Position the text
  text.draw(offScreenContext);

  const imgData = offScreenContext.getImageData(0, 0, WIDTH, HEIGHT).data;

  // Update dots without restarting animation
  container.removeAllChildren();

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const i = ((WIDTH * y) + x) * 4;
      const alpha = imgData[i + 3];
      if (alpha !== 0) {
        const shape = new createjs.Shape();
        shape.graphics.beginRadialGradientFill(
          ["#eb695b", "#ff0000", "#000"],
          [0, 0.5, 1],
          0, 0, 0,
          0, 0, DOT_SIZE * 2
        );
        shape.graphics.drawCircle(0, 0, DOT_SIZE); // Draw a dot

        shape.x = x * GAP;
        shape.y = y * GAP + 50;

        // Add more vibrant glowing effect
        shape.shadow = new createjs.Shadow("#ff4444", 0, 0, 30);

        container.addChild(shape);
      }
    }
  }

  containerWidth = WIDTH * GAP;
  container.x = canvas.width; // Start from the right side of the screen

  // Cache the container for performance
  container.cache(0, 0, containerWidth, canvas.height);
}

// Fetch the Bitcoin price immediately and then every 20 seconds
fetchBitcoinPrice();
setInterval(fetchBitcoinPrice, 20000);
