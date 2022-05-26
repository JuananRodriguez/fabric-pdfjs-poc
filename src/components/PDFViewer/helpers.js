import { PDFJS } from "./lib";
import { fabric } from "fabric";

export const loadPdf = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const loadingTask = PDFJS.getDocument(url);
    loadingTask.promise.then(resolve).catch(reject);
  });

export const getAllPDFpage = async (pdf) => {
  if (pdf?.numPages) {
    const allPDFpage = [...Array(pdf.numPages).keys()];
    await allPDFpage.forEach(async (index) => {
      const pageNumber = index + 1;
      const PDFpage = await pdf.getPage(pageNumber);
      allPDFpage[index] = PDFpage;
    });
    return allPDFpage;
  }
  return [];
};

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
