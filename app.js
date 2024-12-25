const saveBtn = document.getElementById("save-btn");
const textInput = document.getElementById("text");
const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");
const fileInput = document.getElementById("file");
const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
);
const lineWidth = document.getElementById("line-width");
const color = document.getElementById("color");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round"; // 선의 끝부분이 둥글게 처리됨
let isPainting = false;
let isFilling = false;
function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(event.OffsetX, event.OffsetX);
}

function startPainting() {
  isPainting = true;
}

function cancelPainting() {
  isPainting = false;
  ctx.beginPath();
}

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}

function onModeClick() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}

function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function onDestroyClick() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserClick() {
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Fill";
}

function onFileChange(event) {
  const file = event.target.files[0];
  /*
    파일 배열인 이유
    -> input에 Multiple 속성을 추가할 수 있기 때문이다. multiple 속성을 추가하면 유저가
    파일을 여러개 업로드 할 수 있다. 하지만 여기선 유저가 하나의 파일만 업로드 하기 때문에
    파일 배열에서 첫번째 파일만 필요함.
  */
  const url = URL.createObjectURL(file); // 유저가 업로드한 파일은 이미 브라우저의 메모리 안에 있음
  // 현실의 인터넷에서 존재하지 않는 URL이다. 브라우저가 자신의 메모리에 있는 파일을 드러내는 방식임
  const image = new Image();
  //document.createElement("img")와 동일함
  image.src = url;
  image.onload = () => {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  };
}

function onDoubleClick(event) {
  const text = textInput.value;
  if (text !== "") { // text가 비어있다면 아무것도 하지 않음
    ctx.save();
    // ctx.save()는 ctx의 현재 상태, 색상, 스타일 등 모든 것을 저장한다.
    ctx.lineWidth = 1;
    ctx.font = "68px serif";
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore(); // 저장되어있던 ctx값으로 되돌아감
  }
}

function onSaveClick() {
  const url = canvas.toDataURL(); // 이미지를 저장할때 URL로 인코딩 됨
  const a = document.createElement("a"); // 페이크 링크를 만들어 href를 url로 설정하여 다운로드
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}
// addEventListener는 같은 event 안에 많은 eventListener를 추가할 수 있음
canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);
lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach((color) => color.addEventListener("click", onColorClick));
modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);