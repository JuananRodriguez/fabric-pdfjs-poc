import styled from "styled-components";

export const ViewerWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 97vh; // todo change
  overflow: hidden;
`;

export const MainCanvas = styled.div`
  width: 100%;
  overflow: hidden;
  flex: 1;
  display: flex;

  & > .scroller {
    position: relative;
    overflow: auto;
    width: 100%;
    height: 100%;

    & .canvas-container {
      position: absolute;
      background: grey;
      z-index: 2;
    }

    & > canvas.hidden {
      position: absolute;
      z-index: 1;
      visibility: hidden;
    }
  }
`;

export const SidebarPreviewStyled = styled.aside`
  background: grey;
  padding: 0.5rem;
  overflow: auto;
  min-height: 100%;

  & .thumbnail {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    background: white;
    width: 120px;
    cursor: pointer;

    &.selected {
      outline: solid;
    }
  }
`;

export const PagePreviewStyled = styled.aside`
  // height: 500px;
`;
