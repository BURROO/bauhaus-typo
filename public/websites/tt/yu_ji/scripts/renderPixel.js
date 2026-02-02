// Rendering a Pixel

// Parameters
// x – Position
// y - Position
// w – Width
// h – Height
// index – copy index (trail)

const renderPixel = (x, y, w, h, index, pixelIndex, character) => {
    // Offset per item
    const xOfst = bitmapFont.parameters.copies.offset.x * (index)
    const yOfst = bitmapFont.parameters.copies.offset.y * (index)

    // 获取字符的随机缩放因子
    let charScale = 1
    if (bitmapFont.parameters.charScaleVariation > 0) {
        if (!bitmapFont.parameters.charScaleRandomness[character]) {
            const variation = (Math.random() - 0.5) * 2 * bitmapFont.parameters.charScaleVariation / 100
            bitmapFont.parameters.charScaleRandomness[character] = 1 + variation
        }
        charScale = bitmapFont.parameters.charScaleRandomness[character]
    }

    // 应用缩放 (保持长宽比变形特性)
    const scaledW = w * charScale
    const scaledH = h * charScale
    const scaledXOfst = xOfst * charScale
    const scaledYOfst = yOfst * charScale

    // 像素分割
    const subdivisionLevel = bitmapFont.parameters.pixelSubdivision / 100
    const pixelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    if (subdivisionLevel === 0) {
        const pixel = createSinglePixel(x + scaledXOfst, y + scaledYOfst, scaledW, scaledH, index, pixelIndex, character);
        pixelGroup.appendChild(pixel);
        return pixelGroup;
    }

    // 分割逻辑 - 需要适配长宽比
    // w/h 是全尺寸，radius是半尺寸
    const radiusX = scaledW / 2;
    const radiusY = scaledH / 2;
    
    // 子像素尺寸
    const subPixelRadiusX = radiusX * (0.5 + 0.5 * (1 - subdivisionLevel));
    const subPixelRadiusY = radiusY * (0.5 + 0.5 * (1 - subdivisionLevel));
    const subPixelW = subPixelRadiusX * 2;
    const subPixelH = subPixelRadiusY * 2;
    
    // 偏移量
    const offsetDistX = radiusX * subdivisionLevel * 0.5;
    const offsetDistY = radiusY * subdivisionLevel * 0.5;

    const subPixelPositions = [
        { x: x + scaledXOfst - offsetDistX, y: y + scaledYOfst - offsetDistY }, // TL
        { x: x + scaledXOfst + offsetDistX, y: y + scaledYOfst - offsetDistY }, // TR
        { x: x + scaledXOfst - offsetDistX, y: y + scaledYOfst + offsetDistY }, // BL
        { x: x + scaledXOfst + offsetDistX, y: y + scaledYOfst + offsetDistY }  // BR
    ];

    subPixelPositions.forEach((pos, subIndex) => {
        const subPixel = createSinglePixel(pos.x, pos.y, subPixelW, subPixelH, index, `${pixelIndex}-${subIndex}`, character);
        pixelGroup.appendChild(subPixel);
    });

    return pixelGroup;
}

function createSinglePixel(x, y, w, h, index, pixelIndex, character) {
    let pixel;
    const shapeType = bitmapFont.parameters.pixelShape || 'square';
    
    w = Math.max(0.1, w); // Prevent 0 size errors
    h = Math.max(0.1, h);

    if (shapeType === 'circle') {
        // 使用 ellipse 以支持非等比拉伸
        pixel = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        pixel.setAttribute('rx', w / 2);
        pixel.setAttribute('ry', h / 2);
        pixel.setAttribute('cx', x);
        pixel.setAttribute('cy', y);
        // 圆形模式下通常使用混合模式效果更好，但可根据需要调整
        pixel.style.mixBlendMode = 'multiply';
    } else {
        // Square/Rect
        pixel = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        pixel.setAttribute('width', w);
        pixel.setAttribute('height', h);
        pixel.setAttribute('x', x - w / 2);
        pixel.setAttribute('y', y - h / 2);
    }

    const uniqueGradientId = `grad-${pixelIndex}-${character}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const gradient = createUniqueGradient(uniqueGradientId, index, x, y, pixelIndex, character);

    pixel.setAttribute('fill', `url(#${uniqueGradientId})`);
    
    const svgDefs = document.getElementById('svg-defs');
    if(svgDefs) svgDefs.appendChild(gradient);
    
    return pixel;
}

// 创建唯一渐变的函数
function createUniqueGradient(gradientId, index, x, y, pixelIndex, character) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const gradientType = bitmapFont.parameters.gradientType || 'linear'; // 获取渐变类型
    
    // 新增：获取重复次数 (Frequency)
    const repetition = Math.max(1, (bitmapFont.parameters.gradientRepetition === undefined ? 1 : bitmapFont.parameters.gradientRepetition));

    // 根据类型创建元素
    const tagName = gradientType === 'radial' ? 'radialGradient' : 'linearGradient';
    const gradient = document.createElementNS(svgNS, tagName);
    gradient.setAttribute('id', gradientId);
    
    // 如果重复次数大于 1，开启镜像或重复模式
    if (repetition > 1) {
        gradient.setAttribute('spreadMethod', 'repeat');
    }

    // 获取该字符的字形对象
    const characterObj = bitmapFont.glyphs[character] || bitmapFont.glyphs['.notdef'];
    const angleArray = characterObj.gradientAngle;
    
    // 处理分割后的索引，例如 "5-0" 应该對應索引 5
    // 这样可以确保子像素继承父像素的渐变角度
    let lookupIndex = pixelIndex;
    if (typeof pixelIndex === 'string' && pixelIndex.indexOf('-') !== -1) {
        lookupIndex = parseInt(pixelIndex.split('-')[0]);
    }
    
    // 根据像素索引获取对应的角度，并加上全局偏移
    let angle = angleArray[lookupIndex] || 0;
    angle = (angle + bitmapFont.parameters.gradientAngleOffset) % 360;
    
    const rad = angle * Math.PI / 180;
    const xx = Math.cos(rad);
    const yy = Math.sin(rad);

    if (gradientType === 'radial') {
        // 径向渐变逻辑
        // 设置基本圆心和半径
        gradient.setAttribute('cx', '50%');
        gradient.setAttribute('cy', '50%');
        
        // 缩放半径以实现重复效果 (半径 = 50% / 重复次数)
        gradient.setAttribute('r', (50 / repetition).toFixed(2) + '%');
        
        // 使用 fx/fy 控制高光点（焦点）位置，从而模拟角度方向
        // 偏移量 0.35 让高光点稍微偏离中心，产生立体感
        const focusOffset = 0.35; 
        // SVG y 轴向下为正，yy 计算时需要注意符号，这里直接用计算出的方向偏移
        const fx = 0.5 - xx * focusOffset;
        const fy = 0.5 - yy * focusOffset;

        gradient.setAttribute('fx', (fx * 100).toFixed(2) + '%');
        gradient.setAttribute('fy', (fy * 100).toFixed(2) + '%');
    } else {
        // 线性渐变逻辑
        // SVG y 轴向下为正，所以 y 需要反向
        // 缩放向量长度以实现重复效果 (长度 / 重复次数)
        const x1 = (50 - xx * 50 / repetition).toFixed(2) + '%';
        const y1 = (50 - yy * 50 / repetition).toFixed(2) + '%';
        const x2 = (50 + xx * 50 / repetition).toFixed(2) + '%';
        const y2 = (50 + yy * 50 / repetition).toFixed(2) + '%';

        gradient.setAttribute('x1', x1);
        gradient.setAttribute('y1', y1);
        gradient.setAttribute('x2', x2);
        gradient.setAttribute('y2', y2);
    }

    // 基于索引、位置等生成唯一颜色

    const stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', bitmapFont.parameters.offet0 / 100);
    stop1.setAttribute('stop-color', bitmapFont.parameters.color0);

    const stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('offset', bitmapFont.parameters.offet1 / 100);
    stop2.setAttribute('stop-color', bitmapFont.parameters.color1);

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);

    // Make the 3rd stop optional since we removed one preset group
    if (bitmapFont.parameters.color2 !== undefined && bitmapFont.parameters.offet2 !== undefined) {
        const stop3 = document.createElementNS(svgNS, 'stop');
        stop3.setAttribute('offset', bitmapFont.parameters.offet2 / 100);
        stop3.setAttribute('stop-color', bitmapFont.parameters.color2);
        gradient.appendChild(stop3);
    }

    return gradient;
}


const renderPixel2 = (x, y, radius, index) => {



    const scale = radius / 100 - index * 0.01 * 2

    // Ofset per item
    const xOfst = (bitmapFont.parameters.copies.offset.x * (index)) - scale * 50
    const yOfst = (bitmapFont.parameters.copies.offset.y * (index)) - scale * 50

    // now we are handling the logic for placing the circles
    const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // Storing path as string
    const path = `M39.17,40.89c2.39,31.35-23.87,69.37-30.71,40.26S62.71,2.86,41.39,16.71C20.07,30.55.34,60.62.5,39.14c.16-21.48,56.01-58.55,63.01-25.46,7,33.1-1.59,35.8,16.55,28.16,18.14-7.64,8.59,78.92-14.64,49.96-23.23-28.96-26.25-50.92-26.25-50.92Z`

    // Adding Path as attribute
    newPath.setAttribute('d', path)

    // transforming path
    newPath.setAttribute('transform', `translate(${x + xOfst}, ${y + yOfst}) scale(${scale})`)

    return newPath
}

// const renderPixel = (x, y, radius, index) => {

//     x = x - radius + bitmapFont.parameters.copies.offset.x
//     y = y - radius + bitmapFont.parameters.copies.offset.y
//     // now we are handling the logic for placing the circles
//     const newCircle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
//     newCircle.setAttribute('width', radius*2);
//     newCircle.setAttribute('height', radius*2);
//     newCircle.setAttribute('x', x)
//     newCircle.setAttribute('y', y)
//     newCircle.setAttribute('transform', `rotate(${index * 10}, ${x}, ${y})`)

//     return newCircle
// }




