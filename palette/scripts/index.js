let matrixSize = 4;
let instrument = 'pencil';
let color = '#008000';

window.onload = function() {
    const smallMatrixCheker = document.getElementById('small');
    const largeMatrixCheker = document.getElementById('large');
    const imageChecker = document.getElementById('default-image');
    const canvas = document.getElementById('work-canvas');

    const pencil = document.getElementById('pencil');
    const bucket = document.getElementById('bucket');

    const blueColor = document.getElementById('blue');
    const redColor = document.getElementById('red');
    const currColor = document.getElementById('current-color');
    const prevColor = document.getElementById('prev-color');
    currColor.style.backgroundColor = color;
    prevColor.style.backgroundColor  = '#000';
    let lastX = 0;
    let lastY = 0;

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
        instrument = 'pencil'
        if(pencil.className.search('selected-button') >= 0) {
            pencil.className = pencil.className.replace(/selected-button/g, '')
        }
        else {
            pencil.className += ' selected-button';
            bucket.className = bucket.className.replace(/selected-button/g, '')
        }
    });
    bucket.addEventListener('click', () =>{
        instrument = 'bucket'
        if(bucket.className.search('selected-button') >= 0) {
            bucket.className = bucket.className.replace(/selected-button/g, '')
        }
        else {
            bucket.className += ' selected-button';
            pencil.className = pencil.className.replace(/selected-button/g, '')
        }
    });

    smallMatrixCheker.parentElement.addEventListener('click', (e) => {
        if (e.returnValue) {
            smallMatrixCheker.checked = true;
            matrixSize = 4;
        }
    });

    largeMatrixCheker.parentElement.addEventListener('click', (e) => {
        if (e.returnValue) {
            largeMatrixCheker.checked = true;
            matrixSize = 32;
        }
    });

    imageChecker.parentElement.addEventListener('click', (e) => {
        if (e.returnValue) {
            imageChecker.checked = true;
            setPictureToCanvas();
        }
    });

    imageChecker.checked = true;
    setPictureToCanvas();

    let isDrawing = false;
    canvas.addEventListener('mousemove', (e) => {
        if(!isDrawing) { return; }
        if(instrument === 'pencil') { 
            drawWithAlgorithm(lastX, lastY, e.offsetX, e.offsetY);
            lastX = e.offsetX;
            lastY = e.offsetY;
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
    canvas.addEventListener('mouseup', (e) => isDrawing = false);
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

function setPictureToCanvas()
{
const canvas = document.getElementById('work-canvas')
const ctx = canvas.getContext("2d");
const image = new Image();
image.src = './images/start-image.png';
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