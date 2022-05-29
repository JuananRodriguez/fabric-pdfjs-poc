import { fabric } from "./libs";

export async function renderPage({ PDFpage, scale = 1, canvas }) {
  if (canvas) {
    const { clientWidth: parentWidth, clientHeight: parentHeight } =
      canvas.parentNode;

    const { height: pageHeight, width: pageWidth } = PDFpage.getViewport({
      scale: 1,
    });

    const isVertical = pageHeight > pageWidth;

    const scale = isVertical
      ? parentHeight / pageHeight
      : parentWidth / pageWidth;

    const viewport = PDFpage.getViewport({
      scale,
      rotation: 0,
      dontFlip: false,
    });

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.top = isVertical ? "50%" : 0;
    canvas.style.left = isVertical ? "50%" : 0;
    canvas.style.transform = isVertical ? "translate(-50%, -50%)" : "";

    return await PDFpage.render({
      canvasContext: canvas.getContext("2d"),
      viewport: viewport,
    });
  }
}

export const renderImage: RenderImage = (file) => {
  return new Promise((resolve) => {
    const blobToUrl = window.URL.createObjectURL(file);

    const resolveUrlCallback = (oImg) => {
      // oImg.originX = "center";
      // oImg.originY = "center";
      // oImg.scaleToHeight(600);
      // oImg.scaleToWidth(600);
      resolve(oImg);
    };

    fabric.Image.fromURL(blobToUrl, resolveUrlCallback);
  });
};

export const imageDataToCanvas = (imageData) => {
  // const width = canvas.offsetWidth || canvas.width;
  // const height = canvas.offsetHeight || canvas.height;
console.log(imageData)
  let canvas = document.createElement("canvas");
  canvas.setAttribute("width", imageData.width);
  canvas.setAttribute("height", imageData.height);
  canvas.getContext("2d").putImageData(imageData, 0, 0);
  return canvas;
};

export const canvasToImageData = (canvas) => {
  const width = canvas.offsetWidth || canvas.width;
  const height = canvas.offsetHeight || canvas.height;
  return canvas.getContext("2d").getImageData(0, 0, width, height);
};

export const imageDataToImg = (imageData) => {
  console.log('dentrooooooo')
  const canvas = imageDataToCanvas(imageData);
  return canvas.toDataURL();
};
