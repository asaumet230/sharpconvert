import { NextResponse } from 'next/server';
import archiver from 'archiver';
import { createWriteStream } from 'fs';
import { unlink, writeFile, readFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('imagenes') as File[];
    const format = formData.get('format')?.toString().toLowerCase() || 'webp';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No se recibieron archivos.' }, { status: 400 });
    }

    const zipName = `imagenes-${uuidv4()}.zip`;
    const zipPath = path.join('/tmp', zipName);

    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const originalName = file.name.split('.')[0];
      const finalName = `${originalName}.${format}`;

      let image = sharp(buffer);

      // Convertir según el formato
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
      archive.append(convertedBuffer, { name: finalName });
    }

    await archive.finalize();

    await new Promise<void>((resolve, reject) => {
      output.on('close', resolve);
      output.on('error', reject);
    });

    const zipBuffer = await readFile(zipPath);
    await unlink(zipPath);

    return new Response(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipName}"`,
      }
    });

  } catch (err) {
    console.error('Error al generar el ZIP:', err);
    return NextResponse.json({ error: 'Error generando el archivo zip.' }, { status: 500 });
  }
}
