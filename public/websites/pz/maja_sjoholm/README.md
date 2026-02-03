# 0.2

I know I have a lot left but I'm working day and night to get this finished in time! I had a bit of a ruff start but now I feel more
confertble with what I'm doing, and not changing my design all the time.


Questions:

Valley:


Other:
   -I had an idea about mmoving the scrollbar on the page to under the music button so that the scrollbar looks like the music-time-bar-thing when you play a song. I tried to google how to do it but I could figure out how...

yes, visually posible — but not natively.
Browsers do not allow moving a vertical scrollbar to the bottom. So the only way is to hide the real scrollbar and mirror the vertical scroll position into a custom horizontal “progress bar”

I dont know which file so I am creating an example html file (scrolling.html)




First an overview over some little errors on your index that could be problematic in some browsers ...

1.
Missing required <meta charset>
You’re using apostrophes, special characters, etc.
so you need to add this inside <head>:
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="Style.css">
</head>
Without this, text can break on some systems.

        -I added the " <meta charset="utf-8">" but I already have the link to stylesheet so a did'nt add that again.

2. 
good practice for later 
Missing viewport meta (mobile issue)
Not an error on desktop, but broken scaling on mobile.
Add this to your head:
<meta name="viewport" content="width=device-width, initial-scale=1.0">

        -Should I add this to all of them?







Hey, 
I am wondering if there is something that could happen with h1 some animation maybe? 
some examples https://codepen.io/alvarotrigo/pen/eYoJYew https://codepen.io/ash1198/pen/ZYObvaK https://codepen.io/nefejames/pen/ByBBOaO or what could fint to the site?

        Maybeee, will think about it, wamted it to be a bit lowkey though. Maybe fun for the Harry Styles page!







                                Solved:
                                - I don't know how to fix the text so it's verticaly centered in the boxes. If they're a "p"-element it's working but when they are    links
                                they won't center verticaly, only horizontal....
                                -> This is bc of the autostyles that a p element has 
                                if you look at your strcture 
                                you have 
                                -> <a href="Harry/Harry.html" class="collumn" id="HS"> Harry's House</a>
                                but for the ones still in p
                                    <div class="collumn" style=" position: fixed; top: 30vw; left: 18vw; "> 
                                        <p> - Stay tuned -</p>
                                    </div>

                                    the p holds some distance to the wrapping div element 
                                    so a quickfix could be to go about it this way
                                    <a>
                                        <p></p>
                                        </a> 
                                - Thank you
                                
                                3.
                                Capitalization mismatch in CSS file
                                <link rel="stylesheet" href="Style.css">
                                On case-sensitive systems (Linux, servers):
                                Style.css ≠ style.css
                                Make sure the filename matches exactly.

                                    -Okay, thank you
                                4.
                                Missing <title>
                                You don’t have:
                                <title>Your Title</title>
                                Add one — it affects tabs, bookmarks, accessibility.
                                
                                        - Added!

                                    I found how to make a img draggable, but I want to use the effect on multiple different images but the function uses
    an id to make the effect. How can I apply it on all of the different images? I tried changing it to a class but that didn't work, maybe
    I messed it up. I don't understand what everything in the code does :P


    Hey!
You were very close with the draggable function i repaired it and made some coments for you, there is also some important bits in the css for that :)

Some things to think about:
-> Heavy inline styles
Example:
<a href="Valley/Valley.html" class="collumn" style="position: fixed; top: 14vw; left: 18vw;">
Not invalid, but:
Hard to maintain
Hard to debug
Impossible to reuse
Move to CSS if this grows.


    
