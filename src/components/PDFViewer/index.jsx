import { useState, useCallback, useEffect, useLayoutEffect } from "react";
// import { useWindowResize } from "./useWindowResize.hook";
import { PDFReader } from "./PDFReader";

// Components
import { SidebarPreview } from "./SidebarPreview";
import { ViewerWrapper, MainCanvas } from "./components.styled";
import { EditableArea } from "./EditableArea";

// import { renderImage } from "../Fabric/helpers/renderImage.helper";
// import { fabric } from "fabric";

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

  const onRemoveSelectedPage = () => {
    setAllPDFImages((allPDFImages) =>
      allPDFImages.filter((i) => i !== allPDFImages[pageSelected])
    );
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
      </ViewerWrapper>
    </>
  );
};
