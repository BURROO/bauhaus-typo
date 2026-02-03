

const button = document.getElementById('button');
const stringsArray = ['The artwork for this album was made by \n Jean Metcalf',
    '"My hope as an artist is for the viewer to \n enjoy what they see...',
     ' ...The animal kingdom is where my inspiration \n and soul resides;...',
      ' ...in each animal alive there is a potential portrait, \n story, reason to be observed and remembered. \n - Jean Metcalf"'];
let index = 0;

button.addEventListener('click', (event) => {
  if (index > 3) {
    index = 0;
  }
  event.target.textContent = stringsArray[index];
  index++
})


