import { useRef, useEffect } from "react";
import { imageDataToCanvas, canvasToImageData } from "./helpers";
import { fabric } from "./libs";

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

  const onSave = () => {
    const imageData = canvasToImageData(domCanvas.current);
    onSavePDFImage(imageData);
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
