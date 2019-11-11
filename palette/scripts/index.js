let matrixSize = 4;
let instrument = 'pencil';
let color = '#008000';

window.onload = function() {
    const smallMatrixChecker = document.getElementById('small');
    const largeMatrixChecker = document.getElementById('large');
    const startImage = document.getElementById('default-image');
    const canvas = document.getElementById('work-canvas');

    const pencil = document.getElementById('pencil');
    const bucket = document.getElementById('bucket');
    const colorPicker = document.getElementById('color-picker');

    const blueColor = document.getElementById('blue');
    const redColor = document.getElementById('red');
    const currColor = document.getElementById('current-color');
    const prevColor = document.getElementById('prev-color');
    const inputColor = document.getElementById('input-color');
    const currColorContainer = document.getElementById('current-color-container');
    currColor.style.backgroundColor = color;
    prevColor.style.backgroundColor = '#000';
    let lastX = 0;
    let lastY = 0;

    document.onkeydown = (e) => {
        if (e.code === 'KeyB') {
            bucket.click();
        }
        if (e.code === 'KeyP') {
            pencil.click();
        }
        if (e.code === 'KeyC') {
            colorPicker.click();
        }
      };

    inputColor.addEventListener('change', (e) => {
        color = inputColor.value;
        prevColor.style.backgroundColor = currColor.style.backgroundColor;
        currColor.style.backgroundColor = color;
    });
    currColorContainer.addEventListener('click', () => {
        inputColor.click();
    });  
    prevColor.parentElement.addEventListener('click', () => {
        color = prevColor.style.backgroundColor;
        prevColor.style.backgroundColor = currColor.style.backgroundColor;
        currColor.style.backgroundColor = color;
    });
    blueColor.addEventListener('click', () => {
        color = '#0000ff';
        prevColor.style.backgroundColor = currColor.style.backgroundColor;
        currColor.style.backgroundColor = color;
    });
    redColor.addEventListener('click', () =>{
        color = '#ff0000';
        prevColor.style.backgroundColor = currColor.style.backgroundColor;
        currColor.style.backgroundColor = color;
    });

    pencil.addEventListener('click', () => {
        instrument = 'pencil';
        if(pencil.className.search('selected-button') >= 0) {
            pencil.className = pencil.className.replace(/selected-button/g, '')
        }
        else {
            pencil.className += ' selected-button';
            bucket.className = bucket.className.replace(/selected-button/g, '')
            colorPicker.className = colorPicker.className.replace(/selected-button/g, '')
        }
    });
    bucket.addEventListener('click', () =>{
        instrument = 'bucket';
        if(bucket.className.search('selected-button') >= 0) {
            bucket.className = bucket.className.replace(/selected-button/g, '')
        }
        else {
            bucket.className += ' selected-button';
            pencil.className = pencil.className.replace(/selected-button/g, '')
            colorPicker.className = colorPicker.className.replace(/selected-button/g, '')
        }
    });
    colorPicker.addEventListener('click', (e) =>{
        instrument = 'color-picker';
        if(colorPicker.className.search('selected-button') >= 0) {
            colorPicker.className = colorPicker.className.replace(/selected-button/g, '')
        }
        else {
            colorPicker.className += ' selected-button';
            pencil.className = pencil.className.replace(/selected-button/g, '')
            bucket.className = bucket.className.replace(/selected-button/g, '')
        }
    });

    smallMatrixChecker.parentElement.addEventListener('click', (e) => {
        if (e.returnValue) {
            smallMatrixChecker.checked = true;
            matrixSize = 4;
        }
    });
    largeMatrixChecker.parentElement.addEventListener('click', (e) => {
        if (e.returnValue) {
            largeMatrixChecker.checked = true;
            matrixSize = 32;
        }
    });
    startImage.parentElement.addEventListener('click', (e) => {
        if (e.returnValue) {
            setPictureToCanvas();
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if(!isDrawing) { return; }
        if(instrument === 'pencil') { 
            drawWithAlgorithm(lastX, lastY, e.offsetX, e.offsetY);
            lastX = e.offsetX;
            lastY = e.offsetY;
            localStorage.setItem('currentImage', canvas.toDataURL("image/png"))
        }
    });
    canvas.addEventListener('mousedown', (e) => { 
        isDrawing = true; 
        lastX = e.offsetX;
        lastY = e.offsetY;
        if(instrument === 'bucket') { 
            fillCanvasZone(e);
        }
        if(instrument === 'pencil') { 
            draw(new Point(e.offsetX, e.offsetY));
            lastX = e.offsetX;
            lastY = e.offsetY;
        }
    });
    canvas.addEventListener('mouseup', () => isDrawing = false);
    this.document.body.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('click', (e) => {
        if(instrument === 'color-picker') {
            let ctx = canvas.getContext("2d");
            const newColor = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
            color = `rgba(${newColor[0]},${newColor[1]},${newColor[2]},${newColor[3]})`;
            prevColor.style.backgroundColor = currColor.style.backgroundColor;
            currColor.style.backgroundColor = color;
        }
    });

    
    if(localStorage.getItem('currentImage')) {
        setPictureToCanvas(localStorage.getItem('currentImage'));
    }
    else {
        setPictureToCanvas();
    }
    smallMatrixChecker.checked = true;
    let isDrawing = false;
    pencil.click();
    
};

function draw(point) {
    const canvas = document.getElementById('work-canvas');
    const ctx = canvas.getContext("2d");
    point = getRectStartPoint(point);
    ctx.fillStyle = color;
    ctx.fillRect(point.x, point.y, matrixSize, matrixSize );
}

function getRectStartPoint(point) {
    return new Point(Math.floor(point.x/matrixSize)*matrixSize, Math.floor(point.y/matrixSize)*matrixSize);
}

function fillCanvasZone(e){
    const canvas = document.getElementById('work-canvas');
    const ctx = canvas.getContext("2d");
    const startPoint = getRectStartPoint(new Point(e.offsetX, e.offsetY));
    ctx.fillStyle = color;
    const sumColor = ctx.getImageData(startPoint.x, startPoint.y, 1, 1).data.reduce((x,y,i) => x + y*(i+1), 0);
    const queue = [startPoint];
    const usedPoint =  new Set();
    while(queue.length > 0) {
        let point = queue.shift();
        if(usedPoint.has(point.toString())) { 
            continue;
        }
        usedPoint.add(point.toString());
        if(point.x < 0 || point.x > ctx.width || point.y < 0 || point.y > ctx.width) {
            continue;
        }
        let newSumColor = ctx.getImageData(point.x, point.y, 1, 1).data.reduce((x,y,i) => x + y*(i+1), 0);
        if(newSumColor !== sumColor) {
            continue;
        }
        ctx.fillRect(point.x, point.y, matrixSize, matrixSize);
        queue.push(new Point(point.x - matrixSize, point.y));
        queue.push(new Point(point.x, point.y - matrixSize));
        queue.push(new Point(point.x + matrixSize, point.y));
        queue.push(new Point(point.x, point.y + matrixSize));
    }
  }

function drawWithAlgorithm(x1, y1, x2, y2) {
    const point1 = getRectStartPoint(new Point(x1, y1));
    const point2 = getRectStartPoint(new Point(x2, y2));
    const deltaX = Math.abs(point2.x - point1.x);
    const deltaY = Math.abs(point2.y - point1.y);
    const signX = point1.x < point2.x ? matrixSize : -matrixSize;
    const signY = point1.y < point2.y ? matrixSize : -matrixSize;
    let error = deltaX - deltaY;
    draw(point2);
    while(point1.x != point2.x || point1.y != point2.y) {
        draw(point1);
        let error2 = error * 2;
        if(error2 > -deltaY) {
            error -= deltaY;
            point1.x += signX;
        }
        if(error2 < deltaX) {
            error += deltaX;
            point1.y += signY;
        }
    }
}

function setPictureToCanvas(imgUrl)
{
    const canvas = document.getElementById('work-canvas')
    imgUrl = imgUrl || './images/start-image.png';
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = imgUrl;
    ctx.width = 512;
    ctx.height = 512;
    image.onload = () => ctx.drawImage(image, 0, 0,512,512);
} 

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString(){
        return `${this.x} ${this.y}`;
    }
}