// @flow

// Vendors
import { useLayoutEffect, useRef } from "react";
import { fabric } from "fabric";

// Helpers
import { renderImage } from "./helpers/renderImage.helper";

type Axis = "X" | "Y";
type Props = {
  file: ?File,
  containerId: string,
  canvasId: string,
};

export const useImageTreatment = ({ containerId, canvasId, file }: Props) => {
  const _treatmentArea = useRef(null);
  const _imageToBeTreated = useRef(null);
  const _cropArea = useRef(null);

  useLayoutEffect(() => {
    const container = document.getElementById(containerId);
    if (container) {
      _treatmentArea.current = new fabric.Canvas(canvasId, {
        height: container.clientHeight,
        width: container.clientWidth,
      });
    }
  }, [canvasId, containerId]);

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

  const addImageToCanvas = async () => {
    _imageToBeTreated.current = await renderImage(file);
    _treatmentArea.current.add(_imageToBeTreated.current);
    _treatmentArea.current.centerObject(_imageToBeTreated.current);
  };

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

  const initialiseCanvas = async () => {
    await addImageToCanvas();
    addFrameToCanvas();
  };

  useLayoutEffect(() => {
    if (_treatmentArea.current) {
      initialiseCanvas();
    }
  }, [file]);

  // TODO: desisto... no funciona
  // const handleUndo = () => {
  //   const newHistory = [...history];
  //   const lastWork = newHistory.pop();
  //   if (lastWork) {
  //     // setHistory(newHistory);
  //     _treatmentArea.current = _treatmentArea.current.loadFromJSON(lastWork, () => _treatmentArea.current.renderAll());
  //   }
  // };

  const flipImage = (axis: Axis): void => {
    _imageToBeTreated.current.set(
      `flip${axis.toUpperCase()}`,
      !_imageToBeTreated.current[`flip${axis.toUpperCase()}`]
    );
    updateTreatmentArea();
  };

  const rotateImage = (degrees: number): void => {
    let { angle } = _imageToBeTreated.current;
    angle += degrees;

    if (angle >= 360 || angle <= -360) {
      angle = Math.abs(angle) - 360;
    }

    _imageToBeTreated.current.set("angle", angle);
    updateTreatmentArea();
  };

  const changeContrast = (amount: number): void => {
    var filter = new fabric.Image.filters.Contrast({ contrast: amount });
    applyFilter(filter);
  };

  const changeBrightness = (amount: number): void => {
    var filter = new fabric.Image.filters.Brightness({ brightness: amount });
    applyFilter(filter);
  };

  const changeToGrayScale = (): void => {
    var filter = new fabric.Image.filters.Grayscale();
    applyFilter(filter);
  };

  const getSelectedFragment = async (): Promise<Blob> => {
    const cropArea = {
      height: _cropArea.current.getScaledHeight(),
      width: _cropArea.current.getScaledWidth(),
      left: _cropArea.current.left - _cropArea.current.getScaledWidth() / 2,
      top: _cropArea.current.top - _cropArea.current.getScaledHeight() / 2,
    };

    const imageUrl = _treatmentArea.current.toDataURL(cropArea);
    const blob = await fetch(imageUrl).then((res) => res.blob());
    return blob;
  };

  return {
    flipImage,
    rotateImage,
    changeContrast,
    changeBrightness,
    changeToGrayScale,
    getSelectedFragment,
  };
};
