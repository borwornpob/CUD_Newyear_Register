const express = require("express");
const Canvas = require("canvas");
const fs = require("fs");

const app = express();

// Generate an image and return it as a Buffer
const generateImage = async (text) => {
  // Read the local image into a buffer
  const imageData = await fs.promises.readFile("./assets/cutopia.png");

  // Create a new image from the buffer and get its dimensions
  const image = new Canvas.Image();
  image.src = imageData;
  const { width, height } = image;

  // Create a new canvas with the same dimensions as the local image
  const canvas = Canvas.createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Draw the local image on the canvas
  ctx.drawImage(image, 0, 0, width, height);

  // Set the fill style for the text to be drawn
  ctx.fillStyle = "#000000";
  ctx.font = "48px sans-serif";

  // Measure the width of the text to determine where to position it
  const textWidth = ctx.measureText(text).width;

  // Draw the text on the canvas, centered horizontally
  ctx.fillText(text, (width - textWidth) / 2, 100);

  // Export the canvas to a PNG image
  return canvas.toBuffer();
};

app.get("/image", async (req, res) => {
  // Get the text to be drawn from the query string
  const text = req.query.text || "Hello, World!";

  try {
    // Generate the image
    const image = await generateImage(text);

    // Set the content type of the response to 'image/png'
    res.set("Content-Type", "image/png");

    // Send the image back to the client
    res.send(image);
  } catch (err) {
    // If there is an error generating the image, send an error response
    res.status(500).send({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Image generation API listening on port 3000");
});
