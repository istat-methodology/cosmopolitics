export function loadImage(img) {
  let image = "";
  try {
    image = require("@/assets/flags/w40/" + img.toLowerCase() + ".png");
  } catch (e) {
    image = require("@/assets/flags/w40/notfound.png");
  }
  return image;
}
