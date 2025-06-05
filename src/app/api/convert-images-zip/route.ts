import { NextResponse } from 'next/server';

import { convertImageBuffer, createZipWithImages } from '.';


export async function POST(req: Request) {

  try {
    const formData = await req.formData();
    const files = formData.getAll('imagenes') as File[];
    const format = formData.get('format')?.toString().toLowerCase() || 'webp';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No se recibieron archivos.' }, { status: 400 });
    }

    const processedFiles: { buffer: Buffer; name: string }[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const originalName = file.name.split('.')[0];
      const finalName = `${originalName}.${format}`;

      const convertedBuffer = await convertImageBuffer(buffer, format);
      processedFiles.push({ buffer: convertedBuffer, name: finalName });
    }

    const { buffer: zipBuffer, fileName } = await createZipWithImages(processedFiles);

    return new Response(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      }
    });

  } catch (err) {
    console.error('Error al generar el ZIP:', err);
    return NextResponse.json({ error: 'Error generando el archivo zip.' }, { status: 500 });
  }
}
