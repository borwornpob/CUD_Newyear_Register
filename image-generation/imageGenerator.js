const Canvas = require("canvas");

const generateImage = () => {
  // Create a new canvas with a given width and height
  const canvas = Canvas.createCanvas(200, 200);
  const ctx = canvas.getContext("2d");

  // Set the background color of the canvas to white
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set the fill style for the text to be drawn
  ctx.fillStyle = "#000000";
  ctx.font = "48px sans-serif";

  // Draw the text 'Hello, World!' on the canvas
  ctx.fillText("Hello, World!", 50, 100);
  image = canvas.toBuffer();
  // Export the canvas to a PNG image
  return image;
};
