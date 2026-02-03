// rotated text
var container = document.querySelector('.rotatedText');
if (container) {
  var lines = container.innerHTML.split('<br>');
  container.innerHTML = lines
    .map(function (line) {
      return '<span class="line" style="transform: rotate(' + (Math.random() * 2 - 2).toFixed(0) + 'deg); display: inline-block;">' + line + '</span>';
    })
    .join('<br>');
}

// draggability (guard if jQuery missing)
if (window.jQuery) {
  $(document).ready(function () {
    if ($.fn && typeof $.fn.draggable === 'function') {
      $('img').draggable({
        cancel: '.overlay-bug img, .crowd, .stagebackdrop',
        containment: 'document',
      });
    } else {
      console.warn('jQuery UI draggable not loaded; images not draggable.');
    }
  });
} else {
  console.warn('jQuery not loaded; skipping draggability.');
}

// typed text data
var typewriterData = {
  DOG: {
    text: [
      "Dog never thought he would drum, but maybe he overcame some sort of trauma. He doesn't know",
      'too much about expressing himself maybe, uses drumsticks instead.',
      'Someday his dream is to move to a historically rich city,',
      "being on the road doesn't give him too much opportunity to become even better at what he's doing.",
      'He is on point skillwise, but a perfectionist until the end. He would',
      'like to focus more on that instead of listening to the whining of his fellow bandmates.',
      '<b>Is this not pushing ourselves?</b>',
      "<b>Don't whine about it, be happy with what you're part of something bigger.</b> <i>How big is this thing exactly?</i>",
      "His favourite artist is Hermeto Pascoal. Someday he'll meet the other 57 people who know his work.",
      'They will rent a small hostel and hold a conference in the breakfast room. He lived in a remote forest for some time, but he',
      "doesn't talk too much about it. <i>Leaving some mystery to a band member is important bot said.</i> Dog has a sister",
      "but she doesn't have the same nose as he does.",
    ],
    state: { iSpeed: 120, iIndex: 0, iArrLength: 0, iScrollAt: 20, iTextPos: 0, sContents: '', iRow: 0, timeoutId: null },
  },
  BOT: {
    text: [
      'Since bot had started to train their voice, their whole body had started to shrink. Just slightly.',
      'Did they have to give parts of themself up, to get some agency back? Law of keeping equilibrium is our best guess.',
      'Bot had a band once called yellow thief. More of a coverband, nothing very original. But this band has been',
      'only originals, they specifically avoid covering anything. So don\'t try to request something. <i>One time</i>',
      '<i>at a show someone in the crowd asked them to play something from Radiohead.</i><u>Yeah don\'t do that.</u>',
      '<i>Bot threw the microphone at the person who asked.</i><b>No I just suggested that if they want the songs</b>',
      "<b>made by a different band they should fucking go to a different concert.</b><s>You didn't suggest. You screamed.</s>",
      "<b>Get over it.</b> Seems to be important to them to be original.<b>It is, always has been. This is what it's all about</b>",
      "<b>for me. Stupid observation.</b> Bot loves to stagedive at shows. And is spectacularly reckless while doing it.",
      'Bot is known for their harsh behaviour towards fans.',
    ],
    state: { iSpeed: 120, iIndex: 0, iArrLength: 0, iScrollAt: 20, iTextPos: 0, sContents: '', iRow: 0, timeoutId: null },
  },
  BUG: {
    text: [
      "Originally bug had wanted to be a bassist. But what's a band without a guitarist.",
      'This is why she only wants her picture taken with a bass in hand. <b>Fucking purist</b>',
      '<b>Just admit you will fill the gap no matter what it takes to be in a band.</b>',
      "<b>Just so that the fucking lamp won't take her place.</b>",
      "<u>But that's a lie.</u> <i>I suppose</i>. There seems to be some sort of strange",
      'thing going on between lamp and bug. <u>How is this relevant to the band and to what</u>',
      '<u>we do.</u><s>Isn\'t anything personal related to your artistic output relevant?</s><b>Shut up.</b>Lamp',
      "was there during their founding, her style has for sure influenced bug's way of playing the guitar.",
      "<s> Isn't it all the same? </s> <i> What is the same? What are you getting at, is this some symbolism</i>",
      "<i>in random stuff you're trying to find again?</i> <s>Nothing exists in a vacuum, what you do is always</s>",
      "<s>influenced by what and who is around you, but it's still your work.</s> <b>This is just a strategy to</b>",
      "explain your way of writing songs isn't it? Because you kind of steal words and thoughts and",
      'hide it behind observation.</b>  <i>And bug doesn\'t?</i><u>?!? has a point.</u><i>If she takes impulses from',
      'someone else, how is that any different from what I do?</i> <b>At least she has a skill, at least she plays an',
      "instrument. At least she's making something physical.</b>  <s>And writing isn't?</s>  <b>Don't you agree",
      "that it feels different. What you're doing is a lot more literal. I'm just saying.</b>",
      "Bug's favorite food is anything with apples. <u>How can this also be relevant??</u>",
    ],
    state: { iSpeed: 120, iIndex: 0, iArrLength: 0, iScrollAt: 20, iTextPos: 0, sContents: '', iRow: 0, timeoutId: null },
  },
  QMARK: {
    text: [
      "?!? has a drug problem. That's rumoured at least. <u>Have some decency will you. That’s speculation.</u>",
      '<b>But hey, Pete Wentz created his best work during the height of addiction.</b>',
      'Sometimes you can’t change how brains work, but the pop culture we’ve all experienced has already given',
      'us a solution. A story bead we’ve grown used to, didn’t we. So we fall right back into that.',
      'In the end ?!? is but a girl. <u>Give them a break.</u>',
      '<b>Littlemissuscantmakeupamindatall.</b>',
      '?!? already had some musical projects. Most of them faded out, this is the band they’ve been a part of the longest.',
      '<b>Well not an essential part.</b> <u>I mean it, give them a break will you?</u>',
    ],
    state: { iSpeed: 120, iIndex: 0, iArrLength: 0, iScrollAt: 20, iTextPos: 0, sContents: '', iRow: 0, timeoutId: null },
  },
  SPACE1: {
    text: [
      'Throw yourself off the edge of a cliff, will you?',
      'Not to finish anything off.',
      'But because you had never seen an open space like that before.',
      'ENDLESS.',
      'And you wanted to feel it engulf you. Swallow infinity.',
      'I fall as I write this.',
    ],
    state: { iSpeed: 120, iIndex: 0, iArrLength: 0, iScrollAt: 20, iTextPos: 0, sContents: '', iRow: 0, timeoutId: null },
  },
  SPACE2: {
    text: [
      'I for my part write like I bleed every month.',
      'With pain that replenishes. I am the ENDLESS space.',
      'Ive walked with some beautiful men in the course of my life',
      'and have become many. Multiple even.',
      "Sometimes we don't want what we wanted and sometimes we do.",
      "Sometimes we just don't know.",
      "Every time im pushed down I stand up and take more.",
      'But you know.',
      "Someday id like very much to not be pushed down anymore.",
    ],
    state: { iSpeed: 120, iIndex: 0, iArrLength: 0, iScrollAt: 20, iTextPos: 0, sContents: '', iRow: 0, timeoutId: null },
  },
  SPACE3: {
    text: [
      "I wait for the day I'd have completely unlearnt fear.",
      'I want to live somewhere,',
      'be someone to whom space is inherent. A given.',
      "Whenever I reclaim space I'm scared that it might be provisional",
      "and that I'd have to give it back one day.",
      'What did they receive from putting me in my place.',
      'Did they ever have the chance to get theirs?',
    ],
    state: { iSpeed: 120, iIndex: 0, iArrLength: 0, iScrollAt: 20, iTextPos: 0, sContents: '', iRow: 0, timeoutId: null },
  },
  BUGNOTE: {
    text: [
      'They founded themselves a few years ago. Must have been around new years eve.',
      'In a cabin somewhere in scandinavia. A lot of acid involved. Rumor has it.',
      "But that's where/when their first cds are dated. Three of a kind.",
      'Bot and ?!? would only meet when they unknowingly moved into the same building.',
      'Unbeknownst to them they had lived in the same house two years before that.',
      "That's at least what Bot swears by but ?!? had noticed Bot before.",
      'They are just too proud to admit it. That was before ?!? had started to smoke.',
    ],
    state: { iSpeed: 120, iIndex: 0, iArrLength: 0, iScrollAt: 20, iTextPos: 0, sContents: '', iRow: 0, timeoutId: null },
  },
};

function startTypewriter(character) {
  var data = typewriterData[character];
  if (!data) {
    console.error('Character not found: ' + character);
    return;
  }
  data.state.iIndex = 0;
  data.state.iTextPos = 0;
  data.state.sContents = '';
  data.state.iArrLength = data.text[0].length;
  if (data.state.timeoutId) {
    clearTimeout(data.state.timeoutId);
  }
  typewriter(character);
}

function typewriter(character) {
  var data = typewriterData[character];
  var state = data.state;
  var aText = data.text;
  state.sContents = ' ';
  state.iRow = Math.max(0, state.iIndex - state.iScrollAt);
  var destination = document.getElementById('typedtext' + character);
  if (!destination) {
    console.error('Destination element not found: typedtext' + character);
    return;
  }
  while (state.iRow < state.iIndex) {
    var rotation = (Math.random() * 3 - 2).toFixed(0);
    state.sContents +=
      '<span class="line" style="transform: rotate(' +
      rotation +
      'deg); display: inline-block;">' +
      aText[state.iRow++] +
      '</span><br>';
  }
  var currentRotation = (Math.random() * 3 - 2).toFixed(0);
  var currentText = aText[state.iIndex].substring(0, state.iTextPos);
  destination.innerHTML =
    state.sContents +
    '<span class="line" style="transform: rotate(' +
    currentRotation +
    'deg); display: inline-block;">' +
    currentText +
    '?</span>';
  if (state.iTextPos++ == state.iArrLength) {
    state.iTextPos = 0;
    state.iIndex++;
    if (state.iIndex != aText.length) {
      state.iArrLength = aText[state.iIndex].length;
      state.timeoutId = setTimeout(function () {
        typewriter(character);
      }, 500);
    } else {
      if (data.onComplete) data.onComplete();
    }
  } else {
    state.timeoutId = setTimeout(function () {
      typewriter(character);
    }, state.iSpeed);
  }
}

function initAfterDomReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
}

initAfterDomReady(() => {
  // cover GET TEXT toggles
  document.querySelectorAll('.cover-block').forEach((block) => {
    const img = block.querySelector('.cover-large');
    const btn = block.querySelector('.lyrics-toggle');
    const targetId = btn ? btn.getAttribute('data-target') : null;
    const lyricsEl = targetId ? document.getElementById(targetId) : null;
    if (!img || !btn || !lyricsEl) {
      console.warn('Skipping block (missing img/btn/lyrics):', { img, btn, lyricsEl, block });
      return;
    }
    const toggleLyrics = () => {
      const isOpen = lyricsEl.classList.toggle('open');
      btn.textContent = isOpen ? "I'VE HAD ENOUGH" : 'GET TEXT';
    };
    img.addEventListener('click', toggleLyrics);
    btn.addEventListener('click', toggleLyrics);
  });

  // lineup switcher
  const btn = document.getElementById('switch-lineup');
  const lineups = Array.from(document.querySelectorAll('.lineup-container'));
  if (btn && lineups.length) {
    let idx = lineups.findIndex((l) => l.classList.contains('active'));
    if (idx === -1) idx = 0;
    btn.addEventListener('click', () => {
      lineups[idx].classList.remove('active');
      idx = (idx + 1) % lineups.length;
      lineups[idx].classList.add('active');
    });
  }

  // THIS IS US -> toggle buttons/sidebar; per-button toggle its box
  const usBtn = document.getElementById('us-button');
  const memberButtons = document.getElementById('member-buttons');
  const memberSidebar = document.getElementById('member-sidebar');
  if (usBtn && memberButtons && memberSidebar) {
    usBtn.addEventListener('click', () => {
      memberButtons.classList.toggle('hidden');
      memberSidebar.classList.toggle('hidden');
    });
    memberButtons.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.dataset && target.dataset.member) {
        const member = target.dataset.member;
        const box = memberSidebar.querySelector(`.member-col[data-member="${member}"]`);
        if (box) box.classList.toggle('hidden');
        startTypewriter(member);
      }
    });
  }

  // Space page typing buttons (progressive unlock)
  const spaceButtons = [
    { btn: document.getElementById('spaceBtn1'), char: 'SPACE1', destId: 'typedtextSPACE1', next: 'spaceBtn2' },
    { btn: document.getElementById('spaceBtn2'), char: 'SPACE2', destId: 'typedtextSPACE2', next: 'spaceBtn3' },
    { btn: document.getElementById('spaceBtn3'), char: 'SPACE3', destId: 'typedtextSPACE3', next: null },
  ];
  const onComplete = {
    SPACE1: () => { const n = document.getElementById('spaceBtn2'); if (n) n.style.display = 'inline-block'; },
    SPACE2: () => { const n = document.getElementById('spaceBtn3'); if (n) n.style.display = 'inline-block'; },
    SPACE3: () => {}
  };
  spaceButtons.forEach((entry) => {
    if (entry.btn) {
      entry.btn.addEventListener('click', () => {
        const dest = document.getElementById(entry.destId);
        if (dest) dest.innerHTML = '';
        if (typewriterData[entry.char]) typewriterData[entry.char].onComplete = onComplete[entry.char];
        startTypewriter(entry.char);
      });
    }
  });

  // Bug note typing (lyrics page) on button click
  const bugNoteDest = document.getElementById('typedtextBUGNOTE');
  const foundingBtn = document.getElementById('founding-btn');
  if (bugNoteDest && foundingBtn && typewriterData.BUGNOTE) {
    foundingBtn.addEventListener('click', () => {
      bugNoteDest.innerHTML = '';
      startTypewriter('BUGNOTE');
    });
  }
});