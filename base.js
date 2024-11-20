let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 700;
let win_width = canvas.width;
let win_height = canvas.height;
canvas.style.background = "#cbd4cd";

var audio = new Audio("music.wav");

let speed = 1;

let radius = 60;
const colors = ["#ffba08", "#003459", "red", "#80b918"];
const newColors = ["magenta", "#0d9470", "#5dc1f0", "#e3424d"];
let circles = [];
let arrows = [];
let movingArrows = [];

let getDistance = function (xpos1, xpos2, ypos1, ypos2) {
    return (Math.sqrt(Math.pow((xpos1 - xpos2), 2) + Math.pow((ypos1 - ypos2), 2)));
};

// Class for creating circles
class Circle {
    constructor(xpos, ypos, radius, color) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.radius = radius;
        this.color = color;
    }
    draw(context) {
        context.beginPath();
        context.arc(this.xpos, this.ypos, this.radius, 0, Math.PI * 2, true);
        context.lineWidth = 4;
        context.fillStyle = this.color;
        context.fill();
        // context.stroke();
        context.closePath();
        context.fillStyle = "black";
        context.font = "20px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("click", this.xpos, this.ypos);
    }
}

// Class for creating arrows
class Arrow {
    constructor(xstart, ystart, xend, x1, y1, y2, speed) {
        this.xstart = xstart;
        this.ystart = ystart;
        this.xend = xend;
        this.x1 = x1;
        this.y1 = y1;
        this.y2 = y2;
        this.speed = speed;
        this.dx = this.speed *10;
        this.reached = false;
    }
    draw(context) {
        context.beginPath();
        context.moveTo(this.xstart, this.ystart);
        context.lineTo(this.xend, this.ystart);
        context.lineTo(this.x1, this.y1);
        context.lineTo(this.x1, this.y2);
        context.lineTo(this.xend, this.ystart - 1);
        context.fillStyle = "black";
        // context.lineWidth = 4;
        context.fill();
        // context.stroke();
        context.closePath();
    }
    update() {
        this.draw(context);
        this.dx = this.speed *10;
        this.xstart -= this.dx;
        this.xend -= this.dx;
        this.x1 -= this.dx;
        console.log("dx value is"+ this.dx);
    }
}
//    arrows.push(new Arrow(800, (win_height / 5) * (i + 1), 650, 700, (win_height / 5) * (i + 1) - 10, (win_height / 5) * (i + 1) + 10, 1));

for (let i = 0; i < 4; i++) {
    circles.push(new Circle(200, (win_height / 5) * (i + 1), radius, colors[i]));
    arrows.push(new Arrow(800, (win_height / 5) * (i + 1), 650, 700, (win_height / 5) * (i + 1) - 10, (win_height / 5) * (i + 1) + 10, speed));
}

function drawAllShapes() {
    circles.forEach(circle => circle.draw(context));
    arrows.forEach(arrow => arrow.draw(context));
}
drawAllShapes();

canvas.addEventListener("click", (event) => {
    const { offsetX, offsetY } = event;
    circles.forEach((circle, index) => {
        if (Math.sqrt(Math.pow((offsetX - circle.xpos), 2) + Math.pow((offsetY - circle.ypos), 2)) <= circle.radius) {
            if (!movingArrows.includes(index)) {
                movingArrows.push(index);
                move(index);
            }
        }
    });
});

function move(index) {
    let arrow = arrows[index];
    let circle = circles[index];
    function animate() {
        context.clearRect(0, 0, win_width, win_height);
        drawAllShapes();
        if (arrow.reached) {
            audio.play();
            return;
        }
        if (!arrow.reached) {
            arrow.update();
        }
        if (getDistance(circle.xpos, arrow.xend, circle.ypos, arrow.ystart) <= circle.radius) {
            circle.color = newColors[index];
            arrow.reached = true;
            movingArrows = movingArrows.filter(i => i !== index);
        }
        requestAnimationFrame(animate);
    }

    animate();
}

// Reset button...............
let button = document.getElementById("button");
button.addEventListener("click", () => {
    context.clearRect(0, 0, win_width, win_height);
    circles.forEach((circle, index) => {
        circle.color = colors[index];
    });
    arrows.forEach(arrow => {
        arrow.reached = false;
        arrow.xstart = 800;
        arrow.xend = 650;
        arrow.x1 = 700;
    });
    movingArrows = [];
    drawAllShapes();
});
