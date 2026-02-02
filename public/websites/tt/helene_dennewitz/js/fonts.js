// font families to randomly choose from
const fontFamilies = [
'Helvetica', 'sans-serif',

];

function randomFont() {
  return fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
}