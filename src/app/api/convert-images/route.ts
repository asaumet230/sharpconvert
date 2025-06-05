import { NextResponse } from 'next/server';
import sharp from 'sharp';


interface ConvertedFile {
  name: string;
  base64: string;
  sizeKB: number
}

async function convertirABuffer(file: File): Promise<Buffer> {

  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);

}

export async function POST(req: Request) {

  if (!req.body) {

    return NextResponse.json({
      error: 'No se recibieron imágenes',
    }, {
      status: 400,
    });
  }

  const formData = await req.formData();
  const files = formData.getAll('imagenes') as File[];
  const format = formData.get('format')?.toString().toLowerCase() || 'webp';

  if (!files || files.length === 0) {
    return NextResponse.json({
      error: 'No se recibieron imágenes'
    }, {
      status: 400
    });
  }

  const convertedFiles: ConvertedFile[] = [];

  for (const file of files) {

    try {
      const buffer = await convertirABuffer(file);
      const originalName = file.name.split('.')[0];
      const finalName = `${originalName}.${format}`;

      let image = sharp(buffer);

      switch (format) {
        case 'webp':

          image = image.webp({ quality: 80 });
          break;

        case 'png':

          image = image.png({ quality: 80 });
          break;

        case 'jpg':
        case 'jpeg':
          image = image.jpeg({ quality: 80 });
          break;

        case 'avif':
          image = image.avif({ quality: 80 });
          break;

        default:
          return NextResponse.json({ error: 'Formato no soportado' }, { status: 400 });
      }

      const convertedBuffer = await image.toBuffer();

      convertedFiles.push({
        name: finalName,
        base64: convertedBuffer.toString('base64'),
        sizeKB: +(convertedBuffer.length / 1024).toFixed(2)
      });

    } catch (error) {

      console.error('Error procesando imagen:', error);
      return NextResponse.json({
        error: 'Error al procesar las imágenes'
      }, {
        status: 500
      });
    }
  }

  return NextResponse.json({ files: convertedFiles });
}
