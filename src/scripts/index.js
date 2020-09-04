import { jsPDF } from "jspdf";
import canvasTxt from 'canvas-txt'

import {common, rare} from './modules/lists'

const petsArr = getPetsArr();
const rarePetsArr = getRarePetsArr();
let finalImage;

window.onload = function() {
  buildPlayerSheet(setImage)
};

const nodesArr = document.querySelectorAll(".column");

for (let i = 0; i < nodesArr.length; i++) {
  nodesArr[i].addEventListener("click", function (self) {
    self.target.classList.toggle("selected")

  }, false)
}

document.querySelector(".download-button").addEventListener("click", buildPDF, false)

function buildPlayerSheet ( callback ) {
  const canvasElement    = createCanvas();
  const context          = canvasElement.getContext("2d");
  const grid = document.querySelector(".bingo-grid");
  const banner = document.querySelector(".bingo-banner");

  context.fillStyle    = '#fff';
  context.fillRect(0, 0, 700, 900);

  context.drawImage(banner, 65, 40, 550, 200);
  context.drawImage(grid, 35, 290, 600, 450);

  context.fillStyle = "rgba(80, 80, 80, 0.8)";

  const startTop = 280;
  const startLeft = 46;

  const rowArr = [0, 85, 170, 255, 355]
  const columnArr = [0, 130, 257, 370, 485]

  for (let i = 0; i < petsArr.length; i++) {
    if (i >= 25) break;
    let iteratorX = i%5;
    let iteratorY = Math.floor((i/5));
    let left = startLeft+columnArr[iteratorX];
    let top = startTop+rowArr[iteratorY];
    let string = petsArr[i];

    context.fillStyle = "#505050";
    canvasTxt.font = "Schoolbell";
    canvasTxt.fontSize = 17;
    canvasTxt.lineHeight = 20;

    if (i === 12) {
      canvasTxt.fontSize = 26;
      string = "FREE";
    }

    if (i === 2 ||
      i === 6 ||
      i === 8 ||
      i === 10 ||
      i === 14 ||
      i === 16 ||
      i === 18 ||
      i === 22) {
      string = rarePetsArr[i];

    }

    canvasTxt.drawText(context, string, left, top, 90, 100)
  }

  callback(canvasElement);

}

function setImage ( canvasNode ) {
  finalImage = canvasNode.toDataURL("image/jpeg", 1.0);

  document.querySelector(".bingo-image").src = finalImage;

}

function createCanvas () {
  const canvasElement    = document.createElement("canvas");
  canvasElement.width  = 670;
  canvasElement.height = 867;
  canvasElement.style  = "display: none";
  return canvasElement;
}

function wrapText (context, textArray, startheight, lineIncrement, indent, maxLineWords) {
  let lineText  = '';
  let lineHeight = startheight;

  for (let i = 0; i < textArray.length; i++) {
    if (lineText.length < maxLineWords && i !== textArray.length-1 ) {
      lineText += (textArray[i] + ' ');
    } else {
      context.fillText(lineText, indent, lineHeight);
      lineHeight += lineIncrement;
      lineText  = (textArray[i] + ' ');
    }
  }

}

function getPetsArr () {
  const tmpArr = shuffle(common);

  return tmpArr;
}

function getRarePetsArr () {
  const tmpArr = shuffle(rare);

  return tmpArr;
}

function shuffle(array) {
  let currentIndex = array.length
  let temporaryValue;
  let randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function buildPDF () {

  const pdf = new jsPDF('p', 'pt', 'letter');
  pdf.addPage("a1", "portrait");
  pdf.setPage(1);
  pdf.addImage(finalImage, 'JPG', 0, 0, 612, 791);

  pdf.save('doggo-bingo.pdf');

}