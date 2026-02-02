--> code für timeframes disappear

<!DOCTYPE html>
<html>
<head>
<style> 
.disappear1 {
  animation: hideAfter 3s forwards;
}
.disappear2 {
  animation: hideAfter 4s forwards;
}
.disappear3 {
  animation: hideAfter 5s forwards;
}

@keyframes hideAfter {
  0% {
    opacity: 1;
    visibility: visible;
  }
  99% {
    opacity: 1;
    visibility: visible;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
}
</style>
</head>
<body>
<div class="disappear1">
header</div>

<div class="disappear2">
bild</div>


<div class="disappear3">
ranke</div>

</body>
</html>



Die show/hide funktion die ich für angela erklärt hatte: 

-----------------------------CODE_------------------------------------
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
.toggle-box {
  width: 100%;
  padding: 50px 0;
  text-align: center;
  margin-top: 20px;
  display: none;
}
.blue { background-color: lightblue; }
.green { background-color: green; }
</style>
</head>
<body>

<p>Click the buttons to toggle the DIV elements:</p>

<button onclick="toggleDiv('myDIV')">Toggle blue</button>
<button onclick="toggleDiv('myDIV2')">Toggle green</button>

<div id="myDIV" class="toggle-box blue">
  This is my DIV element.
</div>

<div id="myDIV2" class="toggle-box green">
  This is my DIV element.
</div>

<script>
function toggleDiv(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === "block" ? "none" : "block";
}
</script>

</body>
</html>

----------------------------EXPLANATION---------------------------------

To break down what this is doing: 
1. The HTML (how JS connects)
<button onclick="toggleDiv('myDIV')">Toggle blue</button>
<button onclick="toggleDiv('myDIV2')">Toggle green</button>
onclick="..." means:
 “When this button is clicked, run some JavaScript.”

toggleDiv('myDIV')
Calls a function named toggleDiv
Passes 'myDIV' as text (a string)
That text matches the id of a div

So:

First button controls <div id="myDIV">
Second button controls <div id="myDIV2">

2. The DIVs themselves
<div id="myDIV" class="toggle-box blue">
id="myDIV"
This is how JavaScript finds this element
IDs must be unique
class="toggle-box blue"
toggle-box → shared styling
blue → unique background color

3. The CSS (important for toggle behavior)
.toggle-box {display: none;}

display: none; means:
Element is invisible
Element takes up zero space
This is the starting state

→ Both divs are hidden when the page loads

4. The JavaScript function (core logic)
function toggleDiv(id) {

function → we are defining a reusable action

toggleDiv → function name

(id) → a parameter


Think of id as:

“A placeholder that will receive a value later”

Example:

toggleDiv('myDIV')

Inside the function:

id === 'myDIV'

5. Finding the div in the page
const el = document.getElementById(id);

document → the entire webpage

getElementById(id) → “Find the element whose id matches this text”


So if:

id = 'myDIV'

Then this line becomes:

document.getElementById('myDIV');

That line returns the actual <div> element.

We store it in a variable called el:

el now represents the div in JavaScript

6. The toggle logic (THE MOST IMPORTANT PART)
el.style.display = 

  el.style.display === "block" ? "none" : "block";

This looks scary at first — let’s rewrite it in plain English.

6.1 What el.style.display means
el → the div

.style → its inline styles

.display → the display property

ßßßßß

So:

el.style.display

Means:

“How is this element currently being displayed?”

Possible values:

"none" → hidden

"block" → visible


6.2 The condition
el.style.display === "block"

This asks:

“Is the div currently visible?”

=== means exactly equals

This returns:

true if visible

false if hidden


6.3 The ? : (ternary operator)
This is a short version of an if/else.

General form
condition ? valueIfTrue : valueIfFalse

Your code
el.style.display === "block" 

  ? "none" 

  : "block";

Read it like this:
“If the div is currently block, change it to none,
 otherwise change it to block.”

6.4 Expanded version (same logic, easier to read)
Here is the exact same logic written as a normal if statement (this is similar to the tutorial we started with):

if (el.style.display === "block") {

  el.style.display = "none";   // hide it

} else {

  el.style.display = "block"; // show it

}

So the toggle works because:

Visible → becomes hidden

Hidden → becomes visible


7. Why only ONE function is needed
Instead of:

myFunction()

myFunction2()

You now have:

toggleDiv('myDIV')

toggleDiv('myDIV2')

this is a little more elegant since you have less code which means fewer bugs and it is also easier to add more divs later, and you are going to have a lot!
Example: <button onclick="toggleDiv('myDIV3')">Toggle third</button> No new JavaScript needed!
8. Full toggle flow (step-by-step)
recap what the js does

Page load
CSS sets display: none
Div is hidden


then Button click
Button calls toggleDiv('myDIV')
JS finds the div
JS checks:
 el.style.display === "block" ❌ false
JS sets:
 el.style.display = "block"
Div appears


Click again
Condition is now true
JS sets:
 el.style.display = "none"
Div disappears


this can be repeated forever


TO DO
- main page + this is us page combined DONE
- map character intro to stage DONE
- make header and information dissapear
- loading page
- dialoge options on hover on lyrics page
- 2 more liminal spaces
- about page

      "?!? Has a drug problem. That’s rumoured at least. <u>Have some decency will you. That’s speculation.</u>",
      "<b>But hey, Pete wentz created his best work during the height of addiction.</b>",
      "Sometimes you can’t change how brains work, but the pop culture we’ve all experienced has already given",
      "us a solution. A story bead we’ve grown used to, didn’t we. So we fall right back into that.",
      "A solution we are not likely to change.",
      "Just follow. In the end ?!? is but a girl. <u>Give them a break.</u><b>Littlemissuscantmakeupamindatall.</b>",
      "?!? already had some musical projects. Most of them faded out, this is the band they’ve been a part of the longest.",
      "<b>Well not an essentially part.</b> <u>I mean it, give them a break will you?</u>"