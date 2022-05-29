import { useMemo } from "react";
import { imageDataToImg } from "./helpers";
import { ThumbnailStyled } from "./components.styled";

export const Thumbnail = ({
  pageNumber,
  PDFImage,
  onSelectThumbnail,
  selected,
}) => {
  const imgData = useMemo(() => imageDataToImg(PDFImage), [PDFImage]);

  return (
    <ThumbnailStyled
      selected={selected}
      className={`thumbnail ${selected ? "selected" : "no-selected"}`}
      role="button"
      onClick={() => onSelectThumbnail(pageNumber)}
    >
      <img src={imgData} alt={`page ${pageNumber}`} />
    </ThumbnailStyled>
  );
};
