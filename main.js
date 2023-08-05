var audio = new Audio('cat-meow.mp3');


const startButton = document.getElementById('start-button');
const modal = document.getElementById('modal');
const modalBoundingRect = modal.getBoundingClientRect();
const distance = (x, y, element) => {
    const rect = element.getBoundingClientRect();
    return Math.sqrt(Math.pow(x - rect.left, 2) + Math.pow(y - rect.top, 2));
}
const linearInterpolation = (t, p0, p1) => {
    return p0 + (p1 - p0) * t;
}
const quadraticBezier = (t, p0, p1, p2) => {
    return linearInterpolation(t, linearInterpolation(t, p0, p1), linearInterpolation(t, p1, p2));
}
const cubicBezier = (t, p0, p1, p2, p3) => {
    return linearInterpolation(t, quadraticBezier(t, p0, p1, p2), quadraticBezier(t, p1, p2, p3));
}
const scale = (t) => {
    // cubic-bezier(.5,.5,1,.5)
    t =  t / Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight,2));
    return cubicBezier(1-t, 0, 0, .5, 1);
}


const cat = document.createElement('div');
cat.id = 'cat';
cat.style.width = '75px';
cat.style.height = '75px';
cat.style.position = 'absolute';
cat.style.top = 0;
cat.style.left = 0;
document.body.appendChild(cat);

const intersects = (rect1, rect2) => {
    return rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top;
}

const generateRandomPosition = () => {
    cat.style.top = Math.random() * (window.innerHeight - 75);
    cat.style.left = Math.random() * (window.innerWidth - 75);
    while(intersects(cat.getBoundingClientRect(), modalBoundingRect)) {
        generateRandomPosition();
    }
}


document.addEventListener('mousemove', (event) => {
    const x = event.clientX;
    const y = event.clientY;
    var val = scale(distance(x, y, cat));
    audio.volume = val;
    audio.playbackRate = val*10;
})

cat.addEventListener('click', () => {
    audio.pause()
    new Audio('cat-meow.mp3').play();
    modal.style.display = 'block';
    cat.style.backgroundImage = "url('cat.png')";
})
startButton.addEventListener('click', () => {
    modal.style.display = 'none';
    cat.style.backgroundColor = '#f2f2f2';
    cat.style.backgroundImage = 'none'
    
    // cat.style.backgroundColor = 'red';
    generateRandomPosition();
    audio.loop = true;
    audio.currentTime = 0;
    audio.playbackRate = 12;
    audio.play();
});