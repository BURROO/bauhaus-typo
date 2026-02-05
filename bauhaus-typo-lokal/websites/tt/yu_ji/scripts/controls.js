// ===== 控制项配置 =====

const georgeControls = [
    { label: 'Width', min: 200, max: 2000, path: 'parameters.width' },
    { label: 'Size', min: 0.2, max: 3, step: 0.05, path: 'parameters.size' },
    { label: 'Spacing', min: 0, max: 1000, path: 'parameters.spacing' },
    { label: 'Radius', min: 20, max: 500, path: 'parameters.radius' },
    { label: 'Slant', min: -100, max: 100, path: 'parameters.slant' },
    { label: 'Cycles', min: 1, max: 20, path: 'parameters.gradientRepetition', step: 0.1, animate: false },
    { label: 'Steps', min: 0, max: 100, path: 'parameters.pixelSubdivision' }
]

// 上半部分 (Gradient, Depth, Scale)
const depthControlsTop = [
    { label: 'Gradient Angle', min: 0, max: 360, path: 'parameters.gradientAngleOffset', animate: true, loop: true, easing: 'easeInOut', duration: 2000 },
    { label: 'Trail Depth', min: 1, max: 30, path: 'parameters.copies.count' },
    { label: 'Trail Scale', min: -10, max: 20, path: 'parameters.copies.offset.scale' }
]

// 下半部分 (Scale Variation)
const depthControlsBottom = [
    { label: 'Scale Variation', min: 0, max: 100, path: 'parameters.charScaleVariation' }
]

const colorNumberControls = [
    { label: 'Gradient Pos 1', min: 0, max: 100, path: 'parameters.offet0', animate: true },
    { label: 'Gradient Pos 2', min: 0, max: 100, path: 'parameters.offet1', animate: true },
    { label: 'Gradient Pos 3', min: 0, max: 100, path: 'parameters.offet2', animate: true }
]

const controlsSwitch = [
    { label: 'Pixel Shape', path: 'parameters.pixelShape', value: 'square', options: [{ label: 'Circle', value: 'circle' }, { label: 'Square', value: 'square' }] },
    { label: 'Gradient Type', path: 'parameters.gradientType', value: 'linear', options: [{ label: 'Linear', value: 'linear' }, { label: 'Radial', value: 'radial' }] }
]

const controlsColor = [
    { label: 'Start Color', path: 'parameters.color0' },
    { label: 'Mid Color', path: 'parameters.color1' },
    { label: 'End Color', path: 'parameters.color2' }
]

const zeroControlsColor = [
    { label: 'Void Start', path: 'parameters.zeroColor0' },
    { label: 'Void Mid', path: 'parameters.zeroColor1' },
    { label: 'Void End', path: 'parameters.zeroColor2' }
]

const zeroColorNumberControls = [
    { label: 'Gradient Pos 1', min: 0, max: 100, path: 'parameters.zeroOffet0', animate: true },
    { label: 'Gradient Pos 2', min: 0, max: 100, path: 'parameters.zeroOffet1', animate: true },
    { label: 'Gradient Pos 3', min: 0, max: 100, path: 'parameters.zeroOffet2', animate: true }
]

// ===== 辅助函数 =====

function hslaToHex(hsla) {
    if (!hsla) return '#000000';
    if (hsla.startsWith('#')) return hsla;
    const match = hsla.match(/hsla?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%/)
    if (!match) return '#000000'
    const h = parseFloat(match[1]), s = parseFloat(match[2]), l = parseFloat(match[3])
    const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = l / 100 - c / 2
    let r = 0, g = 0, b = 0
    if (h >= 0 && h < 60) { r = c; g = x; b = 0 } else if (h >= 60 && h < 120) { r = x; g = c; b = 0 } else if (h >= 120 && h < 180) { r = 0; g = c; b = x } else if (h >= 180 && h < 240) { r = 0; g = x; b = c } else if (h >= 240 && h < 300) { r = x; g = 0; b = c } else if (h >= 300 && h < 360) { r = c; g = 0; b = x }
    r = Math.round((r + m) * 255); g = Math.round((g + m) * 255); b = Math.round((b + m) * 255)
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()
}

function hexToHsla(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2
    let h = 0, s = 0
    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) { case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break; case g: h = ((b - r) / d + 2) / 6; break; case b: h = ((r - g) / d + 4) / 6; break; }
    }
    h = Math.round(h * 360); s = Math.round(s * 100); const lValue = Math.round(l * 100)
    return `hsla(${h}, ${s}%, ${lValue}%, 1.00)`
}

function getContrastColor(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq < 128) ? '#FFFFFF' : '#000000';
}

function renderNumberControl(control, container) {
    const initialValue = _.get(bitmapFont, control.path)

    const wrapper = document.createElement('div')
    wrapper.className = 'control-item-wrapper'
    wrapper.style.display = 'flex'
    wrapper.style.flexDirection = 'column'
    wrapper.style.marginBottom = '8px'
    wrapper.style.width = '100%'
    wrapper.style.paddingLeft = '0'
    wrapper.style.paddingRight = '0'

    const labelRow = document.createElement('div')
    labelRow.className = 'label-row'
    labelRow.style.width = '100%'
    labelRow.style.marginBottom = '2px'
    labelRow.style.display = 'flex'
    labelRow.style.justifyContent = 'space-between'
    labelRow.style.alignItems = 'center'

    const label = document.createElement('label')
    label.style.display = 'block'
    // ❌ 移除内联字体设置，使用 CSS 统一控制
    // label.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif" 
    label.style.fontWeight = '500'
    label.style.fontSize = '12px' 
    label.style.letterSpacing = '1px'
    label.style.textAlign = 'left'
    label.style.whiteSpace = 'nowrap'
    label.style.color = 'var(--text-color)'
    label.textContent = control.label

    const valueSpan = document.createElement('span')
    valueSpan.className = 'control-value' 
    // ❌ 移除内联字体设置
    valueSpan.style.fontWeight = '500'
    valueSpan.style.fontSize = '12px' 
    valueSpan.style.letterSpacing = '1px'
    valueSpan.style.textAlign = 'right'
    valueSpan.style.minWidth = '30px'
    valueSpan.style.whiteSpace = 'nowrap'
    valueSpan.style.color = 'var(--text-color)'
    valueSpan.textContent = Math.round(initialValue * 100) / 100

    labelRow.appendChild(label)
    labelRow.appendChild(valueSpan)

    const inputRow = document.createElement('div')
    inputRow.className = 'input-row'
    inputRow.style.width = '100%'
    inputRow.style.marginLeft = '0'
    inputRow.style.marginRight = '0'
    inputRow.style.paddingLeft = '0'
    inputRow.style.paddingRight = '0'
    inputRow.style.display = 'flex'
    inputRow.style.alignItems = 'center'
    inputRow.style.gap = control.animate ? '8px' : '0'

    const slider = document.createElement('input')
    slider.type = 'range'
    slider.min = control.min
    slider.max = control.max
    slider.value = initialValue
    slider.id = control.path
    slider.style.width = '100%'
    slider._valueSpan = valueSpan
    slider._stopAnimation = () => {}

    if (control.step !== undefined) slider.step = control.step

    const updateValue = (val) => {
        const displayValue = Math.round(val * 100) / 100
        valueSpan.textContent = displayValue
        _.set(bitmapFont, control.path, val)
        if (control.path === 'parameters.charScaleVariation') bitmapFont.parameters.charScaleRandomness = {}
        emptyCanvas(); renderGrid(); renderText()
    }

    let animationFrame = null, isPlaying = false, animationDirection = 1, lastTimestamp = 0

    slider.oninput = (e) => {
        const val = parseFloat(e.currentTarget.value)
        updateValue(val)
        if (control.animate) lastTimestamp = 0
    }

    if (control.animate) {
        const playBtn = document.createElement('button')
        playBtn.className = 'offset-play-btn'
        playBtn.type = 'button'
        playBtn.textContent = '▶'
        inputRow.appendChild(playBtn)
        slider._playBtn = playBtn

        const stopAnimation = () => {
            if (animationFrame) cancelAnimationFrame(animationFrame)
            animationFrame = null; isPlaying = false; lastTimestamp = 0
            playBtn.classList.remove('playing'); playBtn.textContent = '▶'
        }

        const step = (timestamp) => {
            if (!isPlaying) return
            if (!lastTimestamp) lastTimestamp = timestamp
            const delta = timestamp - lastTimestamp
            lastTimestamp = timestamp
            const animMin = control.animMin !== undefined ? control.animMin : control.min
            const animMax = control.animMax !== undefined ? control.animMax : control.max
            const range = animMax - animMin
            const duration = control.duration || 2000
            const easingFunctions = { easeInOut: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, linear: t => t }
            let nextVal;

            if (control.easing && easingFunctions[control.easing] && control.loop) {
                if (!slider._animationTime) slider._animationTime = 0
                slider._animationTime += delta
                const t = (slider._animationTime % duration) / duration
                const easedT = easingFunctions[control.easing](t)
                nextVal = animMin + range * easedT
                slider._currentAnimationVal = nextVal
            } else {
                const speedPerMs = range / duration
                let currentAnimationVal = slider._currentAnimationVal || parseFloat(slider.value);
                nextVal = currentAnimationVal + animationDirection * speedPerMs * delta
                if (control.loop) {
                    if (nextVal >= animMax) nextVal = animMin
                } else {
                    if (nextVal >= animMax) { nextVal = animMax; animationDirection = -1; lastTimestamp = timestamp }
                    else if (nextVal <= animMin) { nextVal = animMin; animationDirection = 1; lastTimestamp = timestamp }
                }
                slider._currentAnimationVal = nextVal
            }
            slider.value = nextVal; updateValue(nextVal); animationFrame = requestAnimationFrame(step)
        }

        playBtn.addEventListener('click', () => {
            if (isPlaying) stopAnimation()
            else {
                isPlaying = true; playBtn.classList.add('playing'); playBtn.textContent = '⏸'
                slider._currentAnimationVal = parseFloat(slider.value)
                const animMin = control.animMin !== undefined ? control.animMin : control.min
                const animMax = control.animMax !== undefined ? control.animMax : control.max
                const range = animMax - animMin; const duration = control.duration || 2000
                if (control.easing && control.loop) {
                    const normalized = (slider._currentAnimationVal - animMin) / range
                    const y = Math.max(0, Math.min(1, normalized))
                    let t = control.easing === 'easeInOut' ? (y < 0.5 ? Math.pow(y/4, 1/3) : 1 - Math.pow(2*(1-y), 1/3)/2) : normalized
                    if (isNaN(t)) t = 0
                    slider._animationTime = t * duration
                }
                if (control.loop) animationDirection = 1
                else animationDirection = slider._currentAnimationVal >= animMax ? -1 : slider._currentAnimationVal <= animMin ? 1 : animationDirection
                lastTimestamp = 0; animationFrame = requestAnimationFrame(step)
            }
        })
        slider._stopAnimation = stopAnimation
    }
    inputRow.appendChild(slider)
    wrapper.appendChild(labelRow); wrapper.appendChild(inputRow); container.appendChild(wrapper)
}

function renderXYPad(container) {
    const wrapper = document.createElement('div')
    wrapper.className = 'xy-pad-wrapper'
    
    const label = document.createElement('span')
    label.className = 'xy-pad-label'
    // ❌ 移除内联字体设置
    label.style.fontWeight = '500'; 
    label.style.letterSpacing = '1px'; 
    label.style.fontSize = '12px'; 
    label.textContent = 'Direction'
    
    const padContainer = document.createElement('div')
    padContainer.className = 'xy-pad-container'
    
    const axisH = document.createElement('div'); axisH.className = 'xy-pad-axis-h'; axisH.style.backgroundColor = '#555555'; axisH.style.position='absolute'; axisH.style.width='100%'; axisH.style.height='1.45px'; axisH.style.top='50%'; axisH.style.left='0';
    const axisV = document.createElement('div'); axisV.className = 'xy-pad-axis-v'; axisV.style.backgroundColor = '#555555'; axisV.style.position='absolute'; axisV.style.width='1.45px'; axisV.style.height='100%'; axisV.style.left='50%'; axisV.style.top='0';
    const handle = document.createElement('div'); handle.className = 'xy-pad-handle'; handle.style.position='absolute'; handle.style.width='8px'; handle.style.height='8px'; handle.style.background='var(--text-color)'; handle.style.borderRadius='50%'; handle.style.transform='translate(-50%, -50%)';

    padContainer.appendChild(axisH); padContainer.appendChild(axisV); padContainer.appendChild(handle)
    wrapper.appendChild(label); wrapper.appendChild(padContainer); container.appendChild(wrapper)
    
    const rangeX = { min: -100, max: 100 }, rangeY = { min: -100, max: 100 }
    function updateHandle() {
        const xVal = _.get(bitmapFont, 'parameters.copies.offset.x'), yVal = _.get(bitmapFont, 'parameters.copies.offset.y')
        handle.style.left = `${((xVal - rangeX.min) / (rangeX.max - rangeX.min)) * 100}%`
        handle.style.top = `${((yVal - rangeY.min) / (rangeY.max - rangeY.min)) * 100}%`
    }
    updateHandle(); padContainer._updateHandle = updateHandle; let isDragging = false
    function handleMove(e) {
        if (!isDragging) return
        const rect = padContainer.getBoundingClientRect()
        let x = Math.max(0, Math.min(e.clientX - rect.left, rect.width)), y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
        _.set(bitmapFont, 'parameters.copies.offset.x', rangeX.min + (x / rect.width) * (rangeX.max - rangeX.min))
        _.set(bitmapFont, 'parameters.copies.offset.y', rangeY.min + (y / rect.height) * (rangeY.max - rangeY.min))
        updateHandle(); emptyCanvas(); renderGrid(); renderText(bitmapFont.preview.character)
    }
    padContainer.addEventListener('mousedown', (e) => { isDragging = true; handleMove(e) })
    window.addEventListener('mousemove', handleMove); window.addEventListener('mouseup', () => { isDragging = false })
}

// ===== DOM 生成 =====

const controlWrapper = document.getElementById('controls')

// 1. Geometry (默认展开)
const georgeDetails = document.createElement('details')
georgeDetails.open = true; 
const georgeSummary = document.createElement('summary'); georgeSummary.textContent = 'Geometry'; 
georgeDetails.appendChild(georgeSummary)
const georgeContent = document.createElement('div'); georgeDetails.appendChild(georgeContent); controlWrapper.appendChild(georgeDetails)
const georgeControlFragment = document.createDocumentFragment()
georgeControls.forEach((control) => renderNumberControl(control, georgeControlFragment))
georgeContent.appendChild(georgeControlFragment)

// 2. Depth & Effects (默认展开)
const depthDetails = document.createElement('details'); 
depthDetails.open = true; 
const depthSummary = document.createElement('summary'); depthSummary.textContent = 'Depth & Effects'; 
depthDetails.appendChild(depthSummary)
const depthContent = document.createElement('div'); depthDetails.appendChild(depthContent); controlWrapper.appendChild(depthDetails)

// ✅ 渲染上半部分滑块 (Gradient, Depth, Scale)
depthControlsTop.forEach((control) => { renderNumberControl(control, depthContent); })

// ✅ 渲染 Direction 面板 (中间)
renderXYPad(depthContent);

// ✅ 渲染下半部分滑块 (Scale Variation) - 在方块下面！
depthControlsBottom.forEach((control) => { renderNumberControl(control, depthContent); })

// 3. Color (默认展开)
const colorDetails = document.createElement('details'); 
colorDetails.open = true; 
const colorSummary = document.createElement('summary'); colorSummary.textContent = 'Color'; 
colorDetails.appendChild(colorSummary)
const colorContent = document.createElement('div'); colorDetails.appendChild(colorContent); controlWrapper.appendChild(colorDetails)

// Background
const bgRow = document.createElement('div')
bgRow.className = 'control-row'
bgRow.style.borderTop = 'none'; bgRow.style.marginTop = '0px'; bgRow.style.marginBottom = '12px'
bgRow.style.paddingLeft = '0'; bgRow.style.paddingRight = '0'

const bgLabel = document.createElement('span')
bgLabel.className = 'control-label'
bgLabel.style.letterSpacing = '1px'; bgLabel.style.fontSize = '12px'; bgLabel.textContent = 'Background'

const bgWrapper = document.createElement('div');
bgWrapper.className = 'color-input-wrapper'; 
bgWrapper.style.setProperty('width', 'calc((100% - 16px) / 3)', 'important'); 
bgWrapper.style.setProperty('height', '34px', 'important'); 
bgWrapper.style.setProperty('margin-left', 'auto', 'important'); 
bgWrapper.style.position = 'relative';

const bgInput = document.createElement('input')
bgInput.type = 'color'; 
bgInput.className = 'color-palette-input'; 
bgInput.id = 'backgroundColor'; 
bgInput.value = bitmapFont.parameters.backgroundColor;
bgInput.style.cursor = 'pointer'; 

bgWrapper.appendChild(bgInput); 
bgRow.appendChild(bgLabel); 
bgRow.appendChild(bgWrapper);   

bgInput.addEventListener('input', (e) => {
    const color = e.currentTarget.value
    bitmapFont.parameters.backgroundColor = color
    const mainElement = document.getElementById('main'); if (mainElement) mainElement.style.backgroundColor = color
    const asideElement = document.querySelector('aside'); if (asideElement) asideElement.style.backgroundColor = color
    document.documentElement.style.setProperty('--panel-bg-color', color)
    const textColor = getContrastColor(color)
    document.documentElement.style.setProperty('--text-color', textColor)
    const summaryColor = (textColor === '#FFFFFF') ? '#9AA3A9' : '#000000'
    document.documentElement.style.setProperty('--summary-text-color', summaryColor)
    document.querySelectorAll('.control-label, .control-value, .xy-pad-label, .pixel-shape-label, .preset-header, label, span').forEach(el => el.style.setProperty('color', textColor, 'important'))
    if (window.gridControllerInstance) window.gridControllerInstance.drawGrid()
})
colorContent.appendChild(bgRow)

const paletteContainer = document.createElement('div')
paletteContainer.style.display = 'flex'; paletteContainer.style.gap = '8px'; paletteContainer.style.marginTop = '16px'; paletteContainer.style.marginBottom = '20px'; paletteContainer.style.width = '100%'
paletteContainer.style.padding = '0'

controlsColor.forEach((control) => {
    const initialValue = _.get(bitmapFont, control.path)
    const wrapper = document.createElement('div'); wrapper.className = 'color-input-wrapper'; wrapper.style.flex = '1'; wrapper.style.position = 'relative'; wrapper.style.height = '34px'
    const isTransparent = (val) => val && (val.includes(', 0)') || val.includes(', 0.00)'));
    const transparencyBg = document.createElement('div'); transparencyBg.className = 'transparency-bg'; wrapper.appendChild(transparencyBg)
    const input = document.createElement('input'); input.type = 'color'; input.className = 'color-palette-input'; input.id = control.path; input.value = hslaToHex(initialValue); input.style.opacity = isTransparent(initialValue) ? '0' : '1'
    const updateState = (hslaVal) => { _.set(bitmapFont, control.path, hslaVal); input.value = hslaToHex(hslaVal); input.style.opacity = isTransparent(hslaVal) ? '0' : '1'; emptyCanvas(); renderGrid(); renderText(bitmapFont.preview.character) }
    input.oninput = (e) => { updateState(hexToHsla(e.currentTarget.value)) }
    wrapper.appendChild(input)
    const clearBtn = document.createElement('div'); clearBtn.className = 'clear-color-btn'; clearBtn.title = "Set Transparent"; clearBtn.onclick = (e) => { e.stopPropagation(); e.preventDefault(); updateState('hsla(0, 0%, 0%, 0)') }; wrapper.appendChild(clearBtn)
    paletteContainer.appendChild(wrapper)
})
colorContent.appendChild(paletteContainer)

colorNumberControls.forEach((control) => renderNumberControl(control, colorContent))

// NEGATIVE SPACE
const zeroHeaderProp = document.createElement('div')
zeroHeaderProp.style.marginTop = '24px'; zeroHeaderProp.style.marginBottom = '12px'; zeroHeaderProp.style.borderTop = '1px solid #444'; zeroHeaderProp.style.paddingTop = '16px'; zeroHeaderProp.style.display = 'flex'; zeroHeaderProp.style.alignItems = 'center'; zeroHeaderProp.style.gap = '10px'
zeroHeaderProp.style.padding = '0'; zeroHeaderProp.style.paddingTop = '16px'

const zeroToggle = document.createElement('input'); zeroToggle.type = 'checkbox'; zeroToggle.id = 'toggleNegativeSpace'; zeroToggle.checked = bitmapFont.parameters.showNegativeSpace === true; zeroToggle.style.margin = '0'; zeroToggle.style.width = '16px'; zeroToggle.style.height = '16px'; zeroToggle.style.cursor = 'pointer'; zeroToggle.style.accentColor = 'var(--text-color)'
const zeroLabel = document.createElement('label'); zeroLabel.htmlFor = 'toggleNegativeSpace'; zeroLabel.className = 'control-label'; zeroLabel.style.fontSize = '12px'; zeroLabel.style.fontWeight = 'bold'; zeroLabel.style.color = 'var(--text-color)'; zeroLabel.style.cursor = 'pointer'; zeroLabel.textContent = 'Negative Space'
zeroHeaderProp.appendChild(zeroToggle); zeroHeaderProp.appendChild(zeroLabel); colorContent.appendChild(zeroHeaderProp)

const zeroContentWrapper = document.createElement('div'); zeroContentWrapper.style.transition = 'opacity 0.3s ease, max-height 0.3s ease, margin-bottom 0.3s ease'; zeroContentWrapper.style.overflow = 'hidden'
if (zeroToggle.checked) { zeroContentWrapper.style.opacity = '1'; zeroContentWrapper.style.maxHeight = '500px'; zeroContentWrapper.style.pointerEvents = 'auto'; zeroContentWrapper.style.marginBottom = '20px' } 
else { zeroContentWrapper.style.opacity = '0'; zeroContentWrapper.style.maxHeight = '0px'; zeroContentWrapper.style.pointerEvents = 'none'; zeroContentWrapper.style.marginBottom = '0px' }
colorContent.appendChild(zeroContentWrapper)

const zeroPaletteContainer = document.createElement('div'); zeroPaletteContainer.style.display = 'flex'; zeroPaletteContainer.style.gap = '8px'; zeroPaletteContainer.style.marginBottom = '20px'; zeroPaletteContainer.style.width = '100%'
zeroPaletteContainer.style.padding = '8px 8px 0 0';

zeroControlsColor.forEach((control) => {
    let initialValue = _.get(bitmapFont, control.path)
    if (!initialValue) { if(control.path.includes('zeroColor0')) initialValue = 'hsla(0, 0%, 90%, 1.00)'; if(control.path.includes('zeroColor1')) initialValue = 'hsla(0, 0%, 95%, 1.00)'; if(control.path.includes('zeroColor2')) initialValue = 'hsla(0, 0%, 85%, 1.00)'; _.set(bitmapFont, control.path, initialValue); }
    const wrapper = document.createElement('div'); wrapper.className = 'color-input-wrapper'; wrapper.style.flex = '1'; wrapper.style.position = 'relative'; wrapper.style.height = '34px'
    const isTransparent = (val) => val && (val.includes(', 0)') || val.includes(', 0.00)'));
    const transparencyBg = document.createElement('div'); transparencyBg.className = 'transparency-bg'; wrapper.appendChild(transparencyBg)
    const input = document.createElement('input'); input.type = 'color'; input.className = 'color-palette-input'; input.id = control.path; input.value = hslaToHex(initialValue); input.style.opacity = isTransparent(initialValue) ? '0' : '1'
    const updateState = (hslaVal) => { _.set(bitmapFont, control.path, hslaVal); input.value = hslaToHex(hslaVal); input.style.opacity = isTransparent(hslaVal) ? '0' : '1'; emptyCanvas(); renderGrid(); renderText(bitmapFont.preview.character) }
    input.oninput = (e) => { updateState(hexToHsla(e.currentTarget.value)) }
    wrapper.appendChild(input)
    const clearBtn = document.createElement('div'); clearBtn.className = 'clear-color-btn'; clearBtn.title = "Set Transparent"; clearBtn.onclick = (e) => { e.stopPropagation(); e.preventDefault(); updateState('hsla(0, 0%, 0%, 0)') }; wrapper.appendChild(clearBtn)
    zeroPaletteContainer.appendChild(wrapper)
})
zeroContentWrapper.appendChild(zeroPaletteContainer)
zeroColorNumberControls.forEach((control) => renderNumberControl(control, zeroContentWrapper))

zeroToggle.addEventListener('change', (e) => {
    const isActive = e.target.checked; bitmapFont.parameters.showNegativeSpace = isActive;
    if (isActive) { zeroContentWrapper.style.maxHeight = '500px'; zeroContentWrapper.style.opacity = '1'; zeroContentWrapper.style.marginBottom = '20px'; zeroContentWrapper.style.pointerEvents = 'auto' } 
    else { zeroContentWrapper.style.maxHeight = '0px'; zeroContentWrapper.style.opacity = '0'; zeroContentWrapper.style.marginBottom = '0px'; zeroContentWrapper.style.pointerEvents = 'none' }
    emptyCanvas(); renderGrid(); if(bitmapFont.preview && bitmapFont.preview.text) renderText(); else renderText(bitmapFont.preview.character)
})

// 图标容器逻辑
let iconContainer = document.getElementById('floating-icons-container');
const asidePanel = document.querySelector('aside');
if (!iconContainer) {
    iconContainer = document.createElement('div');
    iconContainer.id = 'floating-icons-container';
    if (asidePanel) asidePanel.insertBefore(iconContainer, asidePanel.firstChild);
    else document.body.appendChild(iconContainer);
} else {
    if (asidePanel && iconContainer.parentNode !== asidePanel) asidePanel.insertBefore(iconContainer, asidePanel.firstChild);
}

// 遍历生成两个图标按钮
controlsSwitch.forEach((control) => {
    // 1. 创建一个单元格容器 (Icon Cell)
    const cell = document.createElement('div');
    cell.className = 'icon-cell'; // ✨ 加上这个类名，它就会变成正方形且有边框

    if (control.label === 'Pixel Shape') {
        const currentVal = _.get(bitmapFont, control.path);
        
        const morphBtn = document.createElement('button');
        morphBtn.className = 'shape-morph-btn';
        morphBtn.id = 'shape-morph-btn';
        
        if (currentVal === 'square') morphBtn.classList.add('is-square');
        
        const rotator = document.createElement('div');
        rotator.className = 'morph-rotator';
        const icon = document.createElement('div');
        icon.className = 'morph-icon';
        rotator.appendChild(icon);
        morphBtn.appendChild(rotator);

        morphBtn.onclick = () => {
            const isSquare = morphBtn.classList.contains('is-square');
            const newValue = isSquare ? 'circle' : 'square';
            
            if (newValue === 'square') {
                morphBtn.classList.add('is-square');
            } else {
                morphBtn.classList.remove('is-square');
            }
            _.set(bitmapFont, control.path, newValue);
            emptyCanvas(); renderGrid(); renderText(bitmapFont.preview.character);
        };
        
        // 👇 把按钮放进单元格，再把单元格放进容器
        cell.appendChild(morphBtn);
        iconContainer.appendChild(cell);

    } 
    else if (control.label === 'Gradient Type') {
        const currentVal = _.get(bitmapFont, control.path);

        const gradToggleBtn = document.createElement('button');
        gradToggleBtn.className = 'gradient-toggle-btn';
        gradToggleBtn.id = 'gradient-toggle-btn';
        
        if (currentVal === 'radial') {
            gradToggleBtn.classList.add('is-radial');
        }

        gradToggleBtn.onclick = () => {
            const isRadialNow = gradToggleBtn.classList.contains('is-radial');
            const newValue = isRadialNow ? 'linear' : 'radial'; 

            if (newValue === 'radial') {
                gradToggleBtn.classList.add('is-radial');
            } else {
                gradToggleBtn.classList.remove('is-radial');
            }

            _.set(bitmapFont, control.path, newValue);
            emptyCanvas(); renderGrid(); renderText(bitmapFont.preview.character);
        };
        
        // 👇 把按钮放进单元格，再把单元格放进容器
        cell.appendChild(gradToggleBtn);
        iconContainer.appendChild(cell);
    }
});

// Grid Controller
class GridDragController {
    constructor(container) {
        this.container = container; this.canvas = document.createElement('canvas'); this.canvas.style.display = 'block'; this.canvas.style.width = '100%'; this.canvas.style.height = '100%'; this.canvas.style.touchAction = 'none'; this.canvas.style.cursor = 'default'; this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d'); this.params = bitmapFont.parameters; this.isDragging = false; this.dragType = null; this.dragIndex = -1; this.hitRadius = 8; this.isHovering = false;
        this._bindEvents(); this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(this.container); setTimeout(() => this.resize(), 0)
    }
    resize() { if (!this.container) return; const width = this.container.clientWidth, height = this.container.clientHeight, dpr = window.devicePixelRatio || 1; this.canvas.width = width * dpr; this.canvas.height = height * dpr; this.canvas.style.width = `${width}px`; this.canvas.style.height = `${height}px`; this.ctx.scale(dpr, dpr); this.width = width; this.height = height; this.drawGrid() }
    _bindEvents() { this.canvas.addEventListener('mousedown', this._onStart.bind(this)); this.canvas.addEventListener('touchstart', this._onStart.bind(this), { passive: false }); window.addEventListener('mousemove', this._onMove.bind(this)); window.addEventListener('touchmove', this._onMove.bind(this), { passive: false }); window.addEventListener('mouseup', this._onEnd.bind(this)); window.addEventListener('touchend', this._onEnd.bind(this)) }
    _getPos(e) { const rect = this.canvas.getBoundingClientRect(), clientX = e.touches ? e.touches[0].clientX : e.clientX, clientY = e.touches ? e.touches[0].clientY : e.clientY; return { x: (clientX - rect.left) / rect.width * this.width, y: (clientY - rect.top) / rect.height * this.height, nx: (clientX - rect.left) / rect.width, ny: (clientY - rect.top) / rect.height } }
    _onStart(e) {
        if (e.cancelable) e.preventDefault()
        const p = this._getPos(e), { colPositions, rowPositions } = this.params;
        for (let i = 1; i < colPositions.length - 1; i++) if (Math.abs(p.x - colPositions[i] * this.width) < this.hitRadius) { this.isDragging = true; this.dragType = 'col'; this.dragIndex = i; return }
        for (let j = 1; j < rowPositions.length - 1; j++) if (Math.abs(p.y - rowPositions[j] * this.height) < this.hitRadius) { this.isDragging = true; this.dragType = 'row'; this.dragIndex = j; return }
    }
    _onMove(e) {
        const p = this._getPos(e), { colPositions, rowPositions } = this.params;
        if (!this.isDragging) { let cursor = 'default'; for (let i = 1; i < colPositions.length - 1; i++) if (Math.abs(p.x - colPositions[i] * this.width) < this.hitRadius) cursor = 'col-resize'; if (cursor === 'default') for (let j = 1; j < rowPositions.length - 1; j++) if (Math.abs(p.y - rowPositions[j] * this.height) < this.hitRadius) cursor = 'row-resize'; this.canvas.style.cursor = cursor; return }
        if (e.cancelable) e.preventDefault()
        if (this.dragType === 'col') { const i = this.dragIndex; colPositions[i] = Math.max(colPositions[i - 1] + 0.02, Math.min(colPositions[i + 1] - 0.02, p.nx)) } 
        else if (this.dragType === 'row') { const j = this.dragIndex; rowPositions[j] = Math.max(rowPositions[j - 1] + 0.02, Math.min(rowPositions[j + 1] - 0.02, p.ny)) }
        this.drawGrid(); if (typeof emptyCanvas === 'function') emptyCanvas(); if (typeof renderGrid === 'function') renderGrid(); if (typeof renderText === 'function') renderText()
    }
    _onEnd() { this.isDragging = false; this.dragType = null }
    drawGrid() {
        if (!this.ctx || !this.width || !this.height) return
        const ctx = this.ctx, width = this.width, height = this.height, { colPositions, rowPositions } = this.params
        const style = getComputedStyle(document.body);
        const textColor = style.getPropertyValue('--text-color').trim() || '#000000';
        const borderColor = style.getPropertyValue('--border-color').trim() || '#555555';

        ctx.clearRect(0, 0, width, height)
        colPositions.forEach((pos, idx) => { 
            if (idx !== 0 && idx !== colPositions.length - 1) { 
                const x = Math.floor(pos * width) + 0.5; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); 
                ctx.strokeStyle = borderColor; ctx.lineWidth = 1; ctx.stroke(); ctx.fillStyle = textColor; ctx.beginPath(); ctx.arc(pos * width, height / 2, 4, 0, Math.PI * 2); ctx.fill() 
            } 
        })
        rowPositions.forEach((pos, idx) => { 
            if (idx !== 0 && idx !== rowPositions.length - 1) { 
                const y = Math.floor(pos * height) + 0.5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); 
                ctx.strokeStyle = borderColor; ctx.lineWidth = 1; ctx.stroke(); ctx.fillStyle = textColor; ctx.beginPath(); ctx.arc(width / 2, pos * height, 4, 0, Math.PI * 2); ctx.fill() 
            } 
        })
    }
}

function createGridControlPanel() {
    const details = document.createElement('details'); details.open = true; 
    const summary = document.createElement('summary'); summary.textContent = 'Grid Layout'; details.appendChild(summary)
    const content = document.createElement('div'); content.className = 'grid-control-content'; content.style.padding = '0'; 
    const hint = document.createElement('div'); hint.textContent = 'Drag Lines to Adjust Grid'; hint.className = 'control-label'; 
    hint.style.flexBasis = 'auto'; hint.style.height = 'auto'; hint.style.marginBottom = '8px'; 
    
    // ❌ 移除内联字体设置
    // hint.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif"; 
    hint.style.fontWeight = '400'; hint.style.fontSize = '12px'; hint.style.letterSpacing = '0.5px'; hint.style.color = 'var(--text-color)'; hint.style.textAlign = 'left'; 
    
    content.appendChild(hint)
    const container = document.createElement('div'); container.style.width = '100%'; container.style.aspectRatio = '3 / 1'; container.style.position = 'relative'; container.style.backgroundColor = 'transparent'; container.style.marginBottom = '12px'; container.style.borderRadius = '4px'; container.style.overflow = 'hidden'; content.appendChild(container)
    
    const btnContainer = document.createElement('div'); btnContainer.style.display = 'flex'; btnContainer.style.gap = '10px'; btnContainer.style.marginBottom = '8px'; content.appendChild(btnContainer)
    
    const resetBtn = document.createElement('button'); resetBtn.textContent = 'Reset Grid'; resetBtn.className = 'capsule-btn'; resetBtn.onclick = () => { const { columns, rows } = bitmapFont.parameters; bitmapFont.parameters.colPositions = Array.from({length: parseInt(columns) + 1}, (_, i) => i / columns); bitmapFont.parameters.rowPositions = Array.from({length: parseInt(rows) + 1}, (_, i) => i / rows); if (window.gridControllerInstance) window.gridControllerInstance.drawGrid(); emptyCanvas(); renderGrid(); renderText() }; btnContainer.appendChild(resetBtn)
    
    const randomBtn = document.createElement('button'); randomBtn.textContent = 'Random'; randomBtn.className = 'capsule-btn'; 
    let randomAnimationId = null;
    randomBtn.onclick = () => {
        const { columns, rows } = bitmapFont.parameters;
        const generateRandoms = (count) => {
            const n = parseInt(count); if (n <= 1) return [0, 1]
            let minGap = 0.03; if (n * minGap > 0.85) minGap = 0.85 / n
            const availableSpace = 1.0 - (n * minGap), weights = []; let totalWeight = 0; for(let i=0; i<n; i++) { const w = Math.random() + 0.2; weights.push(w); totalWeight += w }
            let currentPos = 0; const result = [0]; for(let i=0; i<n-1; i++) { const segment = minGap + (weights[i] / totalWeight) * availableSpace; currentPos += segment; result.push(currentPos) }
            result.push(1); return result
        }
        const targetCols = generateRandoms(columns), targetRows = generateRandoms(rows)
        if (randomAnimationId) cancelAnimationFrame(randomAnimationId)
        const startCols = [...(bitmapFont.parameters.colPositions || [])], startRows = [...(bitmapFont.parameters.rowPositions || [])]
        if (startCols.length !== targetCols.length) { const defaultCols = Array.from({length: parseInt(columns) + 1}, (_, i) => i / columns); bitmapFont.parameters.colPositions = [...defaultCols]; startCols.length = 0; startCols.push(...defaultCols) }
        if (startRows.length !== targetRows.length) { const defaultRows = Array.from({length: parseInt(rows) + 1}, (_, i) => i / rows); bitmapFont.parameters.rowPositions = [...defaultRows]; startRows.length = 0; startRows.push(...defaultRows) }
        const startTime = performance.now(), duration = 1200, easeOutElastic = (x) => x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * (2 * Math.PI) / 6) + 1
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime; let progress = elapsed / duration
            if (progress >= 1) { progress = 1; bitmapFont.parameters.colPositions = targetCols; bitmapFont.parameters.rowPositions = targetRows; randomAnimationId = null } 
            else { const ease = easeOutElastic(progress); bitmapFont.parameters.colPositions = startCols.map((start, i) => start + ((targetCols[i] !== undefined ? targetCols[i] : start) - start) * ease); bitmapFont.parameters.rowPositions = startRows.map((start, i) => start + ((targetRows[i] !== undefined ? targetRows[i] : start) - start) * ease); randomAnimationId = requestAnimationFrame(animate) }
            if (window.gridControllerInstance) window.gridControllerInstance.drawGrid(); emptyCanvas(); renderGrid(); renderText()
        }
        randomAnimationId = requestAnimationFrame(animate)
    }; btnContainer.appendChild(randomBtn); details.appendChild(content)
    
    if (controlWrapper.children.length > 1) controlWrapper.insertBefore(details, controlWrapper.children[2]);
    else controlWrapper.appendChild(details)
    setTimeout(() => { window.gridControllerInstance = new GridDragController(container) }, 100)
    details.addEventListener('toggle', () => { if (details.open && window.gridControllerInstance) window.gridControllerInstance.resize() })
}

const initApp = () => {
    createGridControlPanel();
    setTimeout(() => {
        if (typeof bitmapFont !== 'undefined') {
            const initialText = "Riff is a variable\nTypetool based on\ncontinuous change."; bitmapFont.preview.text = initialText
            const presetBtns = document.getElementById('preset-buttons'); let hasTriggered = false
            if (presetBtns && presetBtns.children.length > 0) {
                const preset1 = presetBtns.children[0]; if (preset1) { preset1.click(); hasTriggered = true; setTimeout(() => { bitmapFont.parameters.spacing = 0; const spInput = document.getElementById('parameters.spacing'); if(spInput) { spInput.value = 0; if(spInput._valueSpan) spInput._valueSpan.textContent = '0' } emptyCanvas(); if (window.gridControllerInstance) window.gridControllerInstance.drawGrid(); if (typeof renderText === 'function') renderText() }, 100) }
            }
            if (!hasTriggered) { if (typeof emptyCanvas === 'function') emptyCanvas(); if (window.gridControllerInstance) window.gridControllerInstance.drawGrid(); if (typeof renderGrid === 'function') renderGrid(); if (typeof renderText === 'function') renderText() }
        }
    }, 200)
}
window.addEventListener('load', initApp)

// ✅✅✅ 更新 UI 逻辑：确保上下两部分滑块都能更新 ✅✅✅
function updateControlsDisplay() {
    const updateSliders = (controls) => { controls.forEach(ctl => { const input = document.getElementById(ctl.path); if (input && input._valueSpan) { const val = _.get(bitmapFont, ctl.path); if (val !== undefined) { input.value = val; input._valueSpan.textContent = Math.round(val * 100) / 100 } } }) }
    
    updateSliders(georgeControls); 
    
    // 更新上半部分
    updateSliders(depthControlsTop); 
    
    // 更新下半部分 (Scale Variation)
    updateSliders(depthControlsBottom);

    updateSliders(colorNumberControls); 
    updateSliders(zeroColorNumberControls)
    
    const updateColors = (controls) => { controls.forEach(ctl => { const input = document.getElementById(ctl.path); if (input) { let val = _.get(bitmapFont, ctl.path); if (!val && ctl.path.includes('zeroColor')) { if(ctl.path.endsWith('0')) val = 'hsla(0, 0%, 90%, 1.00)'; else if(ctl.path.endsWith('1')) val = 'hsla(0, 0%, 95%, 1.00)'; else if(ctl.path.endsWith('2')) val = 'hsla(0, 0%, 85%, 1.00)'; _.set(bitmapFont, ctl.path, val) } if (!val && ctl.path === 'parameters.color0') val = 'hsla(0, 0%, 0%, 1.00)'; if (!val && ctl.path === 'parameters.color1') val = 'hsla(0, 0%, 0%, 1.00)'; if (!val && ctl.path === 'parameters.color2') val = 'hsla(0, 0%, 100%, 1.00)'; if (val) { input.value = hslaToHex(val); const isTrans = (val.includes(', 0)') || val.includes(', 0.00)')); input.style.opacity = isTrans ? '0' : '1' } } }) }
    updateColors(controlsColor); updateColors(zeroControlsColor)
    const zeroToggle = document.getElementById('toggleNegativeSpace'); 
    if (zeroToggle) { const isActive = bitmapFont.parameters.showNegativeSpace === true; zeroToggle.checked = isActive; if (typeof zeroContentWrapper !== 'undefined') { if (isActive) { zeroContentWrapper.style.maxHeight = '500px'; zeroContentWrapper.style.opacity = '1'; zeroContentWrapper.style.marginBottom = '20px'; zeroContentWrapper.style.pointerEvents = 'auto' } else { zeroContentWrapper.style.maxHeight = '0px'; zeroContentWrapper.style.opacity = '0'; zeroContentWrapper.style.marginBottom = '0px'; zeroContentWrapper.style.pointerEvents = 'none' } } }
    const bgInput = document.getElementById('backgroundColor'); if (bgInput && bitmapFont.parameters.backgroundColor) { bgInput.value = bitmapFont.parameters.backgroundColor; const event = new Event('input'); bgInput.dispatchEvent(event) }
    const xyContainer = document.querySelector('.xy-pad-container'); if (xyContainer && xyContainer._updateHandle) xyContainer._updateHandle()
    
    controlsSwitch.forEach(ctl => {
        const val = _.get(bitmapFont, ctl.path);
        if (ctl.label === 'Pixel Shape') {
            const btn = document.getElementById('shape-morph-btn');
            if(btn) {
                if (val === 'square') btn.classList.add('is-square');
                else btn.classList.remove('is-square');
            }
        } else if (ctl.label === 'Gradient Type') {
            const btn = document.getElementById('gradient-toggle-btn');
            if(btn) {
                if (val === 'radial') btn.classList.add('is-radial');
                else btn.classList.remove('is-radial');
            }
        }
    });

    if (window.gridControllerInstance) window.gridControllerInstance.drawGrid(); if (typeof renderText === 'function') renderText()
}
document.addEventListener('click', (e) => {
    if (e.target.closest('.preset-btn') || e.target.closest('#preset-panel button')) {
        setTimeout(() => {
            if(!bitmapFont.parameters.zeroColor0) bitmapFont.parameters.zeroColor0 = 'hsla(0, 0%, 90%, 1.00)'; if(!bitmapFont.parameters.zeroColor1) bitmapFont.parameters.zeroColor1 = 'hsla(0, 0%, 95%, 1.00)'; if(!bitmapFont.parameters.zeroColor2) bitmapFont.parameters.zeroColor2 = 'hsla(0, 0%, 85%, 1.00)';
            if(bitmapFont.parameters.zeroOffet0 === undefined) bitmapFont.parameters.zeroOffet0 = 20; if(bitmapFont.parameters.zeroOffet1 === undefined) bitmapFont.parameters.zeroOffet1 = 40; if(bitmapFont.parameters.zeroOffet2 === undefined) bitmapFont.parameters.zeroOffet2 = 60;
            updateControlsDisplay(); emptyCanvas(); if (window.gridControllerInstance) window.gridControllerInstance.drawGrid(); if (typeof renderText === 'function') renderText()
        }, 150)
    }
});

function setupRandomButton() {
    const presetContainer = document.getElementById('preset-buttons');
    if (!presetContainer) return;
    const existingBtn = document.getElementById('random-gen-btn');
    if (existingBtn) existingBtn.remove();
    const randomBtn = document.createElement('button'); randomBtn.id = 'random-gen-btn'; randomBtn.className = 'preset-btn'; randomBtn.textContent = '🎲';

    randomBtn.addEventListener('click', () => {
        georgeControls.forEach(ctl => {
            if (ctl.label === 'Cycles' || ctl.label === 'Steps' || ctl.label === 'Size') return; 
            if (ctl.min !== undefined && ctl.max !== undefined) {
                const range = ctl.max - ctl.min;
                let val = Math.random() * range + ctl.min;
                if (ctl.step) val = Math.round(val / ctl.step) * ctl.step;
                _.set(bitmapFont, ctl.path, val);
            }
        });
        [colorNumberControls, zeroColorNumberControls].forEach(group => { group.forEach(ctl => { const range = ctl.max - ctl.min; let val = Math.random() * range + ctl.min; _.set(bitmapFont, ctl.path, val); }); });
        controlsSwitch.forEach(ctl => {
            if (ctl.options && ctl.options.length) {
                const randomOption = ctl.options[Math.floor(Math.random() * ctl.options.length)];
                if (ctl.label === 'Pixel Shape') {
                    const btn = document.getElementById('shape-morph-btn'); const targetVal = randomOption.value;
                    if (btn) { const isSquareNow = btn.classList.contains('is-square'); const targetIsSquare = (targetVal === 'square'); if (isSquareNow !== targetIsSquare) btn.click(); } else _.set(bitmapFont, ctl.path, targetVal);
                } else if (ctl.label === 'Gradient Type') {
                    const btn = document.getElementById('gradient-toggle-btn'); const targetVal = randomOption.value;
                    if(btn) { const isRadialNow = btn.classList.contains('is-radial'); const targetIsRadial = (targetVal === 'radial'); if(isRadialNow !== targetIsRadial) btn.click(); } else _.set(bitmapFont, ctl.path, targetVal);
                } else _.set(bitmapFont, ctl.path, randomOption.value);
            }
        });
        const randColor = () => `hsla(${Math.floor(Math.random() * 360)}, ${Math.floor(Math.random() * 50 + 50)}%, ${Math.floor(Math.random() * 40 + 50)}%, 1)`;
        controlsColor.forEach(ctl => _.set(bitmapFont, ctl.path, randColor()));
        zeroControlsColor.forEach(ctl => _.set(bitmapFont, ctl.path, randColor()));
        updateControlsDisplay(); emptyCanvas(); if (window.gridControllerInstance) window.gridControllerInstance.drawGrid(); renderGrid(); renderText();            
        randomBtn.style.backgroundColor = 'var(--text-color)'; randomBtn.style.color = 'var(--panel-bg-color)'; setTimeout(() => { randomBtn.style.backgroundColor = ''; randomBtn.style.color = ''; }, 200);
    });
    presetContainer.appendChild(randomBtn);
}
window.addEventListener('load', setupRandomButton);




// ===== 预设面板拖拽逻辑修复 =====
function makePresetPanelDraggable() {
    const panel = document.getElementById('preset-panel');
    const header = panel.querySelector('.preset-header');
    
    if (!panel || !header) return;

    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    header.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        
        // 只有点击 Header 区域才能触发拖拽
        if (e.target === header) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            // 使用 transform 移动面板，不会破坏原有的 fixed 布局
            panel.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
}

// 在页面加载后启动拖拽功能
window.addEventListener('load', makePresetPanelDraggable);

// =======================================================
// 👇👇👇 底部功能区：Grid 完美对齐版 👇👇👇
// =======================================================

function setupActionButtons() {
    const iconContainer = document.getElementById('floating-icons-container');
    if (!iconContainer) return;

    // 1. 清理旧的底部按钮
    const existingBottom = document.getElementById('bottom-action-wrapper');
    if (existingBottom) existingBottom.remove();

    // 2. 创建底部容器
    const bottomWrapper = document.createElement('div');
    bottomWrapper.id = 'bottom-action-wrapper';
    bottomWrapper.style.width = '100%';
    bottomWrapper.style.marginTop = 'auto'; // 推到侧边栏最底部
    // 移除 paddingBottom，让格子紧贴底部 (如果需要留白，可以加在 fillCell 下面，但通常 Grid 不需要)
    bottomWrapper.style.display = 'flex';
    bottomWrapper.style.flexDirection = 'column'; 
    bottomWrapper.style.alignItems = 'center';
    
    // 3. 定义“格子”生成函数 (关键：aspect-ratio: 1/1)
    const createGridCell = (hasBorder) => {
        const cell = document.createElement('div');
        cell.style.width = '100%';
        cell.style.aspectRatio = '1 / 1'; // 🔴 强制正方形，确保是完美的 Grid
        cell.style.display = 'flex';
        cell.style.justifyContent = 'center'; // 水平居中
        cell.style.alignItems = 'center';     // 垂直居中
        cell.style.boxSizing = 'border-box';
        
        // 使用边框作为分割线，保证几何位置不被挤压
        if (hasBorder) {
            cell.style.borderBottom = '1.45px solid var(--border-color)';
        }
        return cell;
    };

    // 4. 定义按钮生成函数 (样式不变)
    const createBtn = (text, onClick) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        
        btn.style.width = '40px'; 
        btn.style.height = '40px'; 
        btn.style.borderRadius = '4px'; 
        btn.style.border = '2px solid var(--summary-text-color)'; 
        btn.style.background = 'transparent';
        btn.style.cursor = 'pointer';
        
        btn.style.fontFamily = "'IBM Plex Mono', monospace";
        btn.style.fontWeight = '700'; 
        btn.style.fontSize = '10px';  
        btn.style.textTransform = 'uppercase';
        btn.style.color = 'var(--summary-text-color)';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.padding = '0';
        btn.style.transition = 'all 0.2s ease';

        btn.onmouseenter = () => {
            btn.style.borderColor = 'var(--text-color)';
            btn.style.color = 'var(--text-color)';
            btn.style.transform = 'scale(1.05)';
        };
        btn.onmouseleave = () => {
            btn.style.borderColor = 'var(--summary-text-color)';
            btn.style.color = 'var(--summary-text-color)';
            btn.style.transform = 'scale(1)';
        };
        btn.onclick = () => {
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => btn.style.transform = 'scale(1)', 100);
            onClick();
        };

        return btn;
    };

    // 5. 组装 CLEAR 格子 (带下划线)
    const clearCell = createGridCell(true); // true = 开启下边框作为分割线
    const clearBtn = createBtn('CLEAR', () => {
        if (typeof bitmapFont !== 'undefined' && bitmapFont.preview) {
            bitmapFont.preview.text = ""; 
            if (typeof cursorIndex !== 'undefined') cursorIndex = 0;
            if (typeof emptyCanvas === 'function') emptyCanvas();
            if (typeof renderText === 'function') renderText();
        }
    });
    clearCell.appendChild(clearBtn);

    // 6. 组装 FILL 格子 (无边框)
    const fillCell = createGridCell(false);
    const fillBtn = createBtn('FILL', () => {
        if (typeof bitmapFont !== 'undefined' && bitmapFont.preview) {
            bitmapFont.preview.text = "Transcoding\nTypography\nFeb 6-8 2026\nRiff TypeTool";
            if (typeof cursorIndex !== 'undefined') cursorIndex = bitmapFont.preview.text.length;
            if (typeof emptyCanvas === 'function') emptyCanvas();
            if (typeof renderText === 'function') renderText();
        }
    });
    fillCell.appendChild(fillBtn);

    // 7. 添加到容器
    bottomWrapper.appendChild(clearCell);
    bottomWrapper.appendChild(fillCell);
    
    iconContainer.appendChild(bottomWrapper);
}

// 确保在页面加载后执行
window.addEventListener('load', setupActionButtons);