import archiver from 'archiver';
import { createWriteStream } from 'fs';
import { unlink, readFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const createZipWithImages = async (files: { buffer: Buffer; name: string }[]): Promise<{ buffer: Buffer; fileName: string }> => {

    const zipName = `imagenes-${uuidv4()}.zip`;
    const zipPath = path.join('/tmp', zipName);

    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);

    files.forEach(file => {
        archive.append(file.buffer, { name: file.name });
    });

    await archive.finalize();

    await new Promise<void>((resolve, reject) => {
        output.on('close', resolve);
        output.on('error', reject);
    });

    const buffer = await readFile(zipPath);
    await unlink(zipPath);

    return { buffer, fileName: zipName };
};
