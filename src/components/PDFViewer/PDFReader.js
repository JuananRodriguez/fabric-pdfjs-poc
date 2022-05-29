import { PDFJS } from "./libs";
import { canvasToImageData } from "./helpers";
class PDFObject {
  _pdf = null;
  _pages = [];

  constructor(pdf) {
    this._pdf = pdf;
  }

  // ()=>Promise<Array<PDFPages>>
  getPages = () => {
    if (!this._pdf?.numPages) {
      return [];
    }
    const allPDFpage = [...Array(this._pdf.numPages).keys()];
    try {
      return Promise.all(
        allPDFpage.map((index) => this._pdf.getPage(index + 1))
      );
    } catch (err) {
      throw err;
    }
  };

  // ()=>Promise<Array<ImageData>>
  toImages = async () => {
    if (!this._pdf?.numPages) {
      return [];
    }

    const pages = await this.getPages();

    const canvasPromises = pages.map(async (PDFpage, index) => {
      const viewport = PDFpage.getViewport({ scale: 1 });
      let DOMCanvas = document.createElement("canvas");
      DOMCanvas.setAttribute("width", viewport.width);
      DOMCanvas.setAttribute("height", viewport.height);

      await PDFpage.render({
        canvasContext: DOMCanvas.getContext("2d"),
        viewport: viewport,
      }).promise;

      return canvasToImageData(DOMCanvas);
    });

    return await Promise.all(canvasPromises);
  };
}

export class PDFReader {
  static loadPdf = (file) =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const loadingTask = PDFJS.getDocument(url);
      loadingTask.promise
        .then((pdf) => {
          resolve(new PDFObject(pdf));
        })
        .catch(reject);
    });
}
