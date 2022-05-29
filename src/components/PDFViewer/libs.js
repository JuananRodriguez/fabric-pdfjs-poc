import * as PDFJS from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { fabric } from "fabric";

PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

if (fabric.isWebglSupported()) {
  fabric.textureSize = fabric.maxTextureSize;
}

export { PDFJS, fabric };
