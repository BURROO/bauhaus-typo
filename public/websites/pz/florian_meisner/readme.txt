Hallo :)



Typing effect 
HTML
<div id="table">
  <div id="centeralign">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ante arcu, dignissim non risus id, posuere efficitur felis. Vestibulum arcu diam, semper non ipsum quis, dictum ultricies diam. Suspendisse vel luctus sapien. Mauris tristique condimentum velit tincidunt pharetra. Curabitur ut lectus eleifend, malesuada lorem eget, consectetur augue. Nunc scelerisque nisi in lacus eleifend eleifend. Praesent blandit ex at nunc maximus, ut sodales ante auctor. Nunc elementum eros sit amet malesuada facilisis. Morbi eget elit consequat, sodales urna in, lobortis nisi. Morbi dapibus velit eu mattis bibendum. Nulla et nisi eget turpis vulputate suscipit eu nec nunc. Pellentesque ut pulvinar quam.</p>
    
    <p>Text Zwei hallo ipsum dolor sit amet, consectetur adipiscing elit. Donec ante arcu, dignissim non risus id, posuere efficitur felis. Vestibulum arcu diam, semper non ipsum quis, dictum ultricies diam. Suspendisse vel luctus sapien. Mauris tristique condimentum velit tincidunt pharetra. Curabitur ut lectus eleifend, malesuada lorem eget, consectetur augue. Nunc scelerisque nisi in lacus eleifend eleifend. Praesent blandit ex at nunc maximus, ut sodales ante auctor. Nunc elementum eros sit amet malesuada facilisis. Morbi eget elit consequat, sodales urna in, lobortis nisi. Morbi dapibus velit eu mattis bibendum. Nulla et nisi eget turpis vulputate suscipit eu nec nunc. Pellentesque ut pulvinar quam.</p>
    
  </div>
</div>

CSS 
body, html {
  margin: 0;
  height: 100%;
  text-align: center;
  font-family: 'Oxygen Mono', monospace;
  color: #999;
}

h1 {
  text-transform: uppercase;
  letter-spacing: 1pt;
  font-size: 30pt;
  margin-bottom: 15px;
}

p {
  text-align: left;
  margin: 0;
  text-transform: lowercase;
  font-size: 10pt;
  font-weight: 900;
  width: 50%;
  display: none;
}

#table {
	display: table;
	width: 100%;
	height: 100%;
  background-color: #e5e5e5;
}

#centeralign {
	display: table-cell;
	vertical-align: middle;
}

JS
// function typing effect für ein element
function typeEffect(element, speed) {

  // store elemts text, also memory
  var text = element.innerHTML;

  // dann content löschen, temporär
  element.innerHTML = "";

  // index tracks welchen character wir typen
  var i = 0;

  // repeated timer läuft jede "speed" milliseconds
  var timer = setInterval(function () {

    // wenn noch characters übrig
    if (i < text.length) {

      // dann einen Character hinzufügen
      element.append(text.charAt(i));

      // dann zum nächsten
      i++;

    } else {

      // timer stoppen wenn alle getyped sind
      clearInterval(timer);
    }

  }, speed);
}


// ab hier anwendung


// speed typing (milliseconds per character)
var speed = 75;

// alle <p> elements selecten
var paragraphs = document.querySelectorAll("p");

// loop durch alle
paragraphs.forEach(function (p) {

  // paragraph  visible
  //     (wird gebraucht weil CSS display: none)
  p.style.display = "inline-block";

  // start typing effect sofort
  typeEffect(p, speed);

});


auf basis von diesem Codepen https://codepen.io/worksbyvan/pen/dRBGKK

