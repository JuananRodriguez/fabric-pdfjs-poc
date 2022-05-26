import { useRef, useState, useEffect, useLayoutEffect } from "react";
// import { useWindowResize } from "./useWindowResize.hook";

// Components
import { SidebarPreview } from "./SidebarPreview";
import { ViewerWrapper, MainCanvas } from "./components.styled";
import { EditableArea } from "./EditableArea";

// helpers
import { getAllPDFpage, loadPdf } from "./helpers";
// import { renderImage } from "../Fabric/helpers/renderImage.helper";
// import { fabric } from "fabric";

export const PDFViewer = ({ file }) => {
  const [pdf, setPdf] = useState(null);
  const [allPDFPages, setAllPDFPages] = useState([]);
  const [pageSelected, setPageSelected] = useState(0);

  // const addImageToCanvas = async (pdf) => {
  //   const { promise } = await renderPage({
  //     pdf,
  //     pageSelected,
  //     canvas: mainCanvas.current,
  //   });

  //   if (enableEdition) {
  //     promise.then(async () => {
  //       const imageUrl = mainCanvas.current.toDataURL("image/jpeg", 1.0);
  //       console.log(imageUrl);
  //       const blob = await fetch(imageUrl).then((res) => res.blob());
  //       _imageToBeTreated.current = await renderImage(blob);
  //       mainCanvas.current = new fabric.Canvas(mainCanvas.current, {
  //         height: 1000,
  //         width: 1000,
  //       });
  //       mainCanvas.current.add(_imageToBeTreated.current);
  //     });
  //     // _treatmentArea.current.centerObject(_imageToBeTreated.current);
  //   }
  // };

  // load complete file;
  useEffect(() => {
    loadPdf(file).then(setPdf).catch(alert);
  }, [file]);

  // load every page and save in state
  useLayoutEffect(() => {
    getAllPDFpage(pdf).then(setAllPDFPages);
  }, [pdf]);

  //   useWindowResize({ onResizeEnd: () => renderPage({ pdf, pageNumber: page }) });

  if (!pdf || !allPDFPages.length) {
    return null;
  }

  const onSelectThumbnail = (thumbnailSelected) => {
    setPageSelected(thumbnailSelected);
  };

  const handleSaveSelectedPage = (blobFile) => {
    console.log(blobFile)
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
        disabled={pageSelected === allPDFPages.length}
        onClick={() => setPageSelected(pageSelected + 1)}
      >
        next
      </button>
      <ViewerWrapper>
        <SidebarPreview
          pageSelected={pageSelected}
          allPDFPages={allPDFPages}
          onSelectThumbnail={onSelectThumbnail}
        />
        <MainCanvas>
          <EditableArea
            PDFpage={allPDFPages[pageSelected]}
            onSavePdfPage={handleSaveSelectedPage}
          />
        </MainCanvas>
      </ViewerWrapper>
    </>
  );
};
