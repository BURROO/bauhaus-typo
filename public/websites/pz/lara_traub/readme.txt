Feedback und Tips


- clean button vielleicht so wie das ding oben nur das man in die ecke drängen kann und clicken 
und vielleicht bewegung auf der ganzen seite für beide clean button und "header popup"

- header mit schift hover?

- popup fenster
<a href="popup.html" target="popup" class="" onclick="window.open('popup.html','newwindow','width=462,height=328,top=50,left=600'); return false;">popup.</a>

OUTER GLOW
https://unused-css.com/blog/css-outer-glow/


script für click und dann div disappears 

const div= document.getElementById("text")

div.addEventListener ("click", function () {
div.style.display="none";
});


Test test



local storage 

<script>
  const form = document.getElementById('outer-circle');
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


<form id="outer-circle">
  <label for="lname">complaint:</label><br>
  <input type="textarea" id="textinput" name="lname" value=""><br><br>
  <input type="submit" value="Submit">
</form> 

<div id="output"></div>



einfachere clean function




<div id="checkbox-container" >
    <label id="clean-button" class="star-label line title clickable" onClick="window.location.reload();">
        <input type="checkbox" class="star">
            <span>clean</span>
            </label>


falls du willst 
no css button 
  <input type="radio" id="nocss" name="nocss" value="nocss" onclick="
  document.querySelectorAll('link[rel=stylesheet], style').forEach(el => el.disabled = true);
  document.querySelectorAll('*').forEach(el => el.removeAttribute('style'));
">
  <label for="nocss">keine Styles</label>