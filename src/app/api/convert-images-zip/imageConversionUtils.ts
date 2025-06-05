import sharp from 'sharp';

export const getImageFormatHandler = (format: string) => {
    switch (format) {
        case 'webp':
            return (img: sharp.Sharp) => img.webp({ quality: 80 });
        case 'png':
            return (img: sharp.Sharp) => img.png({ quality: 80 });
        case 'jpg':
        case 'jpeg':
            return (img: sharp.Sharp) => img.jpeg({ quality: 80 });
        case 'avif':
            return (img: sharp.Sharp) => img.avif({ quality: 80 });
        default:
            throw new Error('Formato no soportado');
    }
};

export const convertImageBuffer = async (
    buffer: Buffer,
    format: string
): Promise<Buffer> => {
    const sharpImage = sharp(buffer);
    const handler = getImageFormatHandler(format);
    return await handler(sharpImage).toBuffer();
};
