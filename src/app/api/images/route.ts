import { NextResponse } from 'next/server';

import sharp from 'sharp';
import path from 'path';
import { mkdirSync, existsSync, writeFileSync } from 'fs';


async function convertirABuffer(file: File): Promise<Buffer> {

    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

export async function POST(req: Request) {
   
    if (!req.body) {
        return NextResponse.json({ error: 'No se recibieron imágenes' }, { status: 400 });
    }

    const formData = await req.formData();
    const files = formData.getAll('imagenes') as File[];

    if (!files || files.length === 0) {
        return NextResponse.json({ error: 'No se recibieron imágenes' }, { status: 400 });
    }

    const webpDir = path.join(process.cwd(), 'public', 'webp');

    if (!existsSync(webpDir)) {
        mkdirSync(webpDir, { recursive: true });
    }

    const urls: string[] = [];

    for (const file of files) {

        try {

            const buffer = await convertirABuffer(file);
            const nombre = `${Date.now()}-${Math.floor(Math.random() * 1000)}.webp`;
            const outputPath = path.join(webpDir, nombre);

            const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
            writeFileSync(outputPath, webpBuffer);

            urls.push(`/webp/${nombre}`);

        } catch (error) {

            console.error('Error procesando imagen:', error);
            return NextResponse.json({ error: 'Error al procesar las imágenes' }, { status: 500 });
            
        }
    }

    return NextResponse.json({ urls });
}
