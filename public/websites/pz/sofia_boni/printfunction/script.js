// /* 
//   Conversion factor:
//   Browsers work in pixels, but our layout uses millimeters (mm) 
//   because we want print-accurate positioning.

//   96 px = 1 inch
//   25.4 mm = 1 inch
//   So: mm per pixel = 25.4 / 96
// */
// const MM_PER_PX = 25.4 / 96;

// /* 
//   Select all elements that have the class ".item"
//   These are our draggable / resizable images on the canvas.
// */
// const items = document.querySelectorAll('.item');

// /* 
//   Stores which item is currently selected (clicked).
//   If nothing is selected, this stays null.
// */
// let selectedId = null;


// /* ---------- LAYOUT MODEL ---------- */

// /*
//   This is the MOST IMPORTANT part of the system.

//   It is the "single source of truth":
//   - The screen reads from this object
//   - Printing uses this object
//   - Exporting will use this object

//   Each image has:
//   x, y       → position on the page (in mm)
//   width      → size in mm
//   height     → size in mm
//   rotation   → rotation in degrees
//   z          → stacking order (which is on top)
// */
// const layout = {
//   a: {
//     x: 20,
//     y: 30,
//     width: 100,
//     height: 70,
//     rotation: -5,
//     z: 1
//   },
//   b: {
//     x: 60,
//     y: 90,
//     width: 110,
//     height: 80,
//     rotation: 4,
//     z: 2
//   }
// };


// /* ---------- Z-INDEX TRACKING ---------- */

// /*
//   Find the highest existing z-index value.
//   This allows us to always bring the clicked item to the front.

//   Math.max(...) finds the largest number in the array.
// */
// let topZ = Math.max(...Object.values(layout).map(d => d.z));


// /* ---------- RENDER ---------- */

// /*
//   Render means:
//   "Apply the data from the layout model to the actual DOM element"

//   This function takes:
//   - the element (el)
//   - finds its data in the layout
//   - applies position, size, rotation, and stacking order
// */
// function render(el) {
//   const d = layout[el.dataset.id]; // dataset.id matches layout key

//   el.style.left = d.x + 'mm';
//   el.style.top = d.y + 'mm';
//   el.style.width = d.width + 'mm';
//   el.style.height = d.height + 'mm';

//   // rotation is visual only, position stays real
//   el.style.transform = `rotate(${d.rotation}deg)`;

//   // z-index controls which item is on top
//   el.style.zIndex = d.z;
// }

// /* 
//   Render all items once on page load
// */
// items.forEach(render);


// /* ---------- SELECTION ---------- */

// /*
//   When clicking on an item:
//   - stop the click from reaching the body
//   - mark it as selected
// */
// items.forEach(el => {
//   el.addEventListener('click', e => {
//     e.stopPropagation(); // prevent deselect
//     select(el.dataset.id);
//   });
// });

// /*
//   Clicking anywhere outside items:
//   - clears the selection
// */
// document.body.addEventListener('click', () => {
//   selectedId = null;
//   items.forEach(i => i.classList.remove('selected'));
// });


// /*
//   Handles selecting an item
// */
// function select(id) {
//   // If already selected, do nothing
//   if (selectedId === id) return;

//   selectedId = id;

//   // Bring the selected item to the top
//   layout[id].z = ++topZ;

//   // Update visual selection state
//   items.forEach(el => {
//     const isSelected = el.dataset.id === id;
//     el.classList.toggle('selected', isSelected);

//     // Re-render only the selected element
//     if (isSelected) render(el);
//   });
// }


// /* ---------- INTERACT (DRAG + RESIZE) ---------- */

// /*
//   Interact.js handles pointer interactions (mouse dragging, resizing).
//   We never let it move elements directly.
//   Instead, it updates the layout model, then we re-render.
// */

// interact('.item')
//   .draggable({
//     listeners: {
//       move(e) {
//         // Get the layout data for this element
//         const d = layout[e.target.dataset.id];

//         /*
//           Rotation-aware dragging:

//           If an element is rotated, moving the mouse "right"
//           should still move the element visually right.

//           So we convert movement using rotation math.
//         */

//         const angle = d.rotation * Math.PI / 180;
//         const cos = Math.cos(angle);
//         const sin = Math.sin(angle);

//         // Convert pixel movement to millimeters
//         const dx = e.dx * MM_PER_PX;
//         const dy = e.dy * MM_PER_PX;

//         // Apply movement corrected for rotation
//         d.x += dx * cos + dy * sin;
//         d.y += -dx * sin + dy * cos;

//         // Apply changes to the screen
//         render(e.target);
//       }
//     }
//   })

//   .resizable({
//     edges: { right: true, bottom: true }, // resize from bottom-right only
//     listeners: {
//       move(e) {
//         const d = layout[e.target.dataset.id];

//         // Convert pixel resize to millimeters
//         d.width += e.deltaRect.width * MM_PER_PX;
//         d.height += e.deltaRect.height * MM_PER_PX;

//         render(e.target);
//       }
//     }
//   });


// /* ---------- ROTATION (KEYBOARD) ---------- */

// /*
//   Rotation is controlled by keyboard arrows:

//   - Select an image
//   - Press ArrowLeft or ArrowRight
// */

// document.addEventListener('keydown', e => {
//   if (!selectedId) return; // no selected item → nothing to rotate

//   const d = layout[selectedId];

//   if (e.key === 'ArrowLeft') d.rotation -= 1;
//   if (e.key === 'ArrowRight') d.rotation += 1;

//   // Update the selected element visually
//   render(document.querySelector(`[data-id="${selectedId}"]`));
// });


// /* ---------- PRINT ---------- */

// /*
//   Triggers the browser print dialog.
//   Since the canvas is sized in mm, print output matches layout.
// */
// document.getElementById('print').onclick = () => {
//   window.print();
// };


















const MM_PER_PX = 25.4 / 96;
const items = document.querySelectorAll('.draggable-asset');
let selectedId = null;


/* ---------- LAYOUT MODEL ---------- */
const layout = {
  a: {
    x: 20,
    y: 30,
    width: 100,
    height: 70,
    rotation: -5,
    z: 1
  },
  b: {
    x: 60,
    y: 90,
    width: 110,
    height: 80,
    rotation: 4,
    z: 2
  }
};


/* ---------- Z-INDEX TRACKING ---------- */
let topZ = Math.max(...Object.values(layout).map(d => d.z));


/* ---------- RENDER ---------- */
function render(el) {
  const d = layout[el.dataset.id]; // dataset.id matches layout key

  el.style.left = d.x + 'mm';
  el.style.top = d.y + 'mm';
  el.style.width = d.width + 'mm';
  el.style.height = d.height + 'mm';

  // rotation is visual only, position stays real
  el.style.transform = `rotate(${d.rotation}deg)`;

  // z-index controls which item is on top
  el.style.zIndex = d.z;
}

items.forEach(render);


/* ---------- SELECTION ---------- */

items.forEach(el => {
  el.addEventListener('click', e => {
    e.stopPropagation(); // prevent deselect
    select(el.dataset.id);
  });
});


document.body.addEventListener('click', () => {
  selectedId = null;
  items.forEach(i => i.classList.remove('selected'));
});


function select(id) {
  // If already selected, do nothing
  if (selectedId === id) return;

  selectedId = id;

  // Bring the selected item to the top
  layout[id].z = ++topZ;

  // Update visual selection state
  items.forEach(el => {
    const isSelected = el.dataset.id === id;
    el.classList.toggle('selected', isSelected);

    // Re-render only the selected element
    if (isSelected) render(el);
  });
}


/* ---------- INTERACT (DRAG + RESIZE) ---------- */

interact('.draggable-asset')
  .draggable({
    listeners: {
      move(e) {
        // Get the layout data for this element
        const d = layout[e.target.dataset.id];

        const angle = d.rotation * Math.PI / 180;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // Convert pixel movement to millimeters
        const dx = e.dx * MM_PER_PX;
        const dy = e.dy * MM_PER_PX;

        // Apply movement corrected for rotation
        d.x += dx * cos + dy * sin;
        d.y += -dx * sin + dy * cos;

        // Apply changes to the screen
        render(e.target);
      }
    }
  })

  .resizable({
    edges: { right: true, bottom: true }, // resize from bottom-right only
    listeners: {
      move(e) {
        const d = layout[e.target.dataset.id];

        // Convert pixel resize to millimeters
        d.width += e.deltaRect.width * MM_PER_PX;
        d.height += e.deltaRect.height * MM_PER_PX;

        render(e.target);
      }
    }
  });


/* ---------- ROTATION (KEYBOARD) ---------- */
document.addEventListener('keydown', e => {
  if (!selectedId) return; // no selected item → nothing to rotate

  const d = layout[selectedId];

  if (e.key === 'ArrowLeft') d.rotation -= 1;
  if (e.key === 'ArrowRight') d.rotation += 1;

  // Update the selected element visually
  render(document.querySelector(`[data-id="${selectedId}"]`));
});


/* ---------- PRINT ---------- */

document.getElementById('print').onclick = () => {
  window.print();
};
