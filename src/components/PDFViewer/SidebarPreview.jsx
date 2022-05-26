import { SidebarPreviewStyled } from "./components.styled";
import { Thumbnail } from "./Thumbnail";

export const SidebarPreview = ({
  allPDFPages,
  onSelectThumbnail,
  pageSelected,
}) => {
  return (
    <SidebarPreviewStyled>
      {allPDFPages.map((PDFpage, index) => (
        <Thumbnail
          selected={index === pageSelected}
          key={index}
          PDFpage={PDFpage}
          pageNumber={index}
          onSelectThumbnail={onSelectThumbnail}
        />
      ))}
    </SidebarPreviewStyled>
  );
};
