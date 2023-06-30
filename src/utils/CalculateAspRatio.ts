export const CalculateAspRatio = (
    desiredWidth: number,
    originalWidth: number,
    originalHeight: number
) => {
    const resizedHeight = (originalHeight / originalWidth) * desiredWidth;
    return [desiredWidth, resizedHeight];
};
