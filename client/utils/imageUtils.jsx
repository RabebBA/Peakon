export const createImage = (src) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;

    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
  });
};
