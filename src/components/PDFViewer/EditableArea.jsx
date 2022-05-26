import { useRef, useLayoutEffect } from "react";
import { renderPage, renderImage } from "./helpers";
import { fabric } from "fabric";

// fabric.textureSize = 50000;

export const EditableArea = ({ PDFpage, onSavePdfPage }) => {
  const hiddenCanvas = useRef(null);
  const editableCanvas = useRef(null);
  const container = useRef(null);
  const _cropArea = useRef(null);

  const _imageToBeTreated = useRef(null);
  const _treatmentArea = useRef(null);

  const addFrameToCanvas = () => {
    _cropArea.current = new fabric.Rect({
      originX: "center",
      originY: "center",
      borderColor: "red",
      fill: "transparent",
      width: 600,
      height: 600,
    });

    // remove the rotation handler from the controls
    _cropArea.current.controls = {
      ...fabric.Rect.prototype.controls,
      mtr: new fabric.Control({ visible: false }),
    };

    _treatmentArea.current.add(_cropArea.current);
    _treatmentArea.current.centerObject(_cropArea.current);

    // Adding permanent border to frame
    _treatmentArea.current.on("after:render", function () {
      _treatmentArea.current.contextContainer.strokeStyle = "red";
      var bound = _cropArea.current.getBoundingRect();
      _treatmentArea.current.contextContainer.strokeRect(
        bound.left + 0.5,
        bound.top + 0.5,
        bound.width,
        bound.height
      );
    });
  };

  const updateTreatmentArea = () => {
    _treatmentArea.current.requestRenderAll();
    // TODO: save in history
    // setHistory(history => [...history, _treatmentArea.current.toJSON()]);
  };

  const applyFilter = (filter) => {
    _imageToBeTreated.current.filters.push(filter);
    _imageToBeTreated.current.applyFilters();
    updateTreatmentArea();
  };

  const changeToGrayScale = (): void => {
    var filter = new fabric.Image.filters.Grayscale();
    applyFilter(filter);
  };

  useLayoutEffect(() => {
    const renderHiddenCanvas = async (PDFpage) => {
      // display real PNG image from PDF in DOM Canvas
      const { promise } = await renderPage({
        PDFpage,
        canvas: hiddenCanvas.current,
      });

      promise.then(async () => {
        // create fabric editable canvas
        _treatmentArea.current = new fabric.Canvas(editableCanvas.current, {
          height: hiddenCanvas.current.clientHeight,
          width: hiddenCanvas.current.clientWidth,
          //   height: container.current.clientHeight,
          //   width: container.current.clientWidth,
        });

        const imageUrl = hiddenCanvas.current.toDataURL("image/jpeg", 1.0);
        const blob = await fetch(imageUrl).then((res) => res.blob());
        _imageToBeTreated.current = await renderImage(blob);
        _treatmentArea.current.add(_imageToBeTreated.current);
        addFrameToCanvas();
      });
    };

    if (container.current) {
      renderHiddenCanvas(PDFpage);
    }
  }, [hiddenCanvas, PDFpage]);

  const onSave = async () => {
      console.log(PDFpage)
    const imageUrl = _treatmentArea.current.toDataURL();
    const blob = await fetch(imageUrl).then((res) => res.blob());
    onSavePdfPage(blob);
  };

  return (
    <>
      <div>
        <button onClick={changeToGrayScale}> To B&W</button>
        <button onClick={onSave}> Save</button>
      </div>
      <div ref={container} className="scroller">
        <canvas ref={editableCanvas} />
        <canvas className="hidden" ref={hiddenCanvas} />
      </div>
    </>
  );
};
