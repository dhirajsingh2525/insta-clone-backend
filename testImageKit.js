require("dotenv").config(); // .env keys load karne ke liye
const fs = require("fs");
const path = require("path");
const ImageKit = require("imagekit");


// ImageKit setup
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Absolute path se image read karo
const buffer = fs.readFileSync("https://imgs.search.brave.com/t5TBJN2lOhXEJWPW6jK-pLl90vrUqAvaJSNoCwgfIjI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzQ1LzIvbWFya2Vy/LWxvZ28tcG5nX3Nl/ZWtsb2dvLTQ1ODc2/NC5wbmc");

// Upload
imagekit.upload(
  {
    file: `data:image/png;base64,${buffer.toString("base64")}`,
    fileName: "test.png"
  },
  (err, result) => {
    if (err) console.log("Error:", err);
    else console.log("Upload Success:", result.url);
  }
);

