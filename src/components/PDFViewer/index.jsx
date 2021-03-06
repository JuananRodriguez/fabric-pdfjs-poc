import { useState, useEffect, useLayoutEffect } from "react";
// import { useWindowResize } from "./useWindowResize.hook";
import { PDFReader } from "./PDFReader";
import { jsPDF } from "./libs";
import { imageDataToImg, imageDataToCanvas } from "./helpers";

// Components
import { SidebarPreview } from "./SidebarPreview";
import { ViewerWrapper, MainCanvas } from "./components.styled";
import { EditableArea } from "./EditableArea";

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
  };

  const handleDownload = () => {
    const doc = new jsPDF("portrait", "px");
    doc.deletePage(1);

    allPDFImages.forEach((imageData) => {
      const img = imageDataToImg(imageData);
      const { width, height } = imageData;

      doc.addPage([width, height], width > height ? "landscape" : "portrait");
      doc.addImage(img, "PNG", 0, 0, width, height, "", "MEDIUM");
    });

    const blob = new Blob([doc.output("blob")], { type: "application/pdf" });
    saveAs(blob, "image.pdf");
  };

  const onRemoveSelectedPage = () => {
    setAllPDFImages((allPDFImages) =>
      allPDFImages.filter((img, index) => index !== pageSelected)
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
