'use client'

import { ChangeEvent, useState } from 'react';

export const ImagesForm = () => {

    const [urls, setUrls] = useState<string[]>([]);
    const [outputFormat, setOutputFormat] = useState('webp');

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {

        e.preventDefault();
        const files = e.target.files;
        
        if (!files || files.length === 0) {
            alert('Selecciona al menos una imagen');
            return;
        }

        const formData = new FormData();
        formData.append('format', outputFormat);

        Array.from(files).forEach(file => {
            formData.append('imagenes', file);
        });

        const res = await fetch('/api/images', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();

        if (data.urls) {
            setUrls(data.urls);
        } else {
            alert('Error al convertir');
        }
    };

    return (
        <div>
            <label>Formato de salida:</label>
            <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
            >
                <option value="webp">WEBP</option>
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="jpeg">JPEG</option>
                <option value="gif">GIF</option>
                <option value="bmp">BMP</option>
                <option value="avif">AVIF</option>
            </select>

            <input type="file" multiple accept="image/*" onChange={handleUpload} />
            <button onClick={() => setUrls([])}>Limpiar</button>

            {urls.length > 0 && (
                <div>
                    <h2>Imágenes convertidas:</h2>
                    {urls.map((url, i) => (
                        <img key={i} src={url} alt={`img-${i}`} style={{ maxWidth: 200, margin: 10 }} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ImagesForm;
