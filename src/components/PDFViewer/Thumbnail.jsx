import { useLayoutEffect, useRef } from "react";

const renderThumbnail = async ({ PDFpage, canvas }) => {
  canvas.width = canvas.parentNode.offsetWidth;

  const viewport = PDFpage.getViewport({
    scale: canvas.width / PDFpage.getViewport({ scale: 1 }).width,
    rotation: 0,
    dontFlip: false,
  });
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await PDFpage.render({
    canvasContext: canvas.getContext("2d"),
    viewport: viewport,
  });
};

export const Thumbnail = ({
  pageNumber,
  PDFpage,
  onSelectThumbnail,
  selected,
}) => {
  const thumbnailCanvas = useRef(null);

  useLayoutEffect(() => {
    if (thumbnailCanvas.current && PDFpage) {
      renderThumbnail({ PDFpage, canvas: thumbnailCanvas.current });
    }
  }, [PDFpage, thumbnailCanvas]);

  return (
    <div
      className={`thumbnail ${selected ? "selected" : "no-selected"}`}
      role="button"
      onClick={() => onSelectThumbnail(pageNumber)}
    >
      <canvas ref={thumbnailCanvas} />
    </div>
  );
};
