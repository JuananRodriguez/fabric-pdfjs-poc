import { useState, useEffect, useLayoutEffect } from "react";
// import { useWindowResize } from "./useWindowResize.hook";
import { PDFReader } from "./PDFReader";
import { jsPDF } from "./libs";
import { imageDataToImg, imageDataToCanvas } from "./helpers";

// Components
import { SidebarPreview } from "./SidebarPreview";
import { ViewerWrapper, MainCanvas } from "./components.styled";
import { EditableArea } from "./EditableArea";

// import { renderImage } from "../Fabric/helpers/renderImage.helper";
// import { fabric } from "fabric";
import { saveAs } from "file-saver";

export const PDFViewer = ({ file }) => {
  const [pdf, setPdf] = useState(null);
  const [allPDFImages, setAllPDFImages] = useState([]);
  const [pageSelected, setPageSelected] = useState(0);

  useEffect(() => {
    file && PDFReader.loadPdf(file).then(setPdf).catch(alert);
  }, [file]);

  useLayoutEffect(() => {
    if (pdf) {
      pdf.toImages().then(setAllPDFImages);
    }
  }, [pdf]);

  // useWindowResize({ onResizeEnd: () => renderPage({ pdf, pageNumber: page }) });

  if (!pdf || !allPDFImages.length) {
    return null;
  }

  const onSelectThumbnail = (thumbnailSelected) => {
    setPageSelected(thumbnailSelected);
  };

  const onSaveSelectedPage = (imageData) => {
    const newAllPDFImages = [...allPDFImages];
    newAllPDFImages[pageSelected] = imageData;
    setAllPDFImages(newAllPDFImages);

    //   // const canvas = imageDataToCanvas(imageData);
    //   const img = imageDataToImg(imageData);

    //   const { width, height } = canvas;

    //   const doc = new jsPDF(width > height ? "landscape" : "portrait", "px");

    //   doc.deletePage(1);
    //   doc.addPage([width, height], width > height ? "landscape" : "portrait");
    //   doc.addImage(img, "PNG", 0, 0, width, height);

    //   const blob = new Blob([doc.output("blob")], { type: "application/pdf" });
    //   saveAs(blob, "image.pdf");
  };

  const handleDownload = () => {
    // const canvas = document.getElementById("the-canvas").firstChild;
    // const img = canvas.toDataURL("image/png");

    const imageData = allPDFImages[pageSelected];
    const img = imageDataToImg(imageData);

    const { width, height } = imageData;

    const doc = new jsPDF(width > height ? "landscape" : "portrait", "px");

    doc.deletePage(1);
    doc.addPage([width, height], width > height ? "landscape" : "portrait");
    doc.addImage(img, "PNG", 0, 0, width, height);

    const blob = new Blob([doc.output("blob")], { type: "application/pdf" });
    saveAs(blob, "image.pdf");
  };

  const onRemoveSelectedPage = () => {
    setAllPDFImages((allPDFImages) =>
      allPDFImages.filter((i) => i !== allPDFImages[pageSelected])
    );
  };

  const handleSetCanvas = () => {
    const canvas = imageDataToCanvas(allPDFImages[pageSelected]);
    const node = document.getElementById("the-canvas");
    node.appendChild(canvas);
  };

  return (
    <>
      <button
        disabled={pageSelected === 0}
        onClick={() => setPageSelected(pageSelected - 1)}
      >
        prev
      </button>
      <button
        disabled={pageSelected === allPDFImages.length}
        onClick={() => setPageSelected(pageSelected + 1)}
      >
        next
      </button>
      <button onClick={handleSetCanvas}>setCanvas</button>
      <button onClick={handleDownload}>download</button>
      <ViewerWrapper>
        <SidebarPreview
          pageSelected={pageSelected}
          allPDFImages={allPDFImages}
          onSelectThumbnail={onSelectThumbnail}
        />
        <MainCanvas>
          <EditableArea
            PDFImage={allPDFImages[pageSelected]}
            onSavePDFImage={onSaveSelectedPage}
            onRemovePDFImage={onRemoveSelectedPage}
          />
        </MainCanvas>
        <div id="the-canvas" />
      </ViewerWrapper>
    </>
  );
};
