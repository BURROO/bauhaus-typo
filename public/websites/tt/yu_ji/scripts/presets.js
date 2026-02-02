// 预设配置管理器
// 预设配置管理器
// 预设配置管理器
const PRESETS = {
    // 1. Basic
    preset7: {
        name: 'Basic',
        parameters: {
            // Geometry
            width: 1004,
            size: 1,
            spacing: 0,
            radius: 101,
            slant: 1,
            gradientRepetition: 1,
            pixelSubdivision: 0,
            showGrid: true,
            randomGrid: false, 

            // Depth & Effects
            gradientAngleOffset: 0,
            copies: {
                count: 1,
                offset: { scale: 0, x: 0, y: 0 }
            },
            charScaleVariation: 0,
            noise: 0,
            waveAmplitude: 0,
            waveFrequency: 0,

            // Color
            offet0: 0,
            offet1: 100,
            offet2: 100,
            pixelShape: 'square',
            gradientType: 'linear',
            color0: '#4d2214',
            color1: '#FF94EB',
            color2: 'hsla(0, 0%, 0%, 0)',
            backgroundColor: '#ededed',
            
            showNegativeSpace: false,
            _animates: ['parameters.offet1']
        }
    },

    // 2. Granular
    preset1: {
        name: 'Granular', 
        parameters: {
            width: 1004,
            size: 1,
            spacing: 0,
            radius: 100,
            slant: 100,
            pixelSubdivision: 0,
            showGrid: true,
            colPositions: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1],
            rowPositions: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1],
            gradientAngleOffset: 0,
            copies: { count: 1, offset: { scale: 0, x: 0, y: 0 } },
            charScaleVariation: 0,
            noise: 0,
            waveAmplitude: 0,
            waveFrequency: 0,
            offet0: 0,
            offet1: 200,
            offet2: 100,
            pixelShape: 'circle',
            gradientType: 'linear',
            color0: '#3de8ff',
            color1: '#ff8080',
            color2: '#fea9ef',
            showNegativeSpace: true,
            zeroColor0: '#ffffff',
            zeroColor1: '#ffffff',
            zeroColor2: '#ffffff',
            zeroOffet0: 20, 
            zeroOffet1: 40,
            zeroOffet2: 60,
            backgroundColor: '#bfbfbf'
        }
    },

    // 3. Dither
    preset3: {
        name: 'Dither',
        parameters: {
            width: 918,
            size: 1.1,
            spacing: 312,
            radius: 253,
            slant: 0,
            pixelSubdivision: 40, 
            showGrid: true,
            randomGrid: false, 
            gradientAngleOffset: 285.01,
            copies: { count: 1, offset: { scale: -10, x: 0, y: 0 } },
            charScaleVariation: 84,
            noise: 0,
            waveAmplitude: 0,
            waveFrequency: 10,
            offet0: 30,
            offet1: 0,
            offet2: 100,
            pixelShape: 'circle',
            gradientType: 'radial',
            color0: '#000000',
            color1: 'hsla(0, 0%, 0%, 0)', 
            color2: 'hsla(0, 0%, 0%, 0)',
            backgroundColor: '#ededed', 
            _animates: ['parameters.gradientAngleOffset']
        }
    },

    // 4. Echo
    preset4: {
        name: 'Echo', 
        parameters: {
            width: 989,
            size: 0.95,
            spacing: 214.9,
            radius: 86,
            slant: 0,
            pixelSubdivision: 0,
            gradientRepetition: 1,
            showGrid: true,
            randomGrid: false, 
            gradientAngleOffset: 0,
            copies: { count: 16, offset: { scale: 10, x: 0, y: 0 } },
            charScaleVariation: 0,
            noise: 0,
            waveAmplitude: 0,
            waveFrequency: 0,
            offet0: 1,
            offet1: 66,
            offet2: 56,
            pixelShape: 'square',
            gradientType: 'linear', 
            color0: '#ff0000',
            color1: '#001fbd',
            color2: '#ededed', 
            zeroColor0: 'hsla(0, 0%, 0%, 0)',
            zeroColor1: 'hsla(0, 0%, 0%, 0)',
            zeroColor2: 'hsla(0, 0%, 0%, 0)',
            backgroundColor: '#ededed',
            _animates: []
        }
    },

    // 5. Fuzz (这里原本是 Modular，现在换成了 Fuzz)
    preset2: {
        name: 'Fuzz',
        parameters: {
            width: 1004,
            size: 1.05,
            spacing: 0,
            radius: 101,
            slant: 0,
            gradientRepetition: 1,
            pixelSubdivision: 0,
            showGrid: true,
            randomGrid: true, 
            gradientAngleOffset: 0,
            copies: { count: 1, offset: { scale: 0, x: 0, y: 0 } },
            charScaleVariation: 0,
            noise: 0,
            waveAmplitude: 0,
            waveFrequency: 10,
            offet0: 25,
            offet1: 20.84,
            offet2: 100,
            pixelShape: 'square',
            gradientType: 'linear',
            color0: '#000000',
            color1: '#FFFFFF',
            color2: 'hsla(0, 0%, 0%, 0)',
            showNegativeSpace: true,
            zeroColor0: '#ffffff', 
            zeroColor1: '#000000', 
            zeroColor2: '#ffffff', 
            zeroOffet0: 0,
            zeroOffet1: 50,
            zeroOffet2: 100,
            backgroundColor: '#ededed',
            _animates: ['parameters.offet1', 'parameters.zeroOffet1']
        }
    },

    // 6. Stereo (位置不变)
    preset6: {
        name: 'Sawtooth',
        parameters: {
            width: 1026,
            size: 1,
            spacing: 161,
            radius: 106,
            slant: 0,
            pixelSubdivision: 0,
            showGrid: true,
            randomGrid: false, 
            gradientAngleOffset: 0,
            copies: { count: 13, offset: { scale: 0, x: -35, y: 0 } },
            charScaleVariation: 0,
            noise: 0,
            waveAmplitude: 0,
            waveFrequency: 10,
            offet0: 58,
            offet1: 0,
            offet2: 87,
            pixelShape: 'square',
            gradientType: 'linear',
            color0: '#AEAEAE',
            color1: '#000000',
            color2: '#000000',
            backgroundColor: '#ededed'
        }
    },

    // 7. Modular (原本在第5位，现在移到最后，替换了 Fuzz 的位置)
    preset5: {
        name: 'Modular',
        parameters: {
            spacing: 389,
            gradientAngleOffset: 0,
            width: 950,
            radius: 266,
            size: 1,
            copies: { count: 1, offset: { scale: -9, x: 0, y: 0 } },
            offet0: 20,
            offet1: 200,
            offet2: 60,
            characterScaleVariation: 0,
            showGrid: true,
            pixelShape: 'square',
            color0: 'hsl(0, 71%, 26%)',
            color1: 'hsla(299, 99%, 70%, 1.00)',
            color2: '#ededed',
            backgroundColor: '#ededed'
        }
    }
};

// 后续函数（applyPreset, initPresetPanel等）保持不变...
// 请确保将这部分代码也包含在您的 presets.js 中
function getContrastColor(hexColor) {
    if (!hexColor) return '#FFFFFF';
    if (hexColor.length === 4) {
        hexColor = '#' + hexColor[1] + hexColor[1] + hexColor[2] + hexColor[2] + hexColor[3] + hexColor[3];
    }
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
}

function applyPreset(presetKey) {
    const preset = PRESETS[presetKey];
    if (!preset) return;
    const params = preset.parameters;
    
    if (bitmapFont && bitmapFont.parameters) {
        // 1. 同步所有参数
        bitmapFont.parameters.spacing = params.spacing;
        bitmapFont.parameters.width = params.width;
        bitmapFont.parameters.radius = params.radius;
        bitmapFont.parameters.size = params.size || 1;
        bitmapFont.parameters.pixelSubdivision = params.pixelSubdivision || 0;
        bitmapFont.parameters.slant = params.slant || 0;
        bitmapFont.parameters.gradientRepetition = params.gradientRepetition || 1;
        bitmapFont.parameters.showGrid = params.showGrid !== undefined ? params.showGrid : true;
        bitmapFont.parameters.gradientAngleOffset = params.gradientAngleOffset;
        bitmapFont.parameters.copies = JSON.parse(JSON.stringify(params.copies));
        bitmapFont.parameters.charScaleVariation = params.charScaleVariation || 0;
        bitmapFont.parameters.noise = params.noise || 0;
        bitmapFont.parameters.waveAmplitude = params.waveAmplitude || 0;
        bitmapFont.parameters.waveFrequency = params.waveFrequency || 0;
        bitmapFont.parameters.offet0 = params.offet0;
        bitmapFont.parameters.offet1 = params.offet1;
        bitmapFont.parameters.offet2 = params.offet2;
        bitmapFont.parameters.pixelShape = params.pixelShape;
        bitmapFont.parameters.gradientType = params.gradientType; 
        bitmapFont.parameters.color0 = params.color0;
        bitmapFont.parameters.color1 = params.color1;
        bitmapFont.parameters.color2 = params.color2;
        bitmapFont.parameters.backgroundColor = params.backgroundColor;
        
        if (params.zeroColor0) bitmapFont.parameters.zeroColor0 = params.zeroColor0;
        if (params.zeroColor1) bitmapFont.parameters.zeroColor1 = params.zeroColor1;
        if (params.zeroColor2) bitmapFont.parameters.zeroColor2 = params.zeroColor2;
        bitmapFont.parameters.showNegativeSpace = params.showNegativeSpace || false;
        if (params.zeroOffet0 !== undefined) bitmapFont.parameters.zeroOffet0 = params.zeroOffet0;
        if (params.zeroOffet1 !== undefined) bitmapFont.parameters.zeroOffet1 = params.zeroOffet1;
        if (params.zeroOffet2 !== undefined) bitmapFont.parameters.zeroOffet2 = params.zeroOffet2;
        
        // 2. 处理颜色和 DOM 样式
        const bgColor = params.backgroundColor;
        
        // ✅ 修复：强制更新主要区域和左侧面板的背景色
        const mainElement = document.getElementById('main');
        if (mainElement) mainElement.style.backgroundColor = bgColor;
        
        const asideElement = document.querySelector('aside');
        if (asideElement) asideElement.style.backgroundColor = bgColor;

        // 更新 CSS 变量 (处理文字颜色对比度)
        const textColor = getContrastColor(bgColor);
        document.documentElement.style.setProperty('--panel-bg-color', bgColor);
        document.documentElement.style.setProperty('--text-color', textColor);
        const summaryColor = (textColor === '#FFFFFF') ? '#9AA3A9' : '#000000';
        document.documentElement.style.setProperty('--summary-text-color', summaryColor);

        // 3. 更新 UI 和 渲染
        updateControlsUI(params._animates || []);
        if (typeof emptyCanvas === 'function') emptyCanvas();
        if (typeof renderGrid === 'function') renderGrid();
        if (typeof renderText === 'function') renderText();
        updatePresetButtonStates(presetKey);
    }
}

// ... 前面的代码保持不变 ...

function updateControlsUI(activeAnimations = []) {
    // 调试日志：帮助确认接收到的参数是否正确
    console.log("正在更新控制 UI, 目标动画:", activeAnimations);

    document.querySelectorAll('input[type="range"]').forEach(slider => {
        // 1. 同步滑块数值
        const value = _.get(bitmapFont, slider.id);
        if (value !== undefined) slider.value = value;

        // 2. 自动处理播放状态
        const sliderId = slider.id; // 例如: "parameters.offet1"
        const shortId = sliderId.replace('parameters.', ''); // 例如: "offet1"
        
        // 检查当前滑块是否在需要播放的列表中
        const shouldPlay = activeAnimations.includes(sliderId) || 
                           activeAnimations.includes(shortId) || 
                           activeAnimations.includes('parameters.' + shortId);

        // 查找滑块对应的播放按钮
        // 结构通常是: Wrapper -> InputRow -> [Button, Slider]
        // 所以我们在父级 (InputRow) 中找 Button
        let container = slider.parentElement;
        let playBtn = container ? container.querySelector('button') : null;

        // 如果在同级没找到，尝试往上一层找 (以防结构变化)
        if (!playBtn && container && container.parentElement) {
            playBtn = container.parentElement.querySelector('button');
        }

        if (playBtn) {
            // 【关键修复】 controls.js 里使用的是 'playing' 类，而不是 'active'
            const isPlaying = playBtn.classList.contains('playing');

            if (shouldPlay) {
                if (!isPlaying) {
                    console.log(`启动动画: ${sliderId}`);
                    playBtn.click();
                } else {
                    console.log(`动画已在播放中: ${sliderId}`);
                }
            } else {
                // 如果当前预设不包含此动画，但它正在播放，则关闭它
                if (isPlaying) {
                    console.log(`停止动画: ${sliderId}`);
                    playBtn.click();
                }
            }
        }
    });
}

// ... 后面的 updatePresetButtonStates 等函数保持不变 ...

function updatePresetButtonStates(activePresetKey) {
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.preset === activePresetKey);
    });
}

function initPresetPanel() {
    const container = document.getElementById('preset-buttons');
    container.innerHTML = '';
    Object.keys(PRESETS).forEach(key => {
        const btn = document.createElement('button');
        btn.className = 'preset-btn';
        btn.textContent = PRESETS[key].name;
        btn.dataset.preset = key;
        btn.onclick = () => applyPreset(key);
        container.appendChild(btn);
    });
}

function initializeApp() {
    initPresetPanel();
    setTimeout(() => applyPreset('preset7'), 100); // 默认启动第一个按钮
}

document.addEventListener('DOMContentLoaded', initializeApp);