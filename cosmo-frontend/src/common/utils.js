export function loadImage(img) {
    let image = ""
    try {
        image = require("@/assets/flags/w40/" + img.toLowerCase() + ".png");
        return image
    } catch (e) {
        image = require("@/assets/flags/w40/notfound.png");
        console.log(img);
        return image
    }
}