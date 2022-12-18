const express = require("express");
const Canvas = require("canvas");
const fs = require("fs");
const qrcode = require("qrcode");

const app = express();

const router = express.Router();

// Load the custom font from Google Fonts
Canvas.registerFont("./assets/Chakra_Petch/ChakraPetch-Medium.ttf", {
  family: "Chakra Petch",
});

const generateImage = async (text, email, status, logLink) => {
  // Generate a QR code from the text
  const qrCode = await qrcode.toDataURL(logLink);

  // Read the local image into a buffer
  const imageData = await fs.promises.readFile("./assets/cutopia_final.png");

  // Create a new image from the buffer and get its dimensions
  const image = new Canvas.Image();
  image.src = imageData;
  const { width, height } = image;

  // Create a new canvas with the same dimensions as the local image
  const canvas = Canvas.createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Draw the local image on the canvas
  ctx.drawImage(image, 0, 0, width, height);

  // Create a new image from the QR code
  const qrCodeImage = new Canvas.Image();
  qrCodeImage.src = qrCode;

  // Calculate the position of the QR code so it is centered on the canvas
  const qrCodeX = (width - qrCodeImage.width) / 2;
  const qrCodeY = (height - qrCodeImage.height) / 2;

  // Draw the QR code on the canvas
  //This value is fixed don't change if you don't konw what you're doing
  ctx.drawImage(qrCodeImage, 290, 295, 435.5, 416);

  // Set the fill style for the text to be drawn
  ctx.fillStyle = "#000000";
  ctx.font = "48px 'Chakra Petch', sans-serif"; // Use the custom font

  // Measure the width of the text to determine where to position it
  const textWidth = ctx.measureText(text).width;
  const emailWidth = ctx.measureText(email).width;

  // Draw the text on the canvas, centered horizontally
  ctx.fillText(text, (width - textWidth) / 2, 785);
  ctx.fillText(email, (width - emailWidth) / 2, 870);
  ctx.font = "36px 'Chakra Petch', sans-serif";
  const statusWidth = ctx.measureText(status).width;
  ctx.fillText(status, (width - statusWidth) / 2, 955);

  // Export the canvas to a PNG image
  return canvas.toBuffer();
};

router.get("/", async (req, res) => {
  // Get the text to be drawn from the query string
  const text = req.query.text || "John Doe";
  const email = req.query.email || "placeholder@email.com";
  const status = req.query.status || "Status";
  const logLink = req.query.logLink || "https://google.co.th";

  try {
    // Generate the image
    const image = await generateImage(text, email, status, logLink);

    // Set the content type of the response to 'image/png'
    res.set("Content-Type", "image/png");

    // Send the image back to the client
    res.send(image);
  } catch (err) {
    // If there is an error generating the image, send an error response
    res.status(500).send({ error: err.message });
  }
});

app.use("/.netlify/functions/image", router);

module.exports.handler = serverless(app);
