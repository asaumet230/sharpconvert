import { NextResponse } from 'next/server';
import sharp from 'sharp';

interface ConvertedFile {
  name: string;
  base64: string;
  sizeKB: number;
}

async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

const formatHandlers: Record<string, (image: sharp.Sharp) => sharp.Sharp> = {
  webp: (img) => img.webp({ quality: 80 }),
  png: (img) => img.png({ quality: 80 }),
  jpg: (img) => img.jpeg({ quality: 80 }),
  jpeg: (img) => img.jpeg({ quality: 80 }),
  avif: (img) => img.avif({ quality: 80 }),
};

async function convertFile(file: File, format: string): Promise<ConvertedFile> {
  const buffer = await fileToBuffer(file);
  const image = sharp(buffer);
  const originalName = file.name.split('.')[0];
  const finalName = `${originalName}.${format}`;

  const convertedBuffer = await formatHandlers[format](image).toBuffer();

  return {
    name: finalName,
    base64: convertedBuffer.toString('base64'),
    sizeKB: +(convertedBuffer.length / 1024).toFixed(2),
  };
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('imagenes') as File[];
    const format = formData.get('format')?.toString().toLowerCase() || 'webp';

    if (!formatHandlers[format]) {
      return NextResponse.json({ error: 'Formato no soportado' }, { status: 400 });
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No se recibieron imágenes' }, { status: 400 });
    }

    const convertedFiles: ConvertedFile[] = [];

    for (const file of files) {
      const converted = await convertFile(file, format);
      convertedFiles.push(converted);
    }

    return NextResponse.json({ files: convertedFiles });

  } catch (error) {
    console.error('Error procesando imágenes:', error);
    return NextResponse.json({ error: 'Error al procesar las imágenes' }, { status: 500 });
  }
}
