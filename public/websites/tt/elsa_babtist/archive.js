// Archive top bar text swap and interaction logic
window.handleArchiveTopbar = function(isArchive) {
  var topLeft = document.querySelector('.top-left p');
  if (!topLeft) return;
  if (isArchive) {
    topLeft.textContent = '■ Go back to Editor/Tool';
    topLeft.classList.add('archive-topbar-link');
    topLeft.style.cursor = 'pointer';
    topLeft.onclick = function(e) {
      e.preventDefault();
      window.location.hash = '#editor';
    };
  } else {
    topLeft.textContent = 'Typeflow-T-Area is an area-based typesetting Tool. Where language takes shape and text becomes form.';
    topLeft.classList.remove('archive-topbar-link');
    topLeft.style.cursor = '';
    topLeft.onclick = null;
  }
};
// Archive gallery rendering for Archive view
function renderArchive() {
  var grid = document.getElementById('archiveGrid');
  if (!grid) return;
  grid.innerHTML = '';
  let items = [];
  try {
    items = JSON.parse(localStorage.getItem('typeflow_archive_items')) || [];
  } catch (e) { items = []; }
  if (!items.length) {
    var empty = document.createElement('div');
    empty.textContent = 'No archived works yet.';
    empty.style.margin = '32px 0';
    empty.style.textAlign = 'center';
    grid.appendChild(empty);
    return;
  }
  items.forEach(function(item, idx) {
    var wrap = document.createElement('div');
    wrap.className = 'archive-item';
    var imgWrap = document.createElement('div');
    imgWrap.className = 'archive-img-wrap';
    var img = document.createElement('img');
    img.src = item.dataUrl;
    // All image styling handled by CSS
    var del = document.createElement('a');
    del.textContent = 'Delete';
    del.href = '#';
    del.className = 'archive-delete-bar';
    del.onclick = function(e) {
      e.preventDefault();
      if (confirm('Delete this archived item?')) {
        let arr = [];
        try {
          arr = JSON.parse(localStorage.getItem('typeflow_archive_items')) || [];
        } catch (e) { arr = []; }
        arr = arr.filter(x => x.id !== item.id);
        localStorage.setItem('typeflow_archive_items', JSON.stringify(arr));
        renderArchive();
      }
    };
    imgWrap.appendChild(img);
    imgWrap.appendChild(del);
    var ts = document.createElement('div');
    ts.className = 'archive-timestamp';
    try {
      var d = new Date(item.createdAt);
      ts.textContent = d.toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '');
    } catch (e) {
      ts.textContent = item.createdAt;
    }
    wrap.appendChild(imgWrap);
    wrap.appendChild(ts);
    grid.appendChild(wrap);
  });
}
