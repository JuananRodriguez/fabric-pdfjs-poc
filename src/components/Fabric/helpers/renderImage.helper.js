// @flow
import { fabric } from 'fabric';

import type { File } from 'types';

type RenderImage = (file: File) => Promise<any>;

export const renderImage: RenderImage = file => {
  return new Promise(resolve => {
    const blobToUrl = window.URL.createObjectURL(file);

    const resolveUrlCallback = oImg => {
      oImg.originX = 'center';
      oImg.originY = 'center';
      oImg.scaleToHeight(600);
      oImg.scaleToWidth(600);
      resolve(oImg);
    };

    fabric.Image.fromURL(blobToUrl, resolveUrlCallback);
  });
};
