console.log("Game starting.");

var SCREEN_WIDTH = 800,
    SCREEN_HEIGHT = 600,
    MAX_WALKING_DISTANCE = 75;

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    loaded = 0,
    dog = {
        x: 400,
        y: 400,
        dx: 0,
        state: 2
    },
    owner = {
        x: 600,
        y: 200,
        dx: 0,
        state: 0,
        ticksLeft: 600,
        tickRate: 600,
        tickRateDecay: 3,
        tickRateLeft: 400
    },
    score = 0,
    highScore = localStorage['highScore'] || 0;
    maxScore = 0;

ctx.font = 'bold 20pt Calibri';

console.log("Loading assets.");

var bg = new Image(),
    down = new Image(),
    stand = new Image(),
    sit = new Image(),
    ownerWalk = new Image(),
    ownerSit = new Image(),
    ownerDown = new Image();

function loaded () {
    loaded++;
    console.log("Loaded: "+ loaded);
    draw();
}

bg.onload = function () {
    loaded++;
    update();
};
down.onload = function () {
    loaded++;
    update();
};
sit.onload = function () {
    loaded++;
    update();
};
stand.onload = function () {
    loaded++;
    update();
};
ownerWalk.onload = function () {
    loaded++;
    update();
};
ownerSit.onload = function () {
    loaded++;
    update();
};
ownerDown.onload = function () {
    loaded++;
    update();
};

bg.src = '/rec/bg.jpg';
down.src = '/rec/down.png';
sit.src = '/rec/sit.png';
stand.src = '/rec/stand.png';
ownerDown.src = '/rec/cmdDown.png';
ownerSit.src = '/rec/cmdSit.png';
ownerWalk.src = '/rec/cmdWalk.png';

console.log("Finished defining loading parameters");






dog.draw = function () {
    var img, offsetY = 0;

    switch (dog.state) {
        case 0:
            img = down;
            offsetY = 25;
            break;
        case 1:
            img = sit;
            offsetY = 0;
            break;
        case 2: img = stand; break;
    }

    ctx.drawImage(img, dog.x, dog.y + offsetY);
};

dog.move = function () {
    dog.x += dog.dx;
    if (dog.x < 0) dog.x = 0;
    if (dog.x + 50 > SCREEN_WIDTH) dog.x = SCREEN_WIDTH - 50;
};


owner.draw = function () {
    var img, offsetY = 0;

    switch (owner.state) {
        case 0:
            img = ownerDown;
            offsetY = -50;
            break;
        case 1: img = ownerSit; break;
        case 2: img = ownerWalk; break;
    }

    ctx.save();

    if (owner.x < dog.x) {
        ctx.scale(-1, 1);
        ctx.translate(SCREEN_WIDTH*-1, 0);
        ctx.drawImage(img, SCREEN_WIDTH - (owner.x + (img.width/2)), owner.y + (img.height/2) + offsetY);
    } else {
        ctx.drawImage(img, owner.x - (img.width/2), owner.y + (img.height/2) + offsetY);
    }

    ctx.restore();
    
};

owner.update = function () {

    if (owner.ticksLeft <= 0) {
        owner.state = Math.floor(Math.random()*3);

        if (owner.state === 2) {
            owner.dx = Math.random() > 0.5 ? 1 : -1;
            owner.dx = owner.dx / 1.5
        } else {
            owner.dx = 0;
        }

        owner.ticksLeft = owner.tickRate;
        console.log("State: "+owner.state);
    }

    owner.x += owner.dx;
    if (owner.x < 50) owner.dx = Math.abs(owner.dx);
    if (owner.x > SCREEN_WIDTH*0.8 - 50) {
        owner.dx = -Math.abs(owner.dx);
    }


    if (owner.tickRateLeft <= 0) {
        owner.tickRate -= owner.tickRateDecay;
        owner.tickRateLeft = 500;
    }

    owner.tickRateLeft--;
    owner.ticksLeft--;
};


function updateScore () {

    if (owner.state === dog.state) {
        if (owner.state === 2) {
            if (Math.abs(owner.x - dog.x) < MAX_WALKING_DISTANCE) {
                score++;
            } else {
                score--;
            }
        } else {
            score++;
        }
    } else {
        score--;
    }

    if (score > maxScore) {
        maxScore = score;
    }

    if (maxScore > highScore) {
        highScore = maxScore;
        localStorage["highScore"] = highScore;
    }
}

function drawScore () {
    ctx.fillText("Score: "+parseInt(score/100, 10), 20, 50, 100);
    ctx.fillText("Max score: "+parseInt(maxScore/100, 10), 250, 50, 200);
    ctx.fillText("High Score: "+parseInt(highScore/100, 10), 500, 50, 200);
}


function update() {
    if (loaded < 4) return;

    requestAnimationFrame(update);

    owner.update();
    dog.move();
    updateScore();
    
    ctx.drawImage(bg,0,0);

    dog.draw();
    owner.draw();
    drawScore();
}


window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 39) {
        if (dog.state > 1) dog.dx = 2;
    } else if (key == 37) {
        if (dog.state > 1) dog.dx = -2;
    } else {
        dog.dx = 0;
    }
};

window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;

   dog.dx = 0;

   if (key == 38) {
       if (dog.state < 2) dog.state ++;
   }else if (key == 40) {
       if (dog.state > 0) dog.state--;
   }
};