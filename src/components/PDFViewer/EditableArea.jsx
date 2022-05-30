import { useRef, useEffect } from "react";
import {
  imageDataToCanvas,
  imageDataToImg,
  canvasToImageData,
  imageDataFromImage,
} from "./helpers";
import { fabric } from "./libs";
import { jsPDF } from "./libs";
import { saveAs } from "file-saver";

export const EditableArea = ({
  PDFImage,
  onSavePDFImage,
  onRemovePDFImage,
}) => {
  const domCanvas = useRef(null);

  const _imageToBeTreated = useRef(null);
  const _treatmentArea = useRef(null);

  const applyFilter = (filter) => {
    _imageToBeTreated.current.filters.push(filter);
    _imageToBeTreated.current.applyFilters();
    _treatmentArea.current.requestRenderAll();
  };

  const changeToGrayScale = (): void => {
    const filter = new fabric.Image.filters.Grayscale();
    applyFilter(filter);
  };

  useEffect(() => {
    if (PDFImage) {
      _treatmentArea.current = new fabric.Canvas(domCanvas.current, {
        height: PDFImage.height,
        width: PDFImage.width,
      });

      fabric.Image.fromURL(imageDataToCanvas(PDFImage).toDataURL(), (img) => {
        _imageToBeTreated.current = img;
        _treatmentArea.current.add(img);
        _imageToBeTreated.current.bringToFront();
        _treatmentArea.current.renderAll();
      });
    }
  }, [PDFImage]);

  const onSave = async () => {
    // const imageData = canvasToImageData(domCanvas.current);
    const img = domCanvas.current.toDataURL("image/png");
    const width = domCanvas.current.offsetWidth;
    const height = domCanvas.current.offsetHeight;
    const imageData = await imageDataFromImage(img, width, height);
    onSavePDFImage(imageData);

    // onSavePDFImage(imageData);
    // const img = domCanvas.current.toDataURL("image/png")

    //   // const canvas = imageDataToCanvas(imageData);
    //   const img = imageDataToImg(imageData);

    // const { width, height } = domCanvas.current;

    // const doc = new jsPDF(width > height ? "landscape" : "portrait", "px");

    // doc.deletePage(1);
    // doc.addPage([width, height], width > height ? "landscape" : "portrait");
    // doc.addImage(img, "PNG", 0, 0, width, height);

    // const blob = new Blob([doc.output("blob")], { type: "application/pdf" });
    // saveAs(blob, "image.pdf");
  };

  return (
    <>
      <div>
        <button onClick={changeToGrayScale}> To B&W</button>
        <button onClick={onSave}> Save</button>
        <button onClick={onRemovePDFImage}> Remove</button>
      </div>
      <div className="scroller">
        <canvas
          ref={domCanvas}
          data-height={PDFImage.height}
          data-width={PDFImage.width}
        />
      </div>
    </>
  );
};
