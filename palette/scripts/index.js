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

    blueColor.addEventListener('click', () => {
        color = '#0000ff'
        if(blueColor.className.search('selected-button') >= 0) {
            blueColor.className = blueColor.className.replace(/selected-button/g, '')
        }
        else {
            blueColor.className += ' selected-button';
        }
    });
    redColor.addEventListener('click', () =>{
        color = '#ff0000'
        if(redColor.className.search('selected-button') >= 0) {
            redColor.className = redColor.className.replace(/selected-button/g, '')
        }
        else {
            redColor.className += ' selected-button';
        }
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
            draw(e);
        }
    });
    canvas.addEventListener('mousedown', (e) => { 
        isDrawing = true; 
        if(instrument === 'bucket') { 
            fillCanvasZone(e);
        }
        if(instrument === 'pencil') { 
            draw(e);
        }
    });
    canvas.addEventListener('mouseup', (e) => isDrawing = false);
  };

  function draw(e) {
    console.log(`x = ${e.offsetX}   y = ${e.offsetY}, startX = ${Math.ceil(e.offsetX/32)*32}  startY = ${Math.ceil(e.offsety/32)*32}`)
    const canvas = document.getElementById('work-canvas');
    const ctx = canvas.getContext("2d");
    const point = getRectStartPoint(new Point(e.offsetX, e.offsetY));
    ctx.fillStyle = color;
    ctx.fillRect(point.x, point.y, matrixSize, matrixSize );
  }

    function getRectStartPoint(point) {
        return new Point(Math.floor(point.x/matrixSize)*matrixSize, Math.floor(point.y/matrixSize)*matrixSize);
    }

  function fillCanvasZone(e){
    const canvas = document.getElementById('work-canvas');
    const ctx = canvas.getContext("2d");
    let startPoint = getRectStartPoint(new Point(e.offsetX, e.offsetY));
    ctx.fillStyle = color;
    const sumColor = ctx.getImageData(startPoint.x, startPoint.y, 1, 1).data.reduce((x,y) => x + y, 0);
    let queue = [startPoint];
    let usedPoint =  new Set();
    let count = 0;
    while(queue.length > 0) {
        let point = queue.shift();
        if(usedPoint.has(point.toString())) { 
            continue;
        }
        usedPoint.add(point.toString());
        if(point.x < 0 || point.x > ctx.width || point.y < 0 || point.y > ctx.width) {
            continue;
        }
        let newSumColor = ctx.getImageData(point.x, point.y, 1, 1).data.reduce((x,y) => x + y, 0);
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