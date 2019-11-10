window.onload = function() {
    const smallMatrixCheker = document.getElementById('small');
    const largeMatrixCheker = document.getElementById('large');
    const imageChecker = document.getElementById('default-image');
    const canvas = document.getElementById('work-canvas');

    smallMatrixCheker.parentElement.addEventListener('click', (e) => {
        if (e.returnValue) {
            smallMatrixCheker.checked = true;
        }
    });

    largeMatrixCheker.parentElement.addEventListener('click', (e) => {
        if (e.returnValue) {
            largeMatrixCheker.checked = true;
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
  };

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