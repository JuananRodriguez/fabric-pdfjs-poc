import { SidebarPreviewStyled } from "./components.styled";
import { Thumbnail } from "./Thumbnail";

export const SidebarPreview = ({
  allPDFImages,
  onSelectThumbnail,
  pageSelected,
}) => {
  return (
    <SidebarPreviewStyled>
      {allPDFImages.map((image, index) => (
        <Thumbnail
          selected={index === pageSelected}
          key={index}
          PDFImage={image}
          pageNumber={index}
          onSelectThumbnail={onSelectThumbnail}
        />
      ))}
    </SidebarPreviewStyled>
  );
};
