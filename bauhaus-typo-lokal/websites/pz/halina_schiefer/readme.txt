https://www.w3schools.com/tags/tryit.asp?filename=tryhtml_textarea


Nachschauen flipbox variable breiten front und back 

<script>
  const form = document.getElementById('form');
  const textarea = document.getElementById('textinput');
  const output = document.getElementById('output');

  // Load saved content on page load
  const savedText = JSON.parse(localStorage.getItem('savedText')) || [];
  savedText.forEach(text => addText(text));

  form.addEventListener('submit', e => {
    e.preventDefault();

    const value = textarea.value.trim();
    if (!value) return;

    addText(value);

    // Save to localStorage
    savedText.push(value);
    localStorage.setItem('savedText', JSON.stringify(savedText));

    textarea.value = '';
  });

  function addText(text) {
    const p = document.createElement('p');
    p.textContent = text; // text-only (safe)
    output.appendChild(p);
  }
</script>



Feedback Hjördis


–text startseite geht über zettel
–tit–le ändern
–vllt zurück buttons?
px in repsonsives sizes (rem, vh, vw, %) aber am bildschirm vorher schauen wa sich verändert

HOVERBEREICH BRIEF

bei flipbox class:
overflow: visible; (sonst wird der rest abgescnnitten)

die flipback class width größer machen

dann das das Bildgröße kontrolliert ist:
.flip-back1 img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

dann den hover in den voordergrund holen

.flip-box:hover {
  z-index: 9999;
}

RAHMEN ÜBER iframe

leider haben wir in der Ausstellung kein Internet weshalb du den iframe 
leider nicht laden kannst. Du kannst aber für die Ausstellung ein Textfeld machen

<div id="letter" contenteditable="true">
  Schreib hier deinen Brief…
</div>

TEXT AM ANFANG AUF DEM BRIEF UND NICHT DRÜBER

gib der letter class overflow: hidden;

geb der typeanimation noch right und bottom größen und 
stelle es auch auf overflow: hidden;

dann:
white-space: nowrap;

ändern in:
white-space: normal;
word-wrap: break-word;



warum flip-box 1 not shown???











AUDIO IMPLEMENTATION

1. Audio-Player unsichtbar machen (HTML)
Dein <audio>-Tag ist richtig, aber das Attribut controls macht ihn sichtbar.
 Wir lassen den Audio-Player im DOM, aber verstecken ihn komplett.
<audio preload="auto" id="Door">
    <source src="Audio/Door.mp3" type="audio/mpeg">
    <source src="Audio/Door.ogg" type="audio/ogg">
</audio>

-> Warum
controls ist nur für Benutzersteuerung
Wir steuern den Sound per JavaScript
Ohne controls ist der Player unsichtbar, aber funktionsfähig

DANN: 
2. JavaScript: Sound beim Hover abspielen

CSS kann keinen Sound abspielen → wir brauchen JavaScript.
Wir hören auf:
mouseenter → Sound abspielen
mouseleave → Sound stoppen & zurücksetzen

<script>
const wrapper = document.querySelector('.image-wrapper');
const doorSound = document.getElementById('Door');

wrapper.addEventListener('mouseenter', () => {
    doorSound.currentTime = 0; // immer von vorne starten
    doorSound.play();
});

wrapper.addEventListener('mouseleave', () => {
    doorSound.pause();
    doorSound.currentTime = 0;
});
</script>

RECAP 
-> mouseenter Wird einmal ausgelöst (nicht ständig wie mouseover), Verhindert Sound-Spam
-> currentTime = 0 Sound startet jedes Mal von vorne, Wichtig, wenn man schnell rein/raus hovert
-> play() Spielt Audio ab, Erlaubt, weil vorher ein User-Klick existiert
-> pause() + Reset Sound hört sofort auf, wenn man den Hover verlässt



p weg
blink nicht mehr


Leider ist der Sound nur manchmal zu hören und die Maus flirrt immer ein bisschen zwischen herz und zeiger


1920px für bilder


Konsultation

-Problem bei den Umschlägen, wie lassen sich die beiden bilder unterschiedlich groß 
darstellen ohne dasss die flipbox riesig wird
-Cursor flackert
-wie iframe verändern
-rahmen über iframe funktioniert nicht
-texte und gedichte - in anderer form präsentieren?
-wir rahmen über divs legen, dass sie immer noch steuerbar sind
-button on click --> gesamter text erscheint






      <button class="line" id="Line1">meine liebste</button>
        <button class="line" id="Line2">dies ist mein abschiedsbrief an dich</button>
        <button class="line " id="Line3">auch wenn ich ihn vermutlich niemals abschicken werde</button>
        <button class="line" id="Line4">es tut weh das zu schreiben</button>
        <button class="line img" id="Line5"><img src="Img/naja.png" alt="" height="100%"></button>
        <button class="line" id="Line6">du bist ein wirbelsturm in meinem kopf</button>
        <button class="line" id="Line7">aber vor der realität zu fliehen tut noch mehr weh
        zumindest mir</button>
        <button class="Line6" popover id="Line6" popovertarget="Line7" popovertargetaction="show">ich weiß doch genau, dass ich in zwei monaten keine berechtigung habe
        deine trauzeugin zu sein oder taufpatin für euer erstes kind</button>
        <button class="Line7 line">auch diese erkenntnis tut mir weh</button>
        <button class="Line8" popover id="Line8" popovertarget="Line9"  popovertargetaction="show">ich hab dich so geliebt</button>
        <button class="Line9" popover id="Line9" popovertarget="Line10" popovertargetaction="show">ich liebe dich immer noch</button>
        <button class="Line10" popover id="Line10" popovertarget="Line11" popovertargetaction="show">mit dir konnte ich träumen</button>
        <button class="Line11" popover id="Line11" popovertarget="Line12" popovertargetaction="show">wir hatten so viel spaß miteinander und ich konnte einfach ich sein</button>
        <button class="Line12" popover id="Line12" popovertarget="Line13" popovertargetaction="show">mit dir</button>
        <button class="Line13" popover id="Line13" popovertarget="Line14" popovertargetaction="show">aber jetzt hast du mich allein gelassen</button>
        <button class="Line14" popover id="Line14" popovertarget="Line15" popovertargetaction="show">in dieser welt, die sich einfach dreht und dreht und dreht</button>
        <button class="Line15" popover id="Line15" popovertarget="Line16" popovertargetaction="show">was soll ich nur tun</button>
        <button class="Line16" popover id="Line16" popovertarget="Line17" popovertargetaction="show">schließlich kann ich sie nicht aufhalten</button>
        <button class="Line17" popover id="Line17" popovertarget="Line18" popovertargetaction="show">aber veränderung ist schwer</button>
        <button class="Line18" popover id="Line18" popovertarget="Line19" popovertargetaction="show">die erde hat ihre drehrichutng geändert</button>
        <button class="Line19" popover id="Line19" popovertarget="Line20" popovertargetaction="show">die blauen krallen der nacht</button>
        <button class="Line20" popover id="Line20" popovertarget="Line21" popovertargetaction="show">haben sich an mir festgebissen</button>
        <button class="Line21" popover id="Line21" popovertarget="Line22" popovertargetaction="show">was soll ich mit zuckerwatte, wenn niemand sie mit mir isst</button>
        <button class="Line22" popover id="Line22" popovertarget="Line23" popovertargetaction="show">sie verdeckt nur die sonne</button>
        <button class="Line23" popover id="Line23" popovertarget="Line24" popovertargetaction="show">dann scheint sie nicht mehr</button>
        <button class="Line24" popover id="Line24" popovertarget="Line25" popovertargetaction="show">tut sie ja sowieso nicht</button>
        <button class="Line25" popover id="Line25" popovertarget="Line26" popovertargetaction="show">diese seltsame verschiebung hat schon seit langer zeit</button>
        <button class="Line26" popover id="Line26" popovertarget="Line27" popovertargetaction="show">begonnen</button>
        <button class="Line27" popover id="Line27" popovertarget="Line28" popovertargetaction="show">irgendwann ist einfach alles dunkel geworden</button>
        <button class="Line28" popover id="Line28" popovertarget="Line29" popovertargetaction="show">vermutlich haben wir uns beide einfach zu sehr auseinander entwickelt</button>
        <button class="Line29" popover id="Line29" popovertarget="Line30" popovertargetaction="show">ist ja gar nicht deine schuld</button>
        <button class="Line30" popover id="Line30" popovertarget="Line31" popovertargetaction="show">bitte können wir den kontakt beenden</button>
        <button class="Line31" popover id="Line31" popovertarget="Line32" popovertargetaction="show">warum erzählst du mir nichts mehr</button>
        <button class="Line32" popover id="Line32" popovertarget="Line33" popovertargetaction="show">ich dachte wir hätten keine geheimnisse</button>
        <button class="Line33" popover id="Line33" popovertarget="Line34" popovertargetaction="show">ich dachte du lässt mich nicht im stich</button>
        <button class="Line34" popover id="Line34" popovertarget="Line35" popovertargetaction="show">aber jetzt ist es geschehen</button>
        <button class="Line35" popover id="Line35" popovertarget="Line36" popovertargetaction="show">ich kann dir wohl kaum einen vorwurf machen</button>
        <button class="Line36" popover id="Line36" popovertarget="Line37" popovertargetaction="show">seit ich dich nicht mehr habe, habe ich Flugangst</button>
        <button class="Line37" popover id="Line37" popovertarget="Line38" popovertargetaction="show">der gedanke an die dröhnende maschine macht mich wahnsinnig</button>
        <button class="Line38" popover id="Line38" popovertarget="Line39" popovertargetaction="show">ich kann den boden unter den füßen nicht verlieren</button>
        <button class="Line39" popover id="Line39" popovertarget="Line40" popovertargetaction="show">aber er rutscht weg</button>
        <button class="Line40" popover id="Line40" popovertarget="Line41" popovertargetaction="show">ich kann den boden unter den füßen nicht verlieren</button>
        <button class="Line41" popover id="Line41" popovertarget="Line42" popovertargetaction="show">dafür dreht sich die erde zu schnell</button>
        <button class="Line42" popover id="Line42" popovertarget="Line43" popovertargetaction="show">ich glaube wir sollten mal reden</button>
        <button class="Line43" popover id="Line43" popovertarget="Line44" popovertargetaction="show">mögen wir uns</button>
        <button class="Line44" popover id="Line44" popovertarget="Line45" popovertargetaction="show">oder verbringen wir einfach nur zeit miteinander</button>
        <button class="Line45" popover id="Line45" popovertarget="Line46" popovertargetaction="show">die tage sind so lang und gehen doch so schnell vorüber</button>
        <button class="Line46" popover id="Line46" popovertarget="Line47" popovertargetaction="show">ich habe solche angst dass du weg bist</button>
        <button class="Line47" popover id="Line47" popovertarget="Line48" popovertargetaction="show">weil jemand besseres kommt</button>
        <button class="Line48" popover id="Line48" popovertarget="Line49" popovertargetaction="show">so als ersatzteil lebt es sich nicht so lang</button>
        <button class="Line49" popover id="Line49" popovertarget="Line50" popovertargetaction="show">ersatzteile sind austauschbar</button>
        <button class="Line50" popover id="Line50" popovertarget="Line51" popovertargetaction="show">oft kann man sie billiger als das original ersteigern</button>
        <button class="Line51" popover id="Line51" popovertarget="Line52" popovertargetaction="show">ich gebe auch ungern mehr geld als nötig dafür aus</button>
        <button class="Line52" popover id="Line52" popovertarget="Line53" popovertargetaction="show">eigentlich kaufe ich gar keine ersatzteile</button>
        <button class="Line53" popover id="Line53" popovertarget="Line54" popovertargetaction="show">man baut sie ja doch nie ein</button>
        <button class="Line54" popover id="Line54" popovertarget="Line55" popovertargetaction="show">und dann verstauben sie in einer ecke</button>
        <button class="Line55" popover id="Line55" popovertarget="Line56" popovertargetaction="show">und staubwischen tue ich auch nie</button>
        <button class="Line56" popover id="Line56" popovertarget="Line57" popovertargetaction="show">ich vermisse dich, dabei habe ich gar keinen grund dazu</button>
        <button class="Line57" popover id="Line57" popovertarget="Line58" popovertargetaction="show">du wohnst ja nur um die ecke</button>
        <button class="Line58" popover id="Line58" popovertarget="Line59" popovertargetaction="show">ich kann schon fast in dein fenster schauen von meinem balkon aus</button>
        <button class="Line59" popover id="Line59" popovertarget="Line60" popovertargetaction="show">auf dem stehen immer noch die bruchstücke des sommers</button>
        <button class="Line60" popover id="Line60" popovertarget="Line61" popovertargetaction="show">in meinen lungen verbrennt der sauerstoff</button>
        <button class="Line61" popover id="Line61" popovertarget="Line62" popovertargetaction="show">dann habe ich angst zu ersticken</button>
        <button class="Line62" popover id="Line62" popovertarget="Line63" popovertargetaction="show">deswegen muss das fenster immer offen bleiben</button>
        <button class="Line63" popover id="Line63" popovertarget="Line64" popovertargetaction="show">du hättest mir ja mal antworten können</button>
        <button class="Line64" popover id="Line64" popovertarget="Line65" popovertargetaction="show">oft schlafe ich nicht ein</button>
        <button class="Line65" popover id="Line65" popovertarget="Line66" popovertargetaction="show">vielleicht füllt sich mein körper mit staub</button>
        <button class="Line66" popover id="Line66" popovertarget="Line67" popovertargetaction="show">trocken und schmutzig</button>
        <button class="Line67" popover id="Line67" popovertarget="Line68" popovertargetaction="show">dann kann ich ersticken</button>
        <button class="Line68" popover id="Line68" popovertarget="Line69" popovertargetaction="show">auch mit offenem fenster</button>
        <button class="Line69" popover id="Line69" popovertarget="Line70" popovertargetaction="show">warum hast du mir immer noch nicht geantwortet</button>
        <button class="Line70" popover id="Line70" popovertarget="Line71" popovertargetaction="show">wenn ich weiß du bist bei jemand anderem bin ich eifersüchtig</button>
        <button class="Line71" popover id="Line71" popovertarget="Line72" popovertargetaction="show">das will ich nicht</button>
        <button class="Line72" popover id="Line72" popovertarget="Line73" popovertargetaction="show">eigentlich will ich einfach nur nach hause</button>
        <button class="Line73" popover id="Line73" popovertarget="Line74" popovertargetaction="show">oder zu dir</button>
        <button class="Line74" popover id="Line74" popovertarget="Line75" popovertargetaction="show">besser wäre nach hause</button>
        <button class="Line75" popover id="Line75" popovertarget="Line76" popovertargetaction="show">aber ich muss bei dir bleiben</button>

</div>
