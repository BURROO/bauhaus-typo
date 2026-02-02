// script.js (updated — adds robustness for printing pipeline and loads html2canvas if missing)
document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("replyInput");
  const paper = document.getElementById("paper");
  const printBtn = document.getElementById("printBtn");
  const charCount = document.getElementById("charCount");
  const SHAPES_DEFS = document.getElementById("shapes-defs");

  if(!input || !paper || !printBtn || !charCount || !SHAPES_DEFS){
    console.error("Ein wichtiges Element fehlt im DOM!");
    return;
  }

  const POSTER_FONTS = [
    "TASA Orbiter",
    "Rubik Glitch",
    "Tilt Neon",
    "Bungee"
  ];

  const PADDING = 16;
  const THROTTLE_MS = 80;

  function rnd(){const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]/4294967295;}
  function rndInt(a,b){return Math.floor(rnd()*(b-a+1))+a;}
  function rndRange(a,b){return rnd()*(b-a)+a;}
  function pick(a){return a[Math.floor(rnd()*a.length)];}

  function getShapes(){
    return Array.from(SHAPES_DEFS.children).map(n=>n.cloneNode(true));
  }

  function setPaperHeight(mm){
    paper.style.height = mm+"mm";
    return new Promise(res=>requestAnimationFrame(()=>{
      const r = paper.getBoundingClientRect();
      res({w:r.width,h:r.height});
    }));
  }

  function createSvg(w,h){
    const ns="http://www.w3.org/2000/svg";
    const svg=document.createElementNS(ns,"svg");
    svg.setAttribute("viewBox",`0 0 ${w} ${h}`);
    svg.setAttribute("width","100%");
    svg.setAttribute("height","auto");

    const bg=document.createElementNS(ns,"rect");
    bg.setAttribute("width",w);
    bg.setAttribute("height",h);
    bg.setAttribute("fill","#fff");
    svg.appendChild(bg);

    return svg;
  }

  function safeBBox(el){try{return el.getBBox();}catch(e){return null;}}

  function addText(svg,x,y,txt,size){
    const ns="http://www.w3.org/2000/svg";
    const t=document.createElementNS(ns,"text");
    t.setAttribute("x",x);
    t.setAttribute("y",y);
    t.setAttribute("font-family", pick(POSTER_FONTS)+", sans-serif");
    t.setAttribute("font-size",size);
    t.setAttribute("font-weight",900);
    t.setAttribute("fill","#000");
    t.textContent=txt;
    svg.appendChild(t);

    if(rnd()<0.4){
      const b=safeBBox(t);
      if(b){
        const cx=b.x+b.width/2;
        const cy=b.y+b.height/2;
        t.setAttribute(
          "transform",
          `rotate(${pick([0,90,-90,180])} ${cx} ${cy})`
        );
      }
    }
    return t;
  }

  function fitTextToWidth(el,maxWidth){
    const box=safeBBox(el);
    if(!box||box.width<=maxWidth) return;
    const sx=maxWidth/box.width;
    el.setAttribute("transform",
      (el.getAttribute("transform")||"")+` scale(${sx} 1)`
    );
  }

  function duplicateAlt(svg,base,copies=3,step=6){
    const b=safeBBox(base); if(!b) return;
    for(let i=1;i<=copies;i++){
      const c=base.cloneNode(true);
      c.setAttribute("fill",i%2?"#fff":"#000");
      c.setAttribute(
        "transform",
        (c.getAttribute("transform")||"")+
        ` translate(${step*i*(i%2?1:-1)},${step*i*(i%2?1:-1)})`
      );
      svg.appendChild(c);
    }
  }

  function placeBigShape(svg,shapes,w,h){
    if(!shapes.length) return;
    const s=pick(shapes);
    const g=s.cloneNode(true);
    // build transform string in one template to avoid accidental syntax issues
    const tx = `translate(${rndRange(w*0.2,w*0.8)} ${rndRange(h*0.3,h*0.95)})`;
    const rt = `rotate(${pick([0,90,180,-90])})`;
    const sc = `scale(${rndRange(0.4,1.8)})`;
    g.setAttribute("transform", `${tx} ${rt} ${sc}`);
    Array.from(g.querySelectorAll("*")).forEach(n=>{
      n.setAttribute("fill","#000");
      n.setAttribute("stroke","none");
    });
    svg.appendChild(g);
  }

  function posterVertical(svg,lines,w,h){
    let y=h*0.12;
    lines.forEach(txt=>{
      const size = rnd()<0.3
        ? rndRange(h*0.25,h*0.6)
        : rndRange(h*0.08,h*0.18);
      const t=addText(svg,PADDING,y,txt,Math.round(size));
      fitTextToWidth(t,w-PADDING*2);
      if(rnd()>0.6) duplicateAlt(svg,t,rndInt(1,4),6);
      y+=size*0.9;
    });
    if(y<h*0.85){
      const filler=pick(lines);
      const size=rndRange(h*0.18,h*0.35);
      addText(svg,PADDING,h*rndRange(0.7,0.92),filler,size);
    }
  }

  function posterPattern(svg,lines,w,h){
    const word=pick(lines);
    const cols=rndInt(2,4);
    const rows=rndInt(4,8);
    const size=rndRange(h*0.08,h*0.16);
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const t=addText(svg,PADDING+c*(w/cols),PADDING+r*size*1.3,word,size);
        if(rnd()<0.4) duplicateAlt(svg,t,2,4);
      }
    }
  }

  function composePoster(lines,w,h){
    paper.innerHTML="";
    const svg=createSvg(w,h);
    paper.appendChild(svg);

    const shapes=getShapes();
    pick([posterVertical,posterPattern])(svg,lines,w,h);
    if(rnd()<0.8) placeBigShape(svg,shapes,w,h);
    if(rnd()<0.5) placeBigShape(svg,shapes,w,h);
  }

  let timer=null;

  function generate(){
    const txt=input.value.trim();
    charCount.textContent=`${txt.length}/250`;
    if(!txt){paper.innerHTML="";return;}

    let words=txt.split(/\s+/);
    if(rnd()<0.35 && words.length>3){
      words=words.map(w=>rnd()<0.3?w.toUpperCase():w);
    }

    let lines=[],line="";
    words.forEach(w=>{
      if((line+" "+w).length<20) line+=" "+w;
      else{lines.push(line.trim()); line=w;}
    });
    if(line) lines.push(line.trim());

    const mm_height=180 + txt.length*2.2 + Math.pow(txt.length,1.15);

    setPaperHeight(mm_height).then(dim=>{
      clearTimeout(timer);
      timer=setTimeout(()=>composePoster(lines,dim.w,dim.h),THROTTLE_MS);
    });
  }

  const QUESTIONS = [
  "What did you find here without looking for it?",
  "What will you remember from today?",
  "What are you thinking about right now?",
  "What thought passed through you and disappeared?",
  "What did you notice only after staying a while?",
  "What is present here, but easy to miss?",
  "What are you aware of now that you weren’t before?",
  "What part of this experience feels personal?",
  "What did this space allow you to think about?",
  "Has time slowed down or sped up for you in this exhibition?"
];

  // setze beim Laden der Seite zufällig eine Frage
  document.querySelector(".q-text").textContent = pick(QUESTIONS);

  input.addEventListener("input",generate);

  // -------------------------------
  // Printing pipeline (ESC/POS to Citizen thermal printer)
  // - captures #paper with html2canvas
  // - grayscale -> Floyd–Steinberg dither -> 1-bit bitmap
  // - resizes to printer width (dots) e.g. 384 or 576
  // - encodes GS v 0 raster and sends raw bytes via Web Serial / WebUSB / WebSocket proxy
  // -------------------------------

  // load script helper (if html2canvas missing)
  function loadScript(src){
    return new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src=src;
      s.onload=()=>resolve();
      s.onerror=(e)=>reject(new Error('Failed to load '+src));
      document.head.appendChild(s);
    });
  }

  // helper: capture
  async function captureElementToCanvas(element, scale = 1) {
    if (typeof html2canvas === 'undefined') {
      // attempt to load html2canvas dynamically
      try {
        await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
      } catch (e) {
        throw new Error('html2canvas is required but could not be loaded. Ensure network access or include the library in index.html.');
      }
      if (typeof html2canvas === 'undefined') {
        throw new Error('html2canvas still not available after loading.');
      }
    }
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale,
      useCORS: true,
      allowTaint: true
    });
    if (!canvas || !canvas.width || !canvas.height) {
      throw new Error('Captured canvas has zero width/height. Ensure the #paper element is visible with layout before printing.');
    }
    return canvas;
  }

  function resizeCanvasNearest(srcCanvas, targetWidth, targetHeight) {
    const dest = document.createElement('canvas');
    dest.width = targetWidth;
    dest.height = targetHeight;
    const ctx = dest.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(srcCanvas, 0, 0, srcCanvas.width, srcCanvas.height, 0, 0, targetWidth, targetHeight);
    return dest;
  }

  function grayscaleImageData(imgData) {
    const data = imgData.data;
    const width = imgData.width;
    const height = imgData.height;
    const gray = new Float32Array(width * height);
    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      const alpha = a / 255;
      const rr = r * alpha + 255 * (1 - alpha);
      const gg = g * alpha + 255 * (1 - alpha);
      const bb = b * alpha + 255 * (1 - alpha);
      gray[p] = 0.299 * rr + 0.587 * gg + 0.114 * bb;
    }
    return { gray, width, height };
  }

  function floydSteinbergDither(grayArray, width, height) {
    const bw = new Uint8Array(width * height); // 1=black
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const oldVal = grayArray[idx];
        const newVal = oldVal < 128 ? 0 : 255;
        const err = oldVal - newVal;
        bw[idx] = newVal === 0 ? 1 : 0;
        if (x + 1 < width) grayArray[idx + 1] += (err * 7) / 16;
        if (x - 1 >= 0 && y + 1 < height) grayArray[idx + width - 1] += (err * 3) / 16;
        if (y + 1 < height) grayArray[idx + width] += (err * 5) / 16;
        if (x + 1 < width && y + 1 < height) grayArray[idx + width + 1] += (err * 1) / 16;
      }
    }
    return bw;
  }

  function packBitsMonochrome(bitArray, width, height) {
    const bytesPerRow = Math.ceil(width / 8);
    const out = new Uint8Array(bytesPerRow * height);
    for (let y = 0; y < height; y++) {
      for (let bx = 0; bx < bytesPerRow; bx++) {
        let byte = 0x00;
        for (let bit = 0; bit < 8; bit++) {
          const x = bx * 8 + bit;
          if (x >= width) continue;
          const pix = bitArray[y * width + x]; // 1 = black
          if (pix) byte |= (0x80 >> bit); // MSB = leftmost pixel
        }
        out[y * bytesPerRow + bx] = byte;
      }
    }
    return { data: out, bytesPerRow };
  }

  function buildGsV0Raster(bytesPerRow, height, bitmapData, mode = 0) {
    // GS v 0: 1D 76 30 m xL xH yL yH [data]
    const xL = bytesPerRow & 0xFF;
    const xH = (bytesPerRow >> 8) & 0xFF;
    const yL = height & 0xFF;
    const yH = (height >> 8) & 0xFF;
    const header = new Uint8Array([0x1D, 0x76, 0x30, mode, xL, xH, yL, yH]);
    const out = new Uint8Array(header.length + bitmapData.length);
    out.set(header, 0);
    out.set(bitmapData, header.length);
    return out;
  }

  // Web Serial send
  async function sendToSerial(port, data) {
    const openOptions = { baudRate: 19200 };
    if (!port.readable || !port.writable) {
      await port.open(openOptions);
    }
    const writer = port.writable.getWriter();
    try {
      await writer.write(data);
    } finally {
      writer.releaseLock();
    }
  }

  // WebUSB helpers
  async function openUsbDevice(opts = {}) {
    if (!navigator.usb) throw new Error('WebUSB not available in this browser');
    let device;
    if (opts.filters && opts.filters.length) {
      device = await navigator.usb.requestDevice({ filters: opts.filters });
    } else {
      const devices = await navigator.usb.getDevices();
      if (devices.length === 0) {
        device = await navigator.usb.requestDevice({ filters: [] }).catch(() => {
          throw new Error('No USB device selected (WebUSB request cancelled).');
        });
      } else {
        device = devices[0];
      }
    }
    await device.open();
    if (device.configuration === null) {
      await device.selectConfiguration(1);
    }

    let ifaceNumber = null;
    let endpointNumber = null;
    for (const cfg of device.configuration.interfaces) {
      for (const alt of cfg.alternates) {
        if (!alt.endpoints) continue;
        for (const ep of alt.endpoints) {
          if (ep.direction === 'out') {
            ifaceNumber = cfg.interfaceNumber;
            endpointNumber = ep.endpointNumber;
            break;
          }
        }
        if (endpointNumber !== null) break;
      }
      if (endpointNumber !== null) break;
    }
    if (ifaceNumber === null) throw new Error('Could not find OUT endpoint on USB device');
    await device.claimInterface(ifaceNumber);
    return { device, ifaceNumber, endpointNumber };
  }

  async function sendToUsb(deviceHandle, data) {
    const { device, endpointNumber } = deviceHandle;
    await device.transferOut(endpointNumber, data);
  }

  // WebSocket proxy send
  async function sendViaWebSocket(wsUrl, data) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(wsUrl);
      ws.binaryType = 'arraybuffer';
      ws.addEventListener('open', () => {
        ws.send(data);
      });
      ws.addEventListener('close', () => resolve());
      ws.addEventListener('error', (e) => reject(e));
      // resolve after short timeout if still open
      setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
          resolve();
        }
      }, 1500);
    });
  }

  // Main print flow
  async function printPaperToThermal(options = {}) {
    const widthDots = options.widthDots || 384;
    const transport = options.transport || 'serial';
    const mode = (typeof options.mode === 'number') ? options.mode : 0;

    // Capture
    const baseCanvas = await captureElementToCanvas(paper, 1);

    // Validate baseCanvas size
    if (!baseCanvas || !baseCanvas.width || !baseCanvas.height) {
      throw new Error('Captured canvas invalid (zero width/height). Cannot print.');
    }

    // Resize so canvas width equals printer dots
    const targetWidth = widthDots;
    const scale = targetWidth / baseCanvas.width;
    const targetHeight = Math.max(1, Math.round(baseCanvas.height * scale));
    const canvas = resizeCanvasNearest(baseCanvas, targetWidth, targetHeight);

    // Grayscale
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { gray, width, height } = grayscaleImageData(imgData);

    // Dither to 1-bit
    const bitArray = floydSteinbergDither(gray, width, height);

    // Pack into bytes
    const { data: packed, bytesPerRow } = packBitsMonochrome(bitArray, width, height);

    // Build GS v 0 raster
    const escposData = buildGsV0Raster(bytesPerRow, height, packed, mode);

    // Append some feeds (some printers need extra feed)
    const feed = new Uint8Array([0x0A, 0x0A, 0x0A]);
    const finalData = new Uint8Array(escposData.length + feed.length);
    finalData.set(escposData, 0);
    finalData.set(feed, escposData.length);

    // Send
    if (transport === 'serial') {
      if (!('serial' in navigator)) throw new Error('Web Serial API not available in this browser.');
      const port = options.serialPort || await navigator.serial.requestPort();
      await sendToSerial(port, finalData);
      return;
    }
    if (transport === 'usb') {
      if (!navigator.usb) throw new Error('WebUSB not available in this browser.');
      const handle = await openUsbDevice(options.usbOptions || {});
      await sendToUsb(handle, finalData.buffer);
      return;
    }
    if (transport === 'websocket') {
      if (!options.wsUrl) throw new Error('wsUrl required for websocket transport');
      await sendViaWebSocket(options.wsUrl, finalData.buffer);
      return;
    }
    throw new Error('Unknown transport: ' + transport);
  }

  // UI: when user clicks Print, ask which transport to use and run pipeline.
  printBtn.addEventListener("click", async () => {
    try {
      const defaultTransport = (('serial' in navigator) ? 'serial' : (navigator.usb ? 'usb' : 'websocket'));
      const t = prompt(`Print to thermal printer via (type one):\n- serial\n- usb\n- websocket\n\nDefault: ${defaultTransport}`, defaultTransport);
      if (!t) return;
      const transport = t.trim().toLowerCase();
      const widthInput = prompt('Printer width in dots (384 for 58mm / 576 for 80mm)', '384');
      const widthDots = parseInt(widthInput || '384', 10) || 384;

      const opts = { transport, widthDots };

      if (transport === 'serial') {
        if (!('serial' in navigator)) {
          alert('Web Serial is not available in this browser. Try WebUSB or WebSocket proxy.');
          return;
        }
        const port = await navigator.serial.requestPort();
        opts.serialPort = port;
        opts.serialOptions = { baudRate: 19200 };
      } else if (transport === 'usb') {
        // optional: set opts.usbOptions = { filters: [...] } if you know vendor/product
      } else if (transport === 'websocket') {
        const wsUrl = prompt('WebSocket proxy URL (e.g. ws://localhost:9000)', 'ws://localhost:9000');
        if (!wsUrl) return;
        opts.wsUrl = wsUrl;
      } else {
        alert('Unknown transport selected.');
        return;
      }

      printBtn.disabled = true;
      printBtn.textContent = 'Contribute';
      await printPaperToThermal(opts);
      alert('Print job sent to printer.');
    } catch (err) {
      console.error(err);
      alert('Print failed: ' + (err && err.message ? err.message : String(err)));
    } finally {
      printBtn.disabled = false;
      printBtn.textContent = 'Contribute';
    }
  });

  generate();
});

/* =========================
   SCRIBBLE BACKGROUND LOGIC (OFFLINE VERSION)
========================= */

// TEIL 1: Blumen und erstes Pferd
const TEIL_1 = [
  // Flower1
  `<?xml version="1.0" encoding="UTF-8"?><svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1173.18 1263.83"><path d="M720.52,55.19c.34.59,1.93.86,2.71,2.75,1.46,3.52.23,7.02,1.09,9.93,5.09,17.09,4.37,35.81,6.91,54.09,4.81,34.57-3.58,71.76-1.15,107.14.15,2.22.87,4.27,1.05,6.46,1.94,1.65,15.08-10.86,17.07-12.42,19.99-15.61,37.07-31.31,58.26-44.74,49.71-31.51,113.28-63.43,174.14-58.83,18.59,1.41,54,10.4,69.85,20.15,18.82,11.57,27.08,61.33,23,81.67-3.41,16.99-15.07,47.35-23.15,62.85-1.6,3.06-11.62,16.64-14.15,19.85-1.94,2.46-6.21,4.06-8.06,6.94-3.11,4.83-5.73,9.85-9.41,14.59-28.41,36.67-63.85,74.02-101.63,103.38-2.69,2.09-19.49,11.69-18.93,14.05,5.64,4.35,15.25,4.54,22.51,5.5,30.84,4.09,56.6,12.35,85.16,24.84,24.96,10.92,54.36,24.32,76.67,39.33,31.65,21.29,48.4,52.59,66.87,85.13,10.59,18.66,28.91,45.21,22.5,66.93-5,16.94-16.89,22.58-31.73,29.27-34.19,15.41-71.35,28.28-108.57,33.43-5.27.73-11.02-.69-16.41,1.1-.6,4.56,4.7,5.52,7.48,8.01,64.2,57.64,137.15,118.89,130.51,214.47-1.07,15.43-6.7,28.93-13.77,42.23-15.66,29.45-44.48,49.04-75.24,60.76-17.01,6.48-51.05,2.97-69.38.41-49.28-6.86-81.31-24.02-123.27-47.73-8.76-4.95-18.06-9.21-26.84-14.14-2.8,1.86-.34,4.45-.54,7.34-1.43,20.59-5.71,52.19-13.75,71.34-2.4,5.71-12.28,13.69-16.61,20.39s-5.8,16.62-16.1,16c-7-.42-3.87-9.92-12.36-9.22.73-10.76-4.27-19.52-7.43-29.06-1.65-4.98-2.97-12.3-4.99-17.01-5.94-13.82-35.34-44.73-49-51.99-1.3-.69-3.16-2.17-4.7-1.39-1.76.9-7.99,17.05-9.03,20.04-4.77,13.65-7.84,28.06-12.25,41.75-6.33,19.62-13.76,38.52-20.16,57.84-8.95,27.01-19.94,44.41-35.2,67.84-14.96,22.97-27.27,44.62-52.68,59.28-7.48,4.31-22.17,11.78-29.99,15.01-14.72,6.07-30.28,2.48-43.7-4.66-13.52-7.19-42.75-29.18-52.4-40.6-21.55-25.5-40.52-102.6-49.51-136.49-.61-2.3.3-5.81-1.07-8.43-2.71-1.94-6.12,8-6.97,9.25-26.87,38.94-70.03,73.99-112.81,94.45-35.44,16.95-70.17,34.48-105.88,51.12-17.92,8.35-38.64,20.2-58.94,22.05-17.18,1.57-25.31-11.51-36.37-21.39-14.92-13.32-36.81-27.78-42.49-47.51-5.2-18.05-4.6-45.6-4.72-64.48-.15-24.24,9.97-45.18,20.35-66.84,28.96-60.45,63.58-117.93,92.38-178.63,2.24-8.39-2.17-7.51-6.56-11.5-22.71-20.65-45.97-26.05-68.91-43.09-50.37-37.39-97.37-97.42-65.82-162.7,14.99-31.01,37.8-46.43,68.4-60.6,25.95-12.01,51.39-16.64,79.11-22.89,2.65-.6,6.86.86,7.26-2.71.01-1.41-2.55-5.26-3.57-6.49-20.1-24.33-43.74-46.21-64.91-70.09-21.08-23.79-40.62-49.22-62.59-72.41-20.98-22.15-33.46-75.2-37.83-105.17-4.5-30.81-3.03-50.35,11.34-78.41,18.07-35.28,53.4-53.31,92.05-56.95,26.72-2.52,39.48-1.97,64.73,7.25,24.28,8.86,55.2,18.71,77.49,31.51,10.46,6.01,21.13,14.35,32.56,19.44,8.04,3.58,11.78,2.93,19.42,7.83,22.73,14.57,43.52,31.88,68.15,44.6,3.75,1.94,6.74,6.31,12.13,5.37.15-9.38-3.5-18.11-4.87-27.63-2.57-17.89-2.02-37.56-4.21-54.79-.45-3.51-2.51-7.13-2.91-11.09-2.82-27.94,4.56-70.03,22.96-91.76,29.5-34.83,67.92-53.03,113.53-53.93,19.33-.38,27.6,5.72,41.69,18.28,9.78,8.72,15,19.75,22.83,29.36,1.1,1.35.9,3.45,2.48,4.54,1.1,0,5.48-10.45,6.66-12.32,20.07-31.71,36.61-58.83,66.9-82.13,11.59-8.91,29.95-13.37,44.23-7.33.73.31,11.39,8.96,12.14,9.86,2.03,2.45,12.55,21.65,13.97,25.03,2.61,6.25.97,10.55,4.99,17.52ZM953.8,383.22c25.75-22.9,47.88-51.87,68.33-79.17,1.78-2.38,5.55-4.67,7.02-6.98,1.68-2.63,1.37-5.25,2.55-7.45,1.44-2.69,5.74-5.09,8.45-10.55,6.23-12.51,20.78-47.27,21.97-60.03,1.83-19.62-3.64-55.97-21.05-67.92-11.33-7.78-43.63-16.67-57.45-17.55-60.08-3.86-126.73,24.93-175.82,57.16-23.26,15.27-47.42,35.83-67.68,55.32-3.99,3.83-7.06,8.22-11.02,12.05-13.24-1.34-9-7.37-8.89-16.02.08-6.63-1.26-13.82-1.12-21.06,1.07-54.49,14.85-150.78-21.43-194.49-2.21-2.67-12.62-13.18-15.23-13.77-12.39-2.78-26.68,2.53-36.63,9.96-18.51,13.82-32.15,31.53-44.24,50.76-14.34,22.82-26.07,43.36-34.7,68.3-1.36,3.94-3.82,7.63-4.74,11.77-2.24-.55-1.34-1.45-1.34-2.75.03-5.3,2.03-11.81,1.28-16.69-.48-3.13-3.94-6.47-3.93-8.06.01-1.28,1.88-2.74,2.09-4.99.54-5.68-1.92-21.36-4.35-26.76-5.03-11.18-15.07-19.44-25.41-25.59-29.78-17.7-61.86-4.84-90.03,8.64-7.57,3.62-14.99,10.45-23.62,11.09l-2.89,7.92c-5.17.38-10.28,4-13.76,7.68-13.03,13.76-19.14,35.7-23.33,53.71-.54,2.31-2.31,3.73-2.7,7.3-1.84,16.75,3.05,30.46,3.98,46.01.37,6.22-1.41,11.75-1.01,18.03.9,14.36,4.6,28.9,6.26,42.72.3,2.48,1.9,5.07,1.78,7.74,5.1-.56,1.8-2.76,1.56-4.52-.42-3.15-.11-6.47-1.57-9.47,2.41-.65,2.5,1.65,3.15,3.3,5.15,13.07,2.46,21.44,1.77,34.18-.15,2.75,2.04,7.55-.58,8.37-6.12,1.91-10.97-6.7-15.44-10.27-9.47-7.56-20.99-13.45-30.66-20.28-10.61-7.49-23.62-19.33-34.56-25.5-12.16-6.85-26.29-11.43-39.21-18.79-36.92-21.05-65.74-34.06-106.72-47.28-24.25-7.82-44.29-7.97-69.18-4.66-14.13,1.88-15.98,6.33-26.9,11.1-4.3,1.88-19.67,6.83-22.49,9.97-.17.19.54,1.71.06,2.53-4.13,6.96-15.19,14.1-20.11,20.95-1.97,2.75-14.67,29.36-15.08,31.92-.64,4.06.46,8.91-.03,12.97-.6,5.03-4.07,9.49-1.02,15.47l2.97-3.99c3.01,5.82-1.72,6.55-2.01,7.69-.58,2.23-.35,19.81.09,22.74,2.79,18.92,13.21,58.99,23.12,74.88,1.11,1.77,9.3,11.12,7.78,4.23-.67-3.03-6.87-10.23-8.7-14.31-2.61-5.81-6.51-16.35-8.56-22.44-1.39-4.15-7.4-26.43-5.69-28.8.58-.09,1.26.56,1.5.99,3.64,6.53,6.38,25.7,8.97,34.03,1.7,5.44,9.82,15.99,13.07,21.93,2.99,5.48,3.09,6.04,6.73,11.27,1.52,2.19,1.65,5.51,3.15,6.85,1.68,1.51,9.42,4.07,11.07,6.93,2.1,3.63-1.3,5.11,5.17,9.83,17.43,12.75,19.4,22.5,30.9,39.1,2.4,3.46,6.29,5.09,8.97,8.03,2.29,2.51,3.23,6.44,6.45,8.57-1.67,2.37-3.64,6.33-6.08,2.99-1.47-2.01.61-3.64-.34-5.51-.82-1.62-4.2-2.28-5.06-4.02-3.48-7.03-4.37-8.76-9.96-15.04-9.59-10.76-17.74-22.19-26.86-32.65-4.8-5.51-13.21-11.61-18.24-17.26-1.26-1.41-1.75-4.46-2.96-5.04-5.61-2.69.35,7.93,1.49,9.23,1.74,1.99,5.11,3.27,7.01,5.27,4.58,4.83,9.43,13.57,14.03,18.97,14.17,16.63,27.64,34.52,41.54,50.46,16.21,18.59,35.96,33.46,52.48,51.51,1.92,2.1,4.94,8.81,6.5,9.5,1.14.5,2.74.63,2.35-1.33-.3-1.53-4.51-8.89-5.62-10.39-4.41-5.96-14.59-11.94-17.26-18.74-.85-2.16,1.03-1.28,2.1-1.1,15.93,2.71,31.15,36.08,43.39,46.62,2.08,1.79,6.18,2.3,6.56,5.53.15,1.29-4.64,3.89-4.18,7.35l-5.87.13c-.73,2.52,2.24,2.31,2.76,3.21.73,1.3.02,4.18,1.25,5.77-7.02,1.24-13.96,1.25-21.05,2.47-33.43,5.78-82.61,19.76-111.49,37.51-3.76,2.31-17.61,12.26-19.96,15.05s-5.42,9.65-7.3,12.7c-3.27,5.33-9.45,13-11,19-8.54,33.07,4.91,62.67,25.8,87.76,7.83,9.41,19.71,17.87,26.99,27.01,1.55,1.95,1.5,4.47,2.68,5.58,2.41,2.26,11.68,4.91,15.61,7.13,17.95,10.12,36.51,21.37,54.03,31.97,6.31,3.82,21.71,15.91,25.08,21.91s-1.04,6.25-.31,11.83l5.88,2.59c-1.34,1.63-3.26,2.77-4.4,4.58-16.14,25.61-30.78,53.48-45.38,80.62-18.05,33.55-34.82,66.85-49.69,101.22-3.75,8.67-9.49,15.51-13.73,26.4-.5,1.29-2.3,1.43-2.59,2.17-4.1,10.57-6.49,46.98-6.28,59,.15,8.5,7.44,35.79,12.56,42.53,6.2,8.17,41.17,38.27,50.2,43.8,8.3,5.08,16.3,5.04,25.76,3.12,5.76-1.17,10.44-6.99,17.56-4.93-.97,1.76-4.6,3.44-6.43,4.05-3.2,1.07-23.55,4.83-23.54,7.44,2.28,3.77,6.87,1.47,10.61.63,19.52-4.37,37.44-14.25,55.31-22.69,11.72-5.54,20.85-10.34,32.17-16.83,3.57-2.05,15.17-5.95,15.87-9.13.34-1.53-.02-1.7-1.49-1.5-3.74.71-6.29,6.68-10.48,4.52,2.95-2.26,22.92-16.52,24.99-14.5.6,2.49-7.76,8.69-.96,7.57,5.42-.89,2.56-3.13,3.45-4.52,8.33-13.07,43.53-24.93,58.18-33.88,36.57-22.36,69.89-52.93,87.06-92.94,3.79-8.83,6.62-19.16,10.36-28.14,9.39-.73,6.7,5.5,8.79,10.54.87,2.1,3.48,2.51,3.68,4.29.14,1.29-2.24,3.59-2.6,6.56-3.01,24.8,10.51,68.37,18.31,92.74,12.08,37.75,21.15,60.11,52.21,85.79,8.56,7.08,19.94,16.22,30.53,20.47,29.06,11.68,66.99-15.09,84.95-37.01,52.08-63.56,63-129.92,88.3-204.7.94-2.78,7.77-21.56,8.73-22.27.28-.21,6.07-2.37,6.58-2.46,6.61-1.12,5.58,4.56,9.44,7.45,3.33,2.49,9.9,5.11,13.92,8.08,8.89,6.57,27.97,27.22,33.27,36.73,7.61,13.67,12.51,30.92,20.59,44.41,1.59,2.66,4.88,6.08,7.71,7.33,1.75,0,7.15-6.04,8.32-7.72,21.68-31.17,13.5-63.54,17.26-97.74.29-2.63,2.31-11.77,4.64-12.42,1.3-.37,9.19.76,10.27,1.35,1.19.66,2.6,4.56,4.01,5.99,7.19,7.27,18.6,11.44,27.3,16.7,12.11,7.32,19.73,12.45,32.45,18.55,51.41,24.67,83.81,34.06,141.68,34.09,24.28.01,60.49-23.08,74.01-42.91,21.09-30.93,23.03-57.74,14.27-94.15-10.84-45.04-35.98-71.26-67.68-102.32-20.48-20.06-41.37-39.12-62.55-58.45-4.5-4.11-25.05-17.28-17.03-25.08.62-.6,7.53-4.63,8.29-4.78,2.77-.56,5.04.84,7.72.88,43.95.65,98.83-13.09,137.43-34.65,8.11-4.53,17.4-10.89,18.11-20.91,1.24-17.52-22.12-48.79-31.18-63.79-10.75-17.79-18.98-36.83-34.25-50.74-33.48-30.47-107.05-63.56-151.36-74.65-19.1-4.78-39.13-5.09-57.94-10.06-3.24-.86-7.94,1.05-10.33-1.67-1.03-1.17-3.64-8.64-3.65-10.25-.04-4.84,9.78-7.4,13.63-9.9,14.28-9.26,28.12-22.8,41.58-33.42,8.46-6.67,20.06-13.13,28.16-20.34ZM1063.13,506.58c-.53-.76-14.65-6.18-17.06-7.46-3.51-1.86-6.39-5.41-9.94-7.06-4.3-2-10.16-2.22-14.5-4.51-3.24.12-.48.99.19,1.73,5.92,6.45,19.15,10.53,27.18,14.91,12.04,6.56,24.36,13.97,35.03,21.97,6.46,4.84,12.34,12.22,20.09,14.4,1.14-.94-12.68-13.51-13.95-14.54-1.47-1.18-3.19-1.46-4.53-2.47-7.22-5.42-15.05-13.21-24.51-14l2-2.97ZM69.13,787.58c-1.39-.12-2.91-.62-3.95-1.56-5.69-5.15-14.26-15.32-19.56-21.44-4.82-5.57-8.36-12.66-14.48-17.01.78,9.68,9.18,15.72,14.97,22.52,4.8,5.64,9.58,13.75,16.49,17.5,2.01,1.09,5.38,3.36,6.52,0ZM82.86,798.85c-.89-.72-7.45-2.58-7.72-2.28-.34,1.9.3,2.72,1.42,4.07.52.62,11.15,9.84,11.83,10.21,2.83,1.57,5.49,2.06,8.73,1.71-.2-7.69-7.07-7.16-11.98-10.53-1.33-.91-1.58-2.62-2.28-3.18ZM116.99,815.72c-.69-.64-3.6.06-4.86-.14,1.61,2.45,7.68,4.58.98,5.46v2.05s31.02,16.47,31.02,16.47c.9-6.11-2.87-4.86-5.89-6.6-3.97-2.29-17.53-11.15-20.12-13.91-1.02-1.08-.78-3-1.13-3.33ZM273.14,1173.56l20.27-8.22,3.71-3.27c-1.53-2.11-1.79-1.36-3.69-.72-2.8.95-6.35,3.38-9.3,4.71-3.77,1.7-11.34,1.69-10.98,7.51Z"/><path d="M564.04,605.5c2.07-6,6.17-6.83,11.63-3.96,3.34,13.59,8.8,29.43,7.51,43.57-.96,10.53-8.75,18.63-13.88,27.12-5.55,9.17-5.63,14.12-15.82,21.18-19.64,13.61-40.15,13.66-57.9-2.79-12.38-11.47-27.04-31.01-25.43-48.54s8.35-29.83,18.57-42.43c9.09-11.2,16.94-12.16,30.9-11.07,17.1,1.33,29.06,11.21,44.41,16.92ZM491.47,664.23c6.73,9.42,22.08,20.29,34.18,21.32s24.07-5.44,31.11-14.85c2.35-3.14,12.51-19.94,13.16-22.84,1.82-8.08-1.29-12.31-2.56-19.03-1.92-10.19,2.04-12.95-9.71-18.29-12.8-5.82-33.14-14.06-46.97-11.91-2.54.4-5.19,2.27-7.29,3.71-6.66,4.55-19.05,22.85-20.22,30.8s3.47,24.34,8.29,31.09Z"/><path d="M142.12,510.56c-2.48-3.29-6.44-4.23-9.48-7.01-3.88-3.55-7.4-9.67-11.47-13.53-1.42-1.35-3.47-1.51-5.07-2.93-.52-.46-3.61-4.15-1.98-5.03,4.4-2.37,7.87,5.03,10.07,6.94,4.23,3.66,11.38,8.6,14.96,13.04,1.42,1.76,2.77,6.15,2.96,8.53Z"/><path d="M223.13,1194.57c-7.63,6.24-17.32,9.24-25.89,13.6-5.62,2.86-12.77,8.22-18.16,10.84-2.26,1.1-6.36,1.24-8.95,1.54l26.64-14.85,26.36-11.13Z"/><path d="M18.13,325.56c-2.51,2.64-8.03-11.88-3.49-13.99l3.49,13.99Z"/></svg>`,

  // Horse
  `<?xml version="1.0" encoding="UTF-8"?><svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1543.36 1571.49"><defs><style>.cls-1{fill:#fff;}</style></defs><path d="M367.65.95c2.16,4.2,1.55,9.31,3.42,13.58,6.34,14.47,24.97,35.92,33.58,52.4,6.99,13.37,10.88,28.27,19.05,41.08l-9.8,12.65,48.66,20.55-.08,4.93c-9.15,12.41-14.17,1.47-22.48-2.57-33.41-16.25-86.12-27.59-118.49-4.31-2.24,1.61-4.47,1.42-3.56,5.41l23.99,2.02c1.41,1.39-4.83,19.9-6.46,21.54-2.63,2.64-22.92,8.22-28.13,12.34-6.02,4.76-5.51,10.39-18.42,18.09-38.79,23.14-85.21,35.27-115.96,69.99-20.31,22.94-35.55,48.34-53.32,72.66-38.35,52.49-108.39,135.76-107.66,202.28.09,7.87,3.3,19.65,3.6,28.13,2.38,68.23-7.79,125.42,53.54,170.87,38.03,28.19,71.12,23.55,113.39,7.61,98.85-37.28,136.02-125.32,197.45-202.47,19.75-24.81,36.59-36.33,59.95-56.03,6.9-5.82,16.74-18.67,22.84-23.15,3.05-2.24,8.64-1.54,10.25-3.74,1.74-2.39,1.09-16.92.85-21.11-.59-10.05-6.68-30.33-6.03-38.06,1.27-15.19,9.51,2.92,11.07,9.02,8.81,34.44,11.38,110.92,13.05,148.94,3.08,70.2-17.43,134.73-18.15,204.17-.43,41.58,2.66,83.64.04,125.88-.84,13.62-5.16,29.79-5.95,44.05-3.31,59.63,14.11,116.99,18.06,175.9.88,13.1-1.02,26.93-.06,40.06,1.76,23.84,9.69,48.22,11.94,72.05,2.35,24.88.5,52.91,2.06,77.94,1.82,29.4,6.61,58.3,6.1,87.99-.05,3.13-2.57,5.79-2.12,9.04,3.66-.62,3.37-4.1,4.25-6.73,2.4-7.11,6.68-21.43,7.51-28.49,2.36-20.08-1.99-43.11.73-63.27.94-6.93,19.11-58.01,22.44-61.55,1.81-1.92,4.55-2.99,6.79-1.72,3.62,2.05,14.33,36.89,17.45,43.52,15.52,32.94,41.92,44.45,77.79,40.27,14.9-1.74,16.78-17.39,20.38-29.61,12.33-41.89,16.53-86.3,25.05-128.94.54-2.72,2.25-10.37,6.43-9.44l7.01,9.02c4.71,63.82,10.02,132,6.15,196.02-2.16,35.77-13.25,71.33-10.17,107.6,12.31,2.27,19.02,12.59,30.09,13.32l-3.91,9.01c9.19,3.89,49.02,36.14,39.64,46.75-11.41,5.26-18.98-8-30.62-9.7l-5.13,11.92h8.02s-1.88,13.15-1.88,13.15c-11.93,1.4-24.53,2.98-36.19,5.79-10.83,2.61-52.34,20.64-59.07,11.16-6.84-9.63,19.83-13.57,24.3-15.91,2.05-1.07,3.8,1.07,2.86-4.17-17.56-3.21-36.85,5.84-50.93,15.96l-20.11-7.86c.39-32.39,13.01-66.75,45.95-78.21,7.87-2.74,43.17-6.26,44.81-11.17-.71-24.96,5.58-49.86,8.02-73.98,5.39-53.44,6.13-120.23,2.36-173.86-.24-3.42.2-6.61-3.12-8.88-9.31,24.1-10.36,50.68-16.41,75.56-2.22,9.14-11.12,39.77-16.53,45.47-10.63,11.19-57.32,2.99-70.79-3.25-18.56-8.6-40.62-43.07-41.21-63.77-3.74-3.46-10.04,11.9-10.94,14.03-14.56,34.23-3.37,54.24-7.2,84.8-1.96,15.62-11.57,36.52-14.9,53.09-1.87,9.3-7.29,41.14-3.94,48.08l56.03,33.95.08,22-17.04,13.24c3.85,6.89,9.19,9.86,3.46,18.34-7.33.84-11.92,7.32-17.47,9.5-12.97,5.1-82.73,2.97-98.99.94-6.53-.82-23.55-1.79-24.76-9.28,9.14-17.48,17.27-37.65,26.66-54.79,7.81-14.27,29.06-26.5,43.65-34.37,2.78-1.5,6.07-1.07,8.99-1.94,3.54-5.74-.15-11.97.26-18.64,4.41-71.75,2.39-138.09-3.86-209.95-2.45-28.21-12.21-59.59-13.21-86.36-.48-12.92,2.22-27.76,1.2-41.62-3.67-49.97-15.82-97.47-15.87-148.11-.07-62.39,6.03-126.83,6.08-189.96.04-49.53,9.28-89.86,15.49-138.28,6.35-49.52-5.38-99.03-5.68-148.68-2.97-3.33-39.14,30.6-43.01,33.95-59.23,51.26-90.91,114.7-140.94,173-36.6,42.65-129.78,101.11-186.98,85.14-55.23-15.43-96.05-67.95-96.94-125.18-.4-25.43-.78-51.94-1.83-78-.46-11.34-4.3-26.88-4.15-37.82.32-23.67,32.98-87.76,47.6-108.55,8.86-12.6,20.59-22.89,29.31-34.67,23.13-31.26,43.97-75.91,70.18-103.79,3.04-3.24,8.07-3.53,10.9-7.11.49-6.05-6.99,1.37-10.71.6-2-.42-5.86-4.25-5.26-6.55l41.96-31.05c.11-4.24-7.26-.71-9.08-.07-15.19,5.32-34.38,20.15-49.75,18.12-4.58-2.59,4.86-11.2,7.42-12.64,14.29-7.98,36.82-17.39,52.67-25.14,21.86-10.68,26.97-5.99,43.43-27.59,1.31-1.72,12-7.2.54-6.45-25.27,1.65-54.08,12.63-82.12,13.87-15.08.67-28.36-1.94-43.08-4.1-.87-5.43,2.3-7.82,6.15-10.85,27.56-21.73,71.39-39.11,106.34-41.61l41.42-12.53-19.38-18.57c-32.15-1.98-65,3.6-96.49-4.52-2.14-17.21,20.49-15.37,33.51-19.34,13.64-4.17,33.11-13.92,47.47-12.68,4.47.39,3.77,4.87,6.49,6.05,15.84,6.91,36.77,9.88,54.2,19.28,6.86,3.7,18.52,10.01,14.22,18.76h8c-2.26-13.52,6.33-29.42,7.78-43.2,2.11-19.96-1.54-43.83-7.78-62.77,4.83-2.12,11.61-1.09,15.96-3.06,2.62-1.19,4.28-5.88,7.47-6.7,3.97-1.03,7.56,1.77,11.42,1.62,7.91-.3,17.12-9.48,26.87-5.61ZM343.92,12.69c-6.33-5.88-11.35,14.01-9.97,17.98,2.98-.77,11.17-16.86,9.97-17.98ZM321.92,34.67l-.98-15.96c-4.65,3.54-4.82,13.6.98,15.96ZM395.9,116.67c-9.44-26.79-19.31-54.55-38.97-75.95-5.57-.17-28.97,67.84-28.98,77.95,22.43-5.03,45.88-5.61,67.95-2ZM385.88,68.68c-9.19-.64-.05,6.12,1.13,9.89,1.24,3.97.41,8.47,1.82,12.18,1.48,3.89,11.39,24.59,13.34,26.66,2.68,2.83,2.94,4.13,7.72,3.26,1.63-1.5-13.28-24.68-14.98-28.18-1.39-2.86.6-5.73-.18-7.87-1.29-3.51-9.49-9.57-8.85-15.93ZM176,102.68h46.98c4.69,0,1.25-7.66-2.2-9.8-9.88-6.15-38.31-.64-44.78,9.8ZM275.94,128.68c.68-3.65-2.19-6.63-5.97-5.99v3.97s5.97,2.02,5.97,2.02ZM287.96,136.65c11.05,6.62,21.72-13.88,5.91-11.06l-5.91,11.06ZM277.96,146.66c-5.92-10.01-23.18-5.42-31.98-.97,10.64,1.73,21.31,2.4,31.98.97ZM207.99,152.7c-29.28,4.15-57.42,16.49-81.92,32.98,5.38,8.49,10.42,3.12,16.98,3.01,18.63-.31,37.01-1.42,55.44-4.51,5.61-.94,34.67-6.86,37.53-8.46,3.4-1.91,1.09-3.55-1.49-4.58-4.22-1.68-27.19-7-28.35-8.64l1.82-9.8ZM259.95,156.68c-6.38,2.69-12.85,1.27-19.02,1.98-3,.35-6.09,1.61-2.95,4h21.99s-.02-5.98-.02-5.98ZM291.94,156.69c-5.9.28-16.11-2.6-15.97,5.98,5.9-.28,16.11,2.6,15.97-5.98ZM317.93,156.7h-11.97s0,3.97,0,3.97l11.97-2.01v-1.96ZM285.96,178.7c-18.03-.52-38.68.57-45.97,19.97,1.85,1.71,42.54-14.09,45.97-19.97ZM551.75,1512.61l1.83-6.68c-13.7-9.82-28.12-23.44-45.71-25.23,5.38,11.04,22.87,14.56,20,27.98,7.35-.35,8.42-5.75,15.89-.8,2.51,1.66,1.32,6.86,8,4.73ZM707.77,1482.7c-22.85-2.69-64.54-.64-82.9,14.03-8.97,7.16-17.2,18.41-19.03,29.94,11.31.18,17.05-8.84,25.34-13.63,11.56-6.67,45.82-28.84,56.15-30.01,4.65-.52,8.82,1.47,13.41,1.74,2.17.13,7.58,1.26,7.04-2.07ZM495.87,1486.7l-13.99-2.01c-2.49,7.99,19.74,7.42,13.99,2.01ZM701.79,1506.65c6.92.22,13.7,3.72,20.38,4.66,19.32,2.73-8.34-15.5-15.43-10.82-1.16.77-5.52,5.61-4.96,6.15ZM451.9,1524.67c7.4,5.24,34.71-13.64,33.86-18.74-11.52-14.36-32.03,5.3-33.86,18.74ZM509.85,1506.69c-10.43,2.5-14.25,13.45-17.98,21.97l15.09-13.88,2.89-8.09ZM705.78,1514.71c-6.57-7.08-30.05,1.21-37.97,5.07-2.88,1.41-5.01-.43-4,4.89,11.43-.02,25.33-1.74,36.43-4.61,1.79-.46,8.83-1.79,5.53-5.35ZM671.79,1514.7c-5.13-.39-11.74.66-13.98,5.96,3.72-1.23,11.86-2.64,13.98-5.96ZM517.87,1530.69l-1-12-9,11.97,10.01.03ZM701.77,1534.7c-4.89.07-12.06-1.66-13.98,3.96,3.86-.14,12.67.76,13.98-3.96ZM529.86,1542.7c-8.79.68-17.74-.64-26.48-.73-2.63-.03-4.4-1.76-5.5,2.69,10.01-2.29,24.8,7.63,31.99-1.96ZM471.88,1548.7c-8.17-2.16-16.05-2.47-23.98.97,2.29,3.36,5.44,2.83,8.88,3.12,2.22.18,20.59,1.1,15.1-4.08Z"/><path d="M579.84,142.72c-2.04,4.64-21.66,22.46-18,25.95,15.64-.77,27.35,10.61,39.97,18.01l-21.83-27.27c-.49-2.83,7.96-10.8,10.85-10.8,9.35,0,49.51,55.94,55.79,66.26,2.01,3.3,1.97,7.5,3.65,10.35,14.36,24.48,29.48,48.79,39.5,75.46l-15.96-27.02c-3.45-2.94-1.96,4.46-1.58,5.59,2.3,6.94,8.71,15.11,12.36,21.63,2.04,3.65.61,10.67,7.19,9.82l1-6.01c13.36,21.41,24.21,44.92,37.37,66.61,6.15,10.13,43.71,61.14,41.49,68.15-1.99,4.63-12.67,2.01-11.74,8.03,8.42,14.97,17.34,32.15,24.22,47.82,12.05,27.41,21.25,57.24,33.85,84.14,13.93,29.75,33.94,56.4,47.72,86.26l-6.94-1.06-34.17-55.82c-14.32-5.14-13.03-20.13-17.89-32.1-6.97-17.15-37.59-77.37-48.98-89-1.91-1.94-2.59-3.8-5.94-3.03-2.09,8.95,2.04,15.83,3.53,23.45,5.43,27.81,16.75,57.98,26.95,85.04,10.19,27.03,22.45,53.32,33.04,80.17-1.27,4.87-3.23,7.47-8.58,7.53-4.83.06-4.42-9.5-10.96-8.19-1.4,9.82,2.93,19,1.82,28.78-3.11,27.38-16.79-5.85-20.79-14.82-7.7-17.28-13.6-37.45-21.56-54.43-2.82-6.02-12.56-26.25-15.64-30.36-3.38-4.5-15.17-8.22-12.17.13,4.64,12.91,17.46,36.89,19.42,48.67.7,4.18-1.39,7.85-1.09,12.02-2.23,2.87-24.36-23.04-24.01-27.99-10.81,1.38-3.14,6.68-1.36,12.39,4.57,14.73,11.95,32.78,14.5,47.49s-3.36,20.88,8.46,31.98,28.9,22.76,43.36,28.18c37.73,14.15,105.1,11.68,145.91,10.03,87.43-3.53,152.84-33.39,234.97-57.11,44.06-12.72,92.24-26.26,136.71-37.24,15.26-3.77,19.5-5.5,34.38-1.87,5.07,1.24,20.44-.67,9.94,10.19-6.72,6.95-11.42.08-17.03,4.93l13.95,9.04c.83,2.91-3.3,5.4-3.33,6.96-.02.95,5.77,8.91,6.34,8.96,6.45.64-3.91-8.7,2-9.92l14.99,14.97c-6.79-.33-10.65-1.24-16.11,4.14,8.35,21.23,29.04,38.55,31.99,61.41,16.84,11.19,27.33,33.78,38.03,50.96,39.87,63.98,75.72,139.62,121.87,197.65,6.18,7.77-2.75,10.5-9.45,8.4-19.29-25.12-37.75-50.67-51.74-79.2-1.93-3.93-4.52-15.31-5.07-15.94-3.67-4.19-8.7-4.37-14.01-15.03-28.12-56.47-64.01-102.27-94.37-157.61-2.63-4.8.39-11.05-11.12-8.79,3.67,11.79,13.55,25.99,16.92,37.13,1.09,3.6.89,4.56-2.91,5.88l-47.53-107.52c-11.73-17.92-24.87-10.59-42.87-5.9-85.78,22.36-169.96,51.19-255.48,74.41-45.38,12.32-94.35,12.97-140.85,12.92-41.85-.04-86.56,2.3-123.29-20.65-32.84-20.53-105.49-91.91-121.41-126.54-26.65-57.98-50.09-117.88-75.68-176.29-20.49-46.77-34.38-81.41-47.07-130.91-5.94-23.19-13.63-45.96-18.54-69.45-10.95-11.98-24.96-4.85-38.92-4.07,1.08-13.39,9.27-13.28,16.63-18.34,29.95-20.57,66.44-47.52,84.61-79.36,2.04-3.57,8.39-14.46.13-13.95-15.78,7.31-33.33,10.33-49.37,16.7-22.38,8.89-35.88,26.7-60.84,28.89l-2.92-4.62c.85-2.33,1.98-4.53,3.86-6.2,5.52-4.92,33.73-18.61,41.88-22.1,21.18-9.07,44.54-14.65,66.01-21.96,5.86-2,10.17-8.15,16.86-7.17,12.19,1.79-1.03,13.47-1.01,17.17l6.09,4.99ZM623.81,194.66c-.4-6.76-6.61-12.53-11.97-15.99-1.14,4.16,1.4,5.47,2.94,8.05,1.2,2.02,5.7,9.07,9.03,7.93ZM613.17,215.28c-4.37-5.04-24.9-22.6-30.67-26.28-4.27-2.72-19.96-11.9-23.78-6.36l5.61,23.56c18.11,3.14,34.11,5.98,48.49,18.44,4.17-2.64,3.09-6.19.35-9.35ZM549.82,182.68c-4.58-1.14-3.27.86-4.55,2.51-7.36,9.48-12.82,23.17-21.32,32.51,7.77,2.59,11.1,15.93,17.92,11.96-2.98-9.69-8.85-13.7-3.81-24.76l11.71.96,4.02-2.31-3.97-20.87ZM597.82,188.69c-3.66-.47-5.83-.1-7.95,2.99,2.56,2.43,4.18,5.77,7.95,4.99v-7.98ZM639.79,216.68c.59-.64-6.22-12.47-7.19-13.79-1.81-2.47-3.05-4.96-6.78-4.19,3.78,6.55,5.93,15.69,13.97,17.98ZM552.89,218.67c-6.15,1.13,2.21,19.97,3.96,19.97,9.06-4.64,5.38-21.68-3.96-19.97ZM615.81,232.68c-11.76,4.5-21.61-9.5-33.08-11.89-2.73-.57-14.26-1.97-12.84,2.83,4.62,15.54,22.75,28.43,32.97,41.03,69.1,85.24,102.79,183.61,146.19,281.76.87,1.97,2.17,6.49,4.7,6.26-6.91-50.13-30.22-97.86-47.93-145.02,2.94-3.77,3.21-.65,4.48,1.58,5.05,8.85,7.45,20.85,11.72,30.21l9.75,15.22c-1.99-12.31-8.09-23.98-11-35.97-9.16-37.77-11.14-50.11-31.33-84.66-5.36-9.18-11.52-19.79-18.65-27.35-4.35,6.41,3.95,9.82,4.98,15.02.69,3.49-.52,7.5.5,11.5.29,1.15,15.9,22.41,6.16,15.84-5.43-3.66-8.4-17.23-11.65-24.35-6.56-14.35-37.63-77.72-49.06-83.01-1.94-.9-4.86.69-5.9.04v-9.05ZM595.83,362.68c-6.55-14.07-10.18-29.73-16.9-44.09-7.48-16-20.46-31.31-28.7-47.26,12.25-22.82-23.77-26.7-32.32-41.71l-2.92-.86-13.13,14.88c7.6,10.45,10.06,45.22,16.96,53.09,2.46,2.81,7.52,1.47,10.97,3.02,5.16,2.31,12.88,15.39,20.1,17.89l46.95,63.03c2.83-5.44-.56-12.2-1.01-17.99,4.51,9.68,3.98,13.39,6.95,22.04,7.93,23.05,31.04,52.14,44.65,73.33,11.49,17.91,16.15,34.19,33.36,48.63,2.25,1.88,3.25,4.85,7,3.98-8.51-17.85-16.83-35.93-25.02-53.95-5.93-13.05-17.69-32.64-20.48-45.51-.9-4.13-.46-8.37-.49-12.53l-4.99,1.37-2.92-2.55c3.65-10.36-6.09-15.44-12.01-23.88-2.22-3.17-7.63-16.03-8.34-16.63-1.19-1-7.1.08-10.27-.73-2.71-.7-3.82-4.57-7.44-3.56.15,3.29-.27,6.7-.01,9.99ZM665.78,264.68c.52-3.45-.44-6.26-1.54-9.44-1.18-3.4-16.46-30.57-20.42-26.55,4.85,13.1,12.33,25.77,21.96,35.99ZM567.84,252.66c-1.75-3.46-3.17-8.82-7.99-7.97-.14,2.92-.62,5.31,1.94,7.04l6.04.93ZM657.79,276.67c1.04-1.09-3.07-14.09-7.98-11.98-1.63,1.82,2.78,13.78,7.98,11.98ZM673.79,294.66l-5.99-15.14c-6.2-1.12-12.15,2.54-4.64,6.79l10.63,8.35ZM597.83,306.66c-2.52-4.07-3.38-9.01-5.97-13.01-1.98-3.06-9.88-12.26-14.01-12.96,3.01,8.21,8.71,16.07,13.47,23.45,1.78,2.76,4.17,4.29,6.51,2.52ZM615.84,298.68c2.04-6.42-8.23-18.78-14.04-17.24-11.47,3.05-2.51,15.89.94,23.31,27.74,59.59,62.7,120.06,93.4,178.56,24.47,46.61,46.19,97.78,77.26,140.7,1.79,2.48,2.09,5.56,6.33,4.64,1.59-1.83-9.81-35.4-13.9-36.85-3.14-1.11-8.64,3.33-10.53-3.7-18.27-44.26-29.24-90.98-49.98-134.07-6.08-12.64-13.99-28.3-20.69-41.22-8.4-16.2-24.78-30.26-22.85-50.16l-7,.07c-1.18-3.67-1.4-7.26-3.3-10.75-5.44-10.01-18.02-23.72-22.26-33.92-1.79-4.3-.63-15.39-5.5-21.35l-7.9,1.97ZM691.78,672.67c-13.75-36.13-31.75-70.53-46.94-106.02-25.45-59.47-47.52-124.6-78.66-181.31-3.79-6.9-18.13-23.89-17.48-29.64.3-2.6,4.09-3.43,2.39-9.07-.82-2.75-25.37-34.37-27.22-31.95,3.61,25.49,12.32,50.19,23.96,73.02l5.99-3.02c5.24,38.44,26.08,70.05,40.39,104.62,22.95,55.45,40.93,114.73,75.6,164.37l21.96,19.01ZM721.77,366.67c-8.25-17.75-16.07-36.26-27.96-51.99-.49,3.44.4,6.27,1.53,9.45,2.54,7.15,11.07,27.29,14.73,33.27,1.28,2.09,9.55,11.6,11.7,9.28ZM603.8,336.68l-8.98-17.96c-4.71,3.62-2,2.96-.19,6.13,2.23,3.9,5.31,9.47,9.16,11.83ZM753.74,418.68l-19.63-33.34-6.33-4.65c-2.34,11.54,8.76,16.66,13.35,22.6,4,5.18,4.6,13.76,12.6,15.39ZM599.79,392.69l-3.94.96,7.96,11.02-4.02-11.98ZM632.25,476.05c-1.9-1.57-19.45-36.62-23.58-43.22-6.73-10.75-16.18-20.07-20.86-32.14-2.51-.55-2.3.9-2.06,3.03,1.16,10.6,23.47,63.1,29.11,76.91,6.57,16.08,14.97,31.69,20.98,48.02l7.95-27.97,7.97,21.04,40.02,58.95c.1-15.59-4.25-29.92-11.58-43.39-12.71-23.36-28.82-45.46-47.94-61.23ZM746.55,449.99c-3.5-7.6-5.06-15.85-8.01-23.09-.75-1.85-2.32-6.46-4.75-6.21l3.99,39.99c6.93-1.09,14.35.01,11.96-8.67-.42-1.53-2.96-1.53-3.19-2.02ZM749.73,432.68l-3.95.97c12.39,17.94,12.42,42.5,29.95,57.02l-26-57.99ZM681.78,470.67c1.98-2.24-7.43-22.18-9.6-25.38-1.74-2.56-2.27-5.46-6.37-4.6-2.35,2.74,7.23,21.86,9.6,25.38,1.73,2.57,2.27,5.46,6.37,4.6ZM651.83,538.68c-2.86,10.1,20.79,75.63,24.97,75.96,4.39.34,1.29-5.41.95-6.88-4.27-18.52-13.88-44.95-21.39-62.63-1.05-2.47-1.08-5.9-4.53-6.45ZM727.76,706.67c.62-8.29-.62-16.4-2.57-24.41-9.92-40.59-28.22-92.84-54.52-125.46-1.89-2.34-3.25-4.84-6.86-4.12,2.05,15.18,33.25,78.87,29.76,88.75-1,2.83-5.63,2.65-5.95,4.5-.8,4.61,21.87,45.44,26.51,51.4,3.41,4.39,7.13,10.32,13.64,9.34ZM733.76,636.67l-25.07-67.9-12.89-6.08c.46,22.21,10.11,43.79,24.02,60.95,3.27,4.04,8.86,11.86,13.95,13.03ZM769.78,574.69c-.37,12.92,7.35,25.98,10.97,37.99,4.05,13.42,3.12,29.29,14,39.96,4.29-2.97,2.46-3.82,1.58-7.51-4.66-19.5-13.96-43.64-21.64-62.38-.98-2.39-2.07-8.01-4.9-8.06ZM791.74,694.67c.22-3.58.06-7.14-.25-10.73-3.03-35.07-22.05-49.77-38.56-77.42-5.87-9.83-8.94-21.5-17.13-29.84,1.03,6.41,3.24,15.53,5.54,21.44,9.7,24.88,28.76,62.15,41.33,86.65,1.56,3.05,4.56,10.92,9.08,9.91ZM725.75,594.67c.13-4.38,1.11-10.45-3.96-11.99l2,11.99h1.96Z"/><path d="M1311.54,700.67c3.26,3.21-3.87,41.27-2.08,48.68.64,2.68,9.53,2.63,10.07,7.31h-10.01c-2.94,17.51,7.67,32.84,11.45,47.57,8.59,33.47,13.32,68.25,22.38,101.65-1.33,8.98-3.76-9.17-6.84-9.16-6.61.03.83,13.72,1.38,16.76,4.57,25.29,5.8,53.73,9.36,80.46,6.8,51.05,14.75,102.11,14.33,153.82-4.34,7.95,2.86,46.18-10.73,42.7-3.06-1.35-4.68-3.55-5.29-6.84-2.06-10.97-.99-25.85-2.34-37.67-11.43-99.6-.39-191.03-31.64-288.33-.84-2.63-.05-6.24-4.04-6.94-5.14,18.48,2.4,37.06,3.95,55.03,2.19,25.39,7.47,63.92,7.26,87.63-.12,13.6-4.67,30.29-5.31,44.26-4.88,106.62-17.34,213.43-17.99,320.17-.03,5.21,2.22,9.99,2.15,15.81-.2,18.27-8.9,33.53-15.78,49.84,1.52,8.09,50.61,20.07,39.43,39.01l-16.68-1.75-1.06,5.03c9.15,2.07,18.72,6.14,27.56,8.43,5.59,1.45,37.28,2.41,23.46,14.58-4.13,3.64-25.18,1.5-33.53,4.45-23.91,8.44-40.13,15.17-68.3,11.68l-76.1,15.96c-18.78-1.29-14.11-19.55-10.44-32.53,5.69-20.12,19.23-33.31,33.4-47.57-6.3.23-10.28,7.28-15.54,9.43-16.16,6.6-46.32,14.24-64.38,19.58-7.43,2.2-15.59,10.09-15.77-5.66l15.72-19.36c-6.16-5.38-37.18,27.03-44.68,25.65-12.12-2.24-7.79-29.71-4.33-37.71.92-2.12,18.5-25.98,21.03-28.96,8.68-10.22,32.46-28.98,44.88-33.1,5.89-1.96,17.35-.7,18.82-5.17,5.53-16.78-10.09-72.37-17.33-90.11-4.59-11.24-13.62-15.7-8.52-30.45-1.74-.4-3.59-1.5-5.29-1.66-12.88-1.17-65.24,15.09-82.08,18.94-53.72,12.3-108.14,29.5-161.9,40.04-13.02,2.55-27.32.82-39.01,2.98-6.32,1.17-14.51,7.1-21.01,8.98-20.97,6.06-48.46,12.09-70.01,15.96-12.41,2.23-26.24,5.5-38.35,2.51l-.03-5.91,13.88,1.83,1.19-5.98c17.52,2.11,33.85-5.78,50.4-9.36,8.2-1.77,17.6-1.76,26.17-3.82,15-3.61,32.99-14.22,45.78-16.2,10.69-1.66,21.56.52,32.62-1.37,10.15-1.73,21.63-8.13,31.45-10.54,13.64-3.35,29.67-4.28,42.51-7.48,19.03-4.73,39.07-14.38,57.77-18.21,11.49-2.35,23.94-1.48,34.62-3.36,33.71-5.93,52.31-16.22,90.12-19.66,9.77-.89,22.81-7.78,28.29-8.05,29.46-1.46,60.42-.72,89.77-5.85,6.35-1.11,10.4-10.47,16.86-.78l-3.74,47.73c8.28,43.34-12.6,90.33-11.97,131.98.09,5.71,2.68,15.57,6.02,20.26,8.39,5.22,19.04-19.43,20.67-25.51,4.97-18.49.53-48.24,1.26-68.72,3.74-104.24,14.37-209.69,22.15-313.85,2.87-38.36-9.19-96.15-12.03-136.1-2.42-34.05,1.34-62.53-3.86-98.12-2.33-15.96,4.07-11.79,5.53-16.08s2.99-36.63,2.19-41.67c-.68-4.32-5.49-7.44-4.02-13.81l16.12-3.3ZM1351.5,1144.67c2.77-27.27,1.74-55.57-2.23-82.74-.75-5.12-.93-14.88-5.73-17.25l2.01,68.97,5.94,31.02ZM1249.76,1430.47c-8.71-40.13,6.93-81.16,9.77-120.82,1.17-16.37,3.02-50.55,1.75-66.12-.3-3.74-1-11.21-4.99-12.57-14.15-2.45-28.09,4.52-41.75,5.68-14.85,1.27-36.92-6.88-38.99,11-3.57,30.97.84,63.38.14,94.09-.21,9.37-10.4,38.46-1.08,42.92,4.61,1.19,2.52-4.53,6.18-5.75,15.44-5.16,13.73,23.57,18.36,33.2s18.82,11.41,8.42,24.55c27.41-9.03,49.86-3.24,75.97,6-8.25-10.25-21.28-12.89-33.78-12.19ZM1165.59,1276.68v-31c0-.39-2.45-7.06-3.12-7.13l-18.87,6.15,21.99,31.98ZM1155.59,1380.69c-5.16.4-13.46-2.26-15.98,3.97,4.37-1.29,17.58,3.69,15.98-3.97ZM1183.58,1402.67l-5.97-11.98-.05,10.81,6.02,1.17ZM1147.59,1394.69l-13.98,3.97c4.23-1.11,15.64,3.45,13.98-3.97ZM1141.59,1412.69c-12.38-.67-23.81-.99-29.96-13.18l-2.65-.57c-5.47,2.09-25.6,22.66-21.36,27.73,8.04.28,7.19-12.24,15.98-9.97l-6.01,13.97c16.25,4.95,38.37-.57,43.98-17.98ZM1175.59,1424.7c-8.07-.41-17.05,1.46-24.57,4.39-2.13.83-12.74,5.61-11.39,8.56,4.15,9.05,33.03-4.92,35.96-12.95ZM1075.64,1452.67c8.58.97,15.25-6.48,21.94-10.99.32-6.53-27.72-.63-21.94,10.99ZM1221.56,1442.69c-25.24,2.16-45.65,30.63-48.6,54.43-.22,1.76-2.14,4.8,1.66,5.55,2.81.56,34.03-30.76,42.63-30.3l4.31-29.68ZM1238.99,1443.03c-8.69,1.78-16,14.91-8.44,21.6,3.24-3.94,12.77-5.2,14.62-9.32,3-6.66,3.26-14.21-6.19-12.27ZM1291.53,1480.67c3.35-3.32-10.54-14.35-13.23-15.74-14.27-7.38-36.42,4.53-48.69,12.75l7.43,4.54,54.5-1.55ZM1233.56,1496.65l-14.62-13.71-25.36,19.72,39.98-6Z"/><path d="M273.94,342.68c-23.59,15.34-46.51,34.3-73.5,43.45-23.36,7.93-58.39,14.25-66.76-16.12-5.58-20.23-1.85-29.37,7.99-46.68,20.18-35.48,75.44-100.46,121.78-81.15,3.42,1.43,33.21,27.61,35.91,31.05,3.63,4.63.76,11.47,5.58,15.4,24.63-28.78,62.71-75.5,104.83-48.83,14.22,9,21.36,22.57,25.25,38.74,11.95,49.75,13.06,91.57-16.67,135.58-16.86,24.97-42.03,56.62-73.64,60.33-24.24,2.84-34.1-4.85-48.7-22.84-23.9-29.46-35.23-72.43-22.07-108.94ZM310.71,445.86c14.06,13.6,19.46,17.1,40.22,14.82,27.78-3.04,62.02-53.25,72.43-77.54,12.2-28.44,7.32-77.66-4.5-106.44-12.99-31.65-37.6-38.4-67.55-21.64-26.05,14.57-63.75,71.4-65.02,101.19-.23,5.41,5.84,8.87,3.49,15.2-2.11,5.7-8.96-2.44-7.78,12.15,1.8,22.14,12.84,46.91,28.71,62.26ZM233.53,253.24c-28.05,3.14-67.35,46.97-81.17,70.78-8.44,14.53-13.56,41.7,3.82,51.48,25.59,14.39,84.64-19.09,105.62-36,24.04-19.38,40.34-37.8,16.11-65.78-12.78-14.76-24.3-22.73-44.38-20.49Z"/><path d="M1482.07,716.05c3.56,2.85,13.49,3.97,13.5,9.59.01,5.32-7.45,8.85-12.14,6.16-29.37-15.94-56.52-41.39-86.59-55.47-7.47-3.5-16.65-9.2-25.35-6.64,8.68,10.19,18.5,18.53,26.84,29.15,8.22,10.48,15.22,24.15,23.19,34.8,22.78,30.45,46.1,60.62,68.94,91.05,3.18,6.42-.28,11.76-7.58,9.65-22.45-18.15-43.05-38.38-64.42-57.63-17.49-15.76-37.96-30.33-53.75-48.23-.82-.92-3.55-5.29-3.18-5.77l8-3.19,35.98,34.15-3.98,3.96c5.54,9.28,9.6,6.56,16.02,8.36s10.1,14.87,14.86,18.76c5.96,4.86,17.45,4.08,22.09,15.89,3.43-7.28-.73-13.81-4.19-19.8-15.25-26.37-59.36-84.17-81.84-104.13-6.62-5.88-21.99-10.45-18.78-20.78,2.87-9.24,30.81,1.81,37.19,4.37,15.47,6.21,29.4,17.53,44.62,22.34-7.04-5.68-42.26-43.57-10.53-32.43,17.81,6.25,44.28,52.37,61.11,65.83Z"/><path d="M1333.26,758.93l31.21,95.78,15.01,39.96-8.99-5.99c-2.84,8.27,7.18,17.63,9.69,24,27.02,68.56,65.26,199.36,69.27,273.01.47,8.63,2.86,27.62-9.33,28.68-5.73.5-16.53-21.25-19-26.34-23.28-47.78-39.42-101.96-50.11-153.87-.86-4.19-4.5-8.46-5.13-13.03-.46-3.35-.43-13,3.6-14.45.69,5.92,2.26,11.71,3.46,17.54,4.67,22.62,11.53,49.65,19.18,72.81,11.16,33.79,27.9,66.76,43.34,98.67,4.07,2.9,5.9-20.54,5.8-23.8-.63-20.32-10.12-59.92-14.76-81.25-20.64-94.8-58.61-189.93-86.34-283.62-4.98-16.83-14.82-31.47-18.63-48.35l11.73.24ZM1367.53,884.67c8.43-4.28,2.48-12.95-4-15.99l4,15.99Z"/><path d="M1484.16,1125.97c-12.27-12.53-28.38-36.44-37.03-51.95-9.3-16.68-30.62-59.73-35.17-76.82-1.09-4.1-.42-8.38-.46-12.52,12.03,7.46,10.72,22.24,15.58,33.38,7.91,18.11,20.34,42.45,30.76,59.23,9.67,15.58,22.43,33.37,37.58,43.38,3.58-4.79-17.05-59.3-20.44-68.53-11.73-31.98-27.35-63.02-36.04-95.95l-21.45-47.52c8.56,7.41,14.07,21.48,18.94,32.03,20.95,45.36,46.77,108.69,61.96,156.01,2.2,6.86,10.44,33.12,8.11,37.91-4.74,9.72-17.88-4.08-22.35-8.66Z"/><path d="M73.58,583.1c14.82-3.64,26.46,15.2,15.65,27.77-2.12,2.46-13.2,7.63-16.18,7.66-14.74.12-16.07-31.35.53-35.42Z"/><path d="M190.48,646.19c-3.37-3.91-2.98-17.49.94-21.62,13.35-14.07,33.81-.06,24.17,16.72-4.65,8.09-18.76,12.28-25.11,4.9Z"/><path d="M1358.51,968.72c2.79.04,4.8,15.49,5.22,18.77.18,1.39,2.88,7.35-1.23,7.15-3.16-.16-9.82-26.01-4-25.92Z"/><path d="M1413.47,894.68c-8.75-8.91-13.45-23.95-15.95-35.99l13.72,27.25,2.24,8.74Z"/><path d="M1387.46,912.69l10.03,23.96c-12.23,1.55-5.34-14.85-13.92-21.08l3.88-2.89Z"/><path d="M1345.54,920.69c3.26-.22,3.16,5.03,3.67,7.29.8,3.56,3.2,10.24-.69,12.66-5.56-4.9-2.21-13.53-2.98-19.95Z"/><path d="M1409.47,976.68c-7.47-8.06-7.8-23.42-11.96-33.99,3.27,2.21,5.61,10.17,6.94,14.03,2.02,5.84,4.23,13.8,5.02,19.96Z"/><path d="M1385.49,830.67c-3.2,3.79-8.54-10.23-7.97-11.99l7.97,11.99Z"/><path d="M1413.5,900.69c3.02-3.02,8.52,5.95,2.99,5.95-1.32,0-4.14-4.8-2.99-5.95Z"/><path class="cls-1" d="M320.94,18.72l.98,15.96"/><path d="M693.77,372.68c-6.38-4.06-8.67-12.93-7.96-19.99l7.96,19.99Z"/><polygon points="699.77 386.68 695.8 383.65 698.8 378.69 699.77 386.68"/><path d="M639.79,496.67c-4.6-2.52-6.21-11.23-5.96-15.98,4.4,2.41,5.38,11.51,5.96,15.98Z"/><path d="M395.37,336.13c-1.9,1.91-23.73,14.34-26.39,14.66-37.89,4.46-12.74-59.32.98-65.07,4.42-1.85,26.22-2.29,28.96.94,5.33,6.28,1.16,14.43,1.16,20.81,0,2.95,2.03,6.29,1.94,10.15-.09,3.55-4.39,16.26-6.65,18.52Z"/><path d="M229.45,273.17c13.3-2.29,19.74.75,27.57,11.46,3.55,4.86,7.06,12.17,8.07,17.98,6.28,36.12-81.28,60.8-66.53,9.62,4.38-15.21,13.82-36.11,30.9-39.06ZM229.98,300.7l-7.04,1.93-.93,12.05,7.98-13.98Z"/><line class="cls-1" x1="222" y1="314.68" x2="222.94" y2="302.63"/></svg>`
];

// TEIL 2: Die restlichen Pferde
const TEIL_2 = [
  // Horse3
  `<?xml version="1.0" encoding="UTF-8"?><svg id="Ebene_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 748.91 629.63"><g id="Ebene_1-2"><g id="fVj7le.tif"><path d="M506.96,0c23.31,13.53,6.79,40.18,14,61.97,26.49-7.44,32.81-69.93,65.87-46.89,18.17,12.66,12.97,74.58,9.19,94.99-2.1,11.33-6.3,21.98-10.69,32.52.38,2.13,20.79,33.3,23.58,36.33,16.25,17.67,34.96,15.4,36.07,47.94.44,12.91-5.23,16.72,3.04,28.9,13.94,20.53,40.89,53.09,57.8,72.14,18.96,21.36,47.55,35.34,42.51,68.47-1.5,9.89-8.28,17.28-10.9,25.06-8.93,26.52-2.11,38.37-28.76,59.2-34.09,26.66-79.08,38.97-108.58-1-4.02-5.45-6.2-13.31-9.09-16.9-6.14-7.61-54.68-22.99-67.38-28.57-26.28-11.53-18.1-11.75-49.6-14.37-5.09-.42-17.79-5.11-21.02-3.09-15.54,31.31-27.61,64.63-38.02,98.05-9.21,29.55-15.67,72.66-26.95,98.99-10.41,24.31-39.74,14.72-59.81,9.86-90.47-21.93-177.98-91.52-221.42-173.36-12.5-.99-23.81,2.26-36.66,1.64-30.91-1.49-91.83-20.66-55.39-59.03-9.77-15.33-20.57-27.09-11.07-45.65,11.32-22.11,36.72-1.05,53.54-16.36-25.32-.17-36.41-17.98-25.44-41.44,2.44-5.22,14.9-19.04,15.21-20.82.25-1.43-5.4-10.45-5.55-15.9-.52-18.59,18.46-30.58,33.64-36.99-14.85-37.85,15.35-46.77,45.86-52.04.65-21.53,15.27-37.83,37.06-28.07,3-.71,6.34-11,9.17-14.65s15.42-13.07,15.79-14.31c1.08-3.63-4.67-12.06-3.76-19.49,3.71-30.39,53.48-28.85,74.71-19.42,4.84-1.14,11.88-31.42,32.2-31.37,29.49.07,14.34,37.27,52.05,35.69,10.44-.44,37.08.77,43.42-.52,8.22-1.67,18.13-11.11,27.85-14.15,8.79-2.75,18.12-3.44,27.28-3.71,10.2-24.59,24.96-43.79,50.27-53.67h19.99ZM273.09,155.93v-7.98s-1.97,0-1.97,0c.32,3.83.37,6.77-4,6.02v1.95s5.97.01,5.97.01ZM351.04,185.92v-7.98s-1.97,0-1.97,0c.32,3.83.37,6.77-4,6.02v1.95s5.97.01,5.97.01ZM109.18,197.95l-9.98-2c1.27,4.6,6.34,4.24,9.98,3.96v-1.96ZM69.21,429.85h-11.97s0,1.97,0,1.97l11.97,2.01v-3.98Z"/></g></g></svg>`, 
  
  // Horse4
  `<?xml version="1.0" encoding="UTF-8"?><svg id="Ebene_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 847.97 652.21"><g id="Ebene_1-2"><g id="fVj7le.tif"><path d="M557.6,413.56c-2.96.29-3.12,2.93-3.89,5.07-15.28,42.46-36.08,84.96-32.03,131.83,1.66,19.27,9.24,19.44,14.96,33.02,2.91,6.92,6.83,17.46,9.39,24.59,9.77,27.26,8.29,48.79-27.25,43.25-6.72-1.05-11.41-5.68-20.09-6.02-11.79-.45-13.17,5.45-23.99-3.88-16.21-13.96-14.76-27.26-19.47-44.5-2.32-8.47-8.18-16.78-10.56-25.42-11.82-42.81,7.85-74.47,12.79-115.24,1.65-13.6.79-29.11,2.5-43.48,2.58-21.73,10.43-42.71,7.75-65.24-60.46,2.15-119.85-3.45-174.64-30.15-3.9,8.58-13.09,10.78-17.65,18.77-12.84,22.47-32.4,75.09-41.08,100.86-3.64,10.8-10.08,26.51-10.53,37.57-.53,13.21,6.69,68.85,13.11,78.79,5.57,8.62,17.45,14.68,22.56,25.42,2.31,4.85,12.45,31.84,13.43,36.53,8.28,39.51-41.33,39.95-66.42,28.46-9.99-4.57-25.54-20.67-28.75-31.22-2.36-7.72-.77-14.49-2.96-21.03-1.62-4.84-11.25-15.55-14.52-21.46-10.05-18.12-15.33-33.44-15.38-54.61-9.81,18.98-13.95,40.02-16.96,61.03-1.46,10.19,1.92,17.65-3.63,28.36-2.68,5.17-7.78,8.24-11.21,12.77-7.8,10.3-9.92,18.99-25.13,22.91-34.22,8.83-51.83-65.24-40.81-88.86,2.57-5.5,13.29-13.93,14.38-17.6,2.34-7.86.41-24.66,2.91-35.08,1.9-7.94,7.44-14.43,9.04-20.94,8.25-33.56-4.3-91.63,15.62-118.33,4.36-5.84,11-9.86,14.81-16.15-10.78-.04-18.81,17.66-26.02,20.94-5.97,2.71-13.29-.46-18.63,1.36-6.06,2.06-11.34,20.88-29.82,17.25-20.93-4.11-17.89-30.68-22.02-46.01-1.19-4.41-5.91-8.47-6.97-15.03-2.6-16.02,7.16-20.91,13.23-33.79,8.74-18.55,9.95-37.84,29.6-50.37,8.67-5.53,22.18-7.88,30.57-13.41,29.55-19.45,36.04-75.37,58.06-103.87,27.77-35.96,101.69-52.45,144.99-49.05,22.82,1.79,49.19,13.25,72.4,17.55,34.86,6.47,80.87,12.43,115.31,4.4,8.54-1.99,6.96-12.16,17.08-16.9,14.34-6.71,27.04,1.04,42.58-7.4,10.99-5.97,11.3-14.55,20.41-21.57,4.07-3.14,8.95-4.26,12.81-7.18,14-10.57,19.7-21.18,38.99-18.64,6.7.88,13.46,5.77,20.11,5.83,20.25.19,57.38-9.62,80.01-11.98,6.95-.73,15.52,1.16,21.92-.06,4.09-.78,14.21-10.83,22.48-13.5,17.89-5.76,26.84.9,42.21,8.85,3.84,1.98,14.31,10.05,15.73,10.42,7.33,1.93,17.75-12.65,35.36-5.53,19.08,7.71,14.83,29.96,7.56,45.15-3.99,8.34-22.92,33.11-23.98,38.09-.97,4.54,7.77,21.95,7.44,31.34-.55,15.3-14.85,28.15-15.79,38.35-1.72,18.51,3.94,46.45,1.95,67.75-3.43,36.65-44.2,59.5-76.62,40.72-22.41-12.98-20.92-54.11-42-69.53-2.93.52-39.68,38.09-42.15,41.93-7.17,11.12-9.14,31.39-15.33,44.65-3.38,7.24-20.91,28.49-21.32,30.51-1.79,8.86,26.34,42.34,31.27,54,11.55,27.36,3.67,48.61,4.22,75.77.5,24.46,8.56,48.91,8.15,73.97-.51,30.7-2.02,63.5-6.25,93.71-1.73,12.34-11.89,23.27-24.8,23.34-24.07.13-56.65-37.35-57.13-61.13-.26-12.77,6.62-21.75,7.21-29.96.35-4.9-2.99-12.03-3.14-17.98-.63-25.37,1.98-53.12.05-78.02-1.52-19.54-8.71-27.9-15.99-45ZM119.91,327.59c13.24-12.72,20.03-36.87,11.95-53.97-12.97,13.6-4.81,36.92-11.95,53.97ZM313.77,301.62l-7.98.97,4.96,3,3.03-3.97Z"/></g></g></svg>`,

  // Horse5
  `<?xml version="1.0" encoding="UTF-8"?><svg id="Ebene_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 961.41 793.66"><g id="Ebene_1-2"><g id="fVj7le.tif"><path d="M265.67,13.13c5.21,3.65,15.49,3.97,22.1,8.93,3.75,2.82,6.04,8.47,8.62,9.37,11.15,3.87,29.53.64,41.21,10.24,5.88,4.84,5.07,18.02,7.93,21.59.9,1.12,20.88,10.62,25.3,13.68,12.4,8.59,22.02,15.24,20.23,31.84-.72,6.68-6.59,12.49-5.76,17.52.24,1.48,11.66,24.32,13.3,26.82,12.57,19.05,38.71,13.12,36.43,41.56-.46,5.75-4.05,10.59-4.09,16s3.77,11.11,3.73,16.06c-.02,3.6-2.78,6.75-2.85,9.96s6.54,16.73,8.5,17.13c51.45-6.48,106.65-39.5,158.94-27.53,21.57,4.94,25.19,18.31,48.27,9.11,36.17-14.41,54.86-37.6,98.31-33.77,16.35,1.44,49.42,14.27,53.96,32,1.87,7.32-.83,14.69,2.84,21.15,1.93,3.4,32.49,27.99,36.62,29.35,27.89,9.17,39.4-20.05,61.51-13.53,17.95,5.29,14.33,26.96,9.89,41.04,24.94.05,72.83,44.69,39.1,64.1-10.95,6.3-24.36-3.64-35.06.94-1.17.5-18.02,16.26-18.55,17.41-6.11,13.21,4.58,24.63-17,34.98-26.64,12.78-60.85,3.97-88.51-2.36-14.07-3.22-28.04-6.94-41.28-12.8l-4.43,2.98c.33,18.42,17.94,39.34,33.17,48.36,6.88,4.08,15.58,5.63,22.04,9.94,18.55,12.37,21.93,42.81,30.83,61.13,4.44,9.14,13.13,16.41,16.37,25.61,9.89,28.17,10.42,67.2,9.46,96.63-.91,28-20.27,37.56-45.62,40.38-30,3.34-49.63-4.89-46.2-38.23s4.08-44.33-8.18-78.21-28.59-47.32-57.28-68.57c-18.48-13.69-38.56-25.2-57.71-37.87-2.59.19-25.89,27.77-26.46,30.75-2.76,14.25,21.88,42.66,23.44,61.77,3.23,39.47-24.09,46.82-36.29,75.59-8.37,19.74-1.21,29.52-19.56,46.41-3.51,3.23-10.07,4.89-12.19,7.8s-1.72,6.94-3.8,10.2c-2.82,4.41-9.03,6.4-12.06,9.93-16.82,19.59-18.06,27.98-46.42,35.54-24.94,6.65-60.69,5.67-61.37-27.77-.59-28.85,66.31-85.3,82.64-114.9,7.43-13.46,17.08-36.98,9.54-51.22-9.03-17.07-24.84-31.47-26.84-53.11-5.83-4.22-7.74-21.2-14.39-21.41-4.02-.13-24.38,9.05-31.12,10.95-37.72,10.62-74.9,13.63-113.46,19.47-8.22,23.05-23.02,45.57-29.88,69.07-5.25,17.95-4.15,35.55-11.04,52.93-4.68,11.8-16.08,25.14-18.63,37.35-2.07,9.92-1.39,22.49-3.12,32.87-1.54,9.29-6.03,43.35-8.32,48.71-.43,1.01-12.54,14.84-14.37,16.55-17.76,16.48-46.17,21.03-69.6,19.98-3.82-4.51-8.4-11.89-13.47-14.95-10.76-6.51-15.75.66-13.95-20.07,2.29-26.43,29.05-45.82,40.37-67.62,8.61-16.58,12.21-56.6,13.61-76.35,1.61-22.64.41-48.1,1.11-71.05l-5.53-1.53-73.45,22.75c-.49,2.33,11.24,23.23,13.93,25.86,7.02,6.88,20.28,8.48,28.98,14.99,31.97,23.91,28.75,95.49-21.5,87.48-50.52-8.05-86.85-70.41-101.46-114.44-22.25-67.03,20.79-76.26,63.83-108.17,12.5-9.27,23.15-21.07,35.86-30.16-2.95-26.34-7.36-50.89-5.79-77.71,2.63-44.89,24.02-82.92,8.64-128.43-2.66-7.88-3.83-14.9-13.44-14.52-12.42.49-37.42,2.58-49.2,4.97-13.14,2.67-27.95,16.93-43.36,20.6C29.18,253.41-.43,236.69,0,199.04c.39-33.34,45.07-66.88,69.15-88.33,24.43-21.75,44.03-37.12,66.97-60.97,31.4-32.66,40.16-22.68,77.5-36.44,12.41-4.57,25.65-17.4,38.95-11.99,5.48,2.23,9.8,9.51,13.1,11.82Z"/></g></g></svg>`,

  // Horse6
  `<?xml version="1.0" encoding="UTF-8"?><svg id="Ebene_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 489.84 507.1"><g id="Ebene_1-2"><g id="fVj7le.tif"><path d="M0,210.93c6.36-9.41,7.17-18.81,15.95-27.03,6.28-5.88,13.42-6.9,19.05-10.94,32.06-22.97,55.95-55.2,85.98-79.94,6.85-5.64,25.04-15.79,33.57-20.4,28.84-15.57,109.51-46.94,140.49-47.41,15.65-.24,27.83,2.89,45.3-.67,10.54-2.14,25.79-18.75,36.87-21.08s19.39,3.61,25.24,3.03c4.8-.48,10.36-7.06,17.53-6.47,42.44,3.53,22.01,68.26,6.19,89.57,22.65,49.66,28.08,102.28,46.05,153.81,6.22,17.82,16.78,32.41,17.57,52.4.99,25.09-14.39,66.32-38.72,77.4-9.05,4.12-37.65,4.69-48.09,3.43-16.19-1.95-27.05-11.45-34.28-25.69-12.8-25.21-7.39-25.93-31.96-46-13.6-11.11-29.75-19.06-41.92-32.02-43.37,45.98-49.11,122.2-49.07,182.99,0,7.42,2.46,13.88,2.19,21.94-1.68,51.04-47.04,22.62-72.66,8.56-10.26-5.63-22.52-13.18-32.41-19.56-6.32-4.08-37.18-23.31-36.98-29,.1-2.84,3.91-4.87,3.72-7.7-.26-3.96-6.46-6.73-5.66-11.32l5.96,4,1.98-5-3.93-2.98-.99,4.01c-10.91-3.33-10.78-13.49-14.95-19.08-9.18-12.3-22.12-24.09-30.88-37.09-10.86-16.12-18.28-34.51-27.41-51.57l-17.72,3.78L0,248.91v-37.99Z"/></g></g></svg>`,

  // Horse7
  `<?xml version="1.0" encoding="UTF-8"?><svg id="Ebene_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 553.93 460.38"><g id="Ebene_1-2"><g id="fVj7le.tif"><path d="M221.79,12.53c5.84,5.59,12.58,21.73,17.58,25.39,1.57,1.15,34.11,13.02,36.55,13.42,3.7.62,35.24,2.65,37.06,2.11,7.1-2.11,9.17-12.65,12.84-15.74,16.44-13.81,35.01-2.45,45.8,11.63,17.92-2.08,38.63-6.54,47.11,13.1,5.62,13.02,5.92,24.72,18.65,35.33,3.41,2.84,13.33,3.06,20.44,7.54s12.87,15,16.61,17.37c2.76,1.75,7.15,1.4,10.64,3.35,14.36,8.06,15.29,24.17,23.59,36.38,4.43,6.51,12.6,11.19,14.69,19.3,1.84,7.17.02,13.77,1.39,20.6s8.72,14.23,9.46,22.69c.56,6.37-2.63,11.3-1.75,17.48,3.74,4.24,7.97,2.93,12.95,7.13,8.22,6.94,9.94,15.77,7.49,25.75-1.39,5.64-8.48,14.49-8.55,17.34-.22,8.8,10.75,14.65-1.28,28.79-16.52,19.43-50.24,15.26-72.73,17.22-14.05,16.07-24.75,40.34-38.03,55.93-4.32,5.07-40.74,33.78-45.41,34.72-3.94.79-8.92-1.47-10.65-.69-2.76,1.24-3.59,7.45-7.19,8.67-3.24,1.1-7.74-.3-11.22.77-13.05,4-26.47,11.7-40.38,15.59-20.1,5.62-50.61,14.91-61.8-8.23-9.53-19.7-15.1-61.44-22.65-85.3-2.04-6.44-16.22-48.13-18.48-49.49-8.59-.83-22.48-2.54-30.54-.48-4.98,1.27-54.99,22.48-58.85,25.11-13.34,9.08-20.14,28.58-40.05,31.91-23.79,3.97-62.96-18.22-72.52-40.46-2.24-5.21-11.03-33.15-11.83-38.15-1.86-11.57-.29-23.76,6.21-33.54,5.88-8.84,15.4-13.55,21.64-20.34,8.17-8.88,45.38-50.65,47.54-58.41,1.77-6.37.84-16.26,3-22.99,6.56-20.43,39.84-28.75,39.28-52.21-.61-25.63-11.76-46.71-3.27-75.72,4.73-16.14,16.96-9.8,19.42-23.56h1.95c1.7,9.08,12.7,9.9,18.83,16.17,5.33,5.46,7.79,15.78,15.16,19.8-2.3-35.14,24.81-50.67,51.3-25.3Z"/></g></g></svg>`,

  // Horse8
  `<?xml version="1.0" encoding="UTF-8"?><svg id="Ebene_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1628.55 909.12"><g id="Ebene_1-2"><g id="fVj7le.tif"><path d="M949.12,909.12c-28.97-12.65-94.37-40.29-95.78-77.15-.2-5.23,3.57-8.83.84-14.76-1.7-3.7-20.67-20.48-25.19-22.84-12.95-6.76-39-11.96-54.11-15.85-36.9-9.49-75.76-17.11-113.17-24.75s-84.19-6.54-84.56-60.36c-13.59-4.11-25.98,5.46-39.35,9.23-46.09,12.98-77.21,3.67-121.34,4.4-21.6.36-59.1,26.09-80.26,35.86-13.41,6.2-36.78,10.72-47.41,20.56-5.4,5-9.31,13.35-16.22,19.77-5.13,4.76-12.27,8.24-17.02,12.96-8.66,8.6-18.64,26.84-27.89,34.08-8.69,6.8-23.29,8.34-32,13.98-25.29,16.37-38.71,51.64-77.05,54.91-48.02,4.09-42.61-57.03-33.58-87.59,7.06-23.91,21.88-46.87,47.63-52.32,4.18-9.11,2.53-17.18,7.19-26.8,12.3-25.39,48.82-19.94,72.15-25.8,25.72-6.46,56.83-30.02,73.45-50.48s34.09-71.55,63.1-73.01c14.18-.71,29.84,10.07,43.02-.78,15.49-12.74,20.94-59.79,26.02-79.94,4.58-18.15,11.07-35.84,15.65-53.99-2.14-8.35-45.92-1.94-54.23-.6-76.74,12.43-124.28,66.75-202.35,71.51-23.71,1.45-74.2.87-87.45-22.65-2.92-5.19-2.97-11.25-6.41-15.58-6.73-8.46-29.23-13.86-38.05-27.92-7.41-11.8.24-21.35-1.41-28.5-.59-2.55-19.93-19.02-23.66-24.4-4.63-6.66-15.44-27.34-17.11-34.87-1.34-6.06-1.33-12.61-2.57-18.71,10.35-12.62,16.98-19.19,33.65-12.38,3.19,1.3,14.41,10.57,15.99,8.97-2.96-8.37-3.41-22.84,4.06-28.92,3.36-2.74,8.42-2.29,9.68-3.3.43-.34-3.45-5.66,5.77-7.39,10.95-2.05,35.88,18.62,51.94,21.15,9.13,1.44,46.95-.99,52.08-7.94s-1.68-17.74,15.75-31.21c28.67-22.16,118.87-25.1,151.93-12.71,20.03,7.5,37.16,34.12,54.5,43.45,12.35,6.64,30.47,7.08,44.03,11.94,12.82,4.59,34.96,19.63,47.81,19.97,5.42.14,35.93-17.19,45.76-20.43,53.19-17.56,92.5-7.52,145.36-2.61,36.99,3.43,119.55-2.04,152.93-16.91,29.33-13.06,57.8-34.96,79.87-58.03-13.7-9.27-20.48-17.34-15.06-35.09,4.21-13.77,27.82-15.38,32.94-23.16,2.38-3.61.85-15.19,3.73-22.14,4.59-11.1,19.46-18.04,21.49-22.54.98-2.17-9.46-18.04,3.07-30.86,8.2-8.39,19.75-6.22,25.75-10.23,3.34-2.23,7.19-15.21,13.38-20.61,11.34-9.89,25.65-6.91,35.46-12.52,6.03-3.45,9.46-14.2,19.07-18.91,12.74-6.24,22.88-3.1,34.99-4.99,3.21-.5,21.79-16.98,23.97-20.01,6.9-9.58,1.16-20.26,18.65-27.32,20.96-8.47,29.55,12.21,45.05,19.86,12.63,6.24,27.56,6.02,41.3,5.5,2.07-38.75,47.39-26.76,72.01-16.87,32.49,13.04,73.89,54.57,86.94,86.97,4.07,10.11,4.89,24.74,9.3,32.68,25.59,46.12,77.72,72.73,99.39,120.51,23.3,51.38-13.1,89.34-64.59,92.74-18.12,1.2-29.92-4.66-45.09-13.02-17.64-9.71-42.83-35.55-56.78-41.17-8.87-3.57-23.18-4.36-33.15-6.83-17.2-4.25-29.69-15.15-47.87-3.94-24.23,14.94-28.86,80.48-41.17,105.88,2.52,12.4,10.78,22.15,15.15,33.95,5.38,14.52,5.89,29.66,10.5,43.48,4.84,14.52,17.71,27.98,24.81,41.67,14.61-3.71,30.82-2.49,45.35-4.39,35.27-4.62,66.01-20.53,98.14,6.3,27.16,22.67,31.58,63,23.38,95.54,7.92,6.66,17.36,5.77,26.07,8.93,28.1,10.2,40.43,30.33,64.92,45.02,27.37,16.42,71.48,26.08,93.85,47.08,3.6,3.38,27.39,35.66,28.26,38.71,1.58,5.51-.38,11.92.45,17.54,4.74,32.03,8.13,54.8-9.6,84.42-25.01,41.78-77.03-5.71-85.38-37.39-6.57-24.92-3.86-32.1-22.14-53.82-26.21-31.13-62.19-23.95-96.11-39.81-19.09-8.92-32.62-25.59-53.71-28.48l-2.55.48c-20.35,28.43-44.33,99.3-82.21,106.75-8.25,1.62-12.19-1.44-18.55-.77-11.78,1.24-26.3,13.18-39,15.15-28.52,4.44-60.55,1.27-60.26-34.29.27-32.76,43.29-75.03,72.38-85.53,11.57-4.18,26.85-.73,20.15-17.87-8.04-1.04-15.16-7.3-22.68-8.89-9.92-2.1-47.1.19-58.84,1.36-24.26,2.41-47.82,18.23-73.32,12.87-8.72-1.83-22.05-12.59-28.77-12.84-10.42-.38-33.07,6.82-46.09,7.7-87.66,5.93-146.68-33.24-225.87-41.94-6.86-.75-31.93-4.39-34.97,1.45-1.18,2.27-11.77,46.45-11.89,49.81-.1,2.82-.11,3.55,1.89,5.71,3.62,3.91,40.83,17.18,48.47,19.5,62.12,18.92,163.13,18.55,160.47,107.4,10.81,9.26,19.3,19.31,28.08,29.89,6.33,7.64,12.08,8.08,14.38,21.59,2.22,13.03-2.67,15.39-3.51,23.7-.63,6.16,3.74,12.88-3.8,19.53-3.64,3.21-17.37-.22-22.18,5.28h-19.99ZM69.61,327.35c-2.91-2.79-3.65.23-4,2.99-.93,7.32.79,15.45,8.01,18.99,3.76-8.36-2.22-14.1-4.01-21.98ZM25.66,369.31l-3.99-11.14c-7.45-1.3-11.65,3.37-4.98,9.14l2.96-3.98,6.02,5.98Z"/></g></g></svg>`
];

// TEIL 3: Zusammenfügen und Animation starten

// Hier fügen wir die beiden Listen zusammen zu einer großen Liste
const SCRIBBLE_DATA = TEIL_1.concat(TEIL_2);

// Hilfsfunktion für Zufallszahlen
function rnd(min, max){
  return Math.random() * (max - min) + min;
}

// Diese Funktion baut die Scribbles auf
function initScribbles(){
  const container = document.getElementById("scribble-bg");
  if(!container) return;

  container.innerHTML = "";
  
  // Wir nehmen einfach so viele Scribbles, wie wir wollen (z.B. 14 Stück)
  const SCRIBBLE_COUNT = 14;

  for(let i = 0; i < SCRIBBLE_COUNT; i++){
    
    // Wähle zufällig einen Eintrag aus unserer Liste oben
    if(SCRIBBLE_DATA.length === 0) break; // Schutz falls Liste leer
    const svgText = SCRIBBLE_DATA[Math.floor(Math.random() * SCRIBBLE_DATA.length)];

    // Ab hier ist alles fast wie vorher:
    const wrapper = document.createElement("div");
    wrapper.className = "scribble sparkle"; 

    wrapper.innerHTML = svgText;
    
    // Kleine Glitzer erzeugen
    const GLITTER_COUNT = Math.floor(rnd(3, 7));

    for(let g = 0; g < GLITTER_COUNT; g++){
      const glitter = document.createElement("div");
      glitter.className = "glitter";
      glitter.style.left = rnd(10, 90) + "%";
      glitter.style.top = rnd(10, 90) + "%";
      glitter.style.animationDelay = rnd(0, 1.5) + "s";
      wrapper.appendChild(glitter);
    }

    // SVG direkt ansprechen für Animationen
    const svg = wrapper.querySelector("svg");
    if(svg){
      svg.classList.add("sparkle");
      // Sicherstellen, dass das SVG sichtbar ist
      svg.style.width = "100%";
      svg.style.height = "auto";
    }

    // Zufällige Positionierung
    const size = rnd(80, 220);
    const x = rnd(-10, 100);
    const y = rnd(-10, 100);
    const rot = rnd(-25, 25);
    const durY = rnd(6, 14);
    const durX = rnd(8, 18);

    wrapper.style.width = size + "px";
    wrapper.style.left = x + "vw";
    wrapper.style.top = y + "vh";
    wrapper.style.transform = `rotate(${rot}deg)`;
    wrapper.style.animationDuration = `${durY}s, ${durX}s`;

    container.appendChild(wrapper);
  }
}

/* Starten, wenn die Seite geladen ist */
window.addEventListener("load", initScribbles);
