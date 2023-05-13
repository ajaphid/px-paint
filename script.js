// html element refs
let canvas = document.getElementById("canvas");
let backgroundColorSelect = document.getElementById("color-background");
let penColorSelect = document.getElementById("color-input");
let penSizeSelect = document.getElementById("pen-slider");
let clearButton = document.getElementById("button-clear");
let eraseButton = document.getElementById("eraser");
let penButton = document.getElementById("brush");

// canvas
let context = canvas.getContext("2d");
let mouseX = 0;
let mouseY = 0;
let rectLeft = canvas.getBoundingClientRect().left;
let rectTop = canvas.getBoundingClientRect().top;

// inital state of app
let erase_bool = false;
let draw_bool = false;

const init = () => {
    // for canvas
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // for tools
    backgroundColorSelect.value = "#ffffff";
    penColorSelect.value = '#0';
    penSizeSelect.value ='4';

    // updating context with tool defaults
    context.strokeStyle = penColorSelect.value;
    context.lineWidth = penSizeSelect.value;
    canvas.style.backgroundColor = backgroundColorSelect.value;
};

const is_touch_event = () => {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
};

const getTouchXY = (e) => {
  mouseX = (!is_touch_event() ? e.pageX : e.touches?.[0].pageX) - rectLeft;
  mouseY = (!is_touch_event() ? e.pageY : e.touches?.[0].pageY) - rectTop;
};

const stopDrawing = () => {
  context.beginPath();
  draw_bool = false;
};

const startDrawing = (e) => {
  draw_bool = true;
  getTouchXY(e);
  context.beginPath();
  context.moveTo(mouseX, mouseY);
};

const drawOnCanvas = (e) => {
  if (!is_touch_event()) {
    e.preventDefault();
  }
  getTouchXY(e);

  if (draw_bool) {
    // makes line to x and y position of cursor from previous spot
    context.lineTo(mouseX, mouseY);
    context.stroke();
    if (erase_bool) {
      //destination-out draws new shapes behind the existing canvas content
      context.globalCompositeOperation = "destination-out";
    } else {
      context.globalCompositeOperation = "source-over";
    }
  }
};

// event listeners
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("mousemove", drawOnCanvas);
canvas.addEventListener("touchmove", drawOnCanvas);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

// switch to pen mode
penButton.addEventListener("click", () => {
  erase_bool = false;
});

// switch to eraser mode
eraseButton.addEventListener("click", () => {
  erase_bool = true;
});

// change pen size
penSizeSelect.addEventListener("input", () => {
  context.lineWidth = penSizeSelect.value;
});

// change color
penColorSelect.addEventListener("change", () => {
  context.strokeStyle = penColorSelect.value;
});

// change background color
backgroundColorSelect.addEventListener("change", () => {
  canvas.style.backgroundColor = backgroundColorSelect.value;
});

// clear canvas, reset color + size + background color
clearButton.addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  backgroundColorSelect.value = "#ffffff";
  canvas.style.backgroundColor = backgroundColorSelect.value;
  penColorSelect.value = "#0";
  penSizeSelect.value = "4";
});

window.onload = init();

