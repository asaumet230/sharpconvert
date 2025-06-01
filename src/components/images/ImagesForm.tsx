'use client'

import { useRef, useState } from 'react';

import Image from 'next/image';
import Swal from 'sweetalert2';

import { SpinnerLoadImages } from '..';

interface ImagePreview {
    file: File;
    url: string;
    originalSizeKB: number;
    convertedSizeKB?: number;
}


export const ImagesForm = () => {

    const [urls, setUrls] = useState<string[]>([]);
    const [outputFormat, setOutputFormat] = useState('webp');
    const [filePreviews, setFilePreviews] = useState<ImagePreview[]>([]);
    const [filesToConvert, setFilesToConvert] = useState<FileList | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
   
    const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
        'image/gif', 'image/bmp', 'image/avif', 'image/tiff', 'image/heic'
    ];

    const validateAndStoreFiles = (files: FileList) => {

        if (!files || files.length === 0) {
            Swal.fire('¡Ups!', 'Selecciona al menos una imagen.', 'warning');
            return;
        }

        const invalidFiles = Array.from(files).filter(file => !allowedTypes.includes(file.type));
        if (invalidFiles.length > 0) {
            Swal.fire('Formato inválido', 'Solo se permiten imágenes en formato jpg, jpeg, png, webp, gif, bmp, avif, tiff y heic.', 'error');
            return;
        }

        if (files.length > 30) {
            Swal.fire('¡Ups!', 'Solo se permiten hasta 30 imágenes a la vez.', 'warning');
            return;
        }

        const newPreviews = Array.from(files).map(file => ({
            file,
            url: URL.createObjectURL(file),
            originalSizeKB: +(file.size / 1024).toFixed(2),
        }));

        setFilesToConvert(files);
        setFilePreviews(newPreviews);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        validateAndStoreFiles(files);
    };

    const handleRemoveFile = (index: number) => {

        const updated = [...filePreviews];

        updated.splice(index, 1);
        setFilePreviews(updated);

        const updatedFiles = new DataTransfer();
        updated.forEach(p => updatedFiles.items.add(p.file));
        setFilesToConvert(updatedFiles.files);
    };

    const handleConvert = async () => {

        if (!filesToConvert || filesToConvert.length === 0) {
            Swal.fire('¡Ups!', 'Primero debes seleccionar imágenes válidas.', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('format', outputFormat);

        Array.from(filesToConvert).forEach(file => {
            formData.append('imagenes', file);
        });

        const res = await fetch('/api/images', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();

        if (data.urls) {
            setUrls(data.urls);
            Swal.fire('¡Listo!', 'Las imágenes fueron convertidas con éxito.', 'success');
        } else {
            Swal.fire('Error', 'Hubo un problema al convertir las imágenes.', 'error');
        }
    };

    return (
        <div className='flex flex-col items-center justify-center'>

            <div className='mt-4'>

                <label className='font-semibold mr-5 text-2xl'>Formato de salida:</label>
                <select
                    className='p-4 font-semibold text-indigo-600 border-2 border-indigo-300 rounded-md text-lg'
                    name='outputFormat'
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
            </div>



            <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => validateAndStoreFiles(e.target.files!)}
                className="hidden" />

            {
                filePreviews.length <= 0 ? (
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={
                            `my-10 w-full bg-gray-100 max-w-md h-80 border-3 border-dashed rounded-lg flex flex-col items-center justify-center 
                    ${isDragging ? 'border-indigo-500 bg-indigo-100' : 'border-gray-400'}`}>

                        <Image
                            width={100}
                            height={100}
                            src='/images/no-hay-fotos.webp'
                            alt='no-hay-fotos' />
                        <p className="text-gray-500 text-base font-medium text-center px-4"> Arrastra y suelta tus imágenes aquí o </p>

                        <button
                            onClick={() => fileInputRef.current!.click()}
                            className="mt-6 px-3 py-2 cursor-pointer bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition">
                            Seleccionar imágenes
                        </button>
                    </div>

                ) : (
                    <SpinnerLoadImages />
                )
            }

            {
                filePreviews.length > 0 && (
                    <div className='flex gap-4 justify-center w-7/12 my-10'>
                        <button
                            className='cursor-pointer w-full px-3 py-2 font-semibold bg-yellow-400 text-black rounded-md text-lg hover:bg-yellow-500 transition-colors'
                            onClick={handleConvert}>
                            Convertir imágenes
                        </button>

                        <button
                            className='cursor-pointer w-full px-4 py-2 font-semibold bg-green-700 text-white rounded-md text-lg hover:bg-green-800 transition-colors'
                            onClick={() => {
                                setUrls([]);
                                setFilePreviews([]);
                                setFilesToConvert(null);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}>
                            Limpiar
                        </button>
                    </div>

                )
            }



            {
                filePreviews.length > 0 ? (<div className="w-full max-w-3xl mt-6 space-y-4">
                    {filePreviews.map((item, index) => (
                        <div key={index} className="flex items-center bg-gray-50 border p-4 rounded-lg shadow-sm">
                            <img src={item.url} alt={item.file.name} className="w-16 h-16 object-cover rounded mr-4 border" />
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">{item.file.name}</p>
                                <p className="text-sm text-gray-500">
                                    Original: {item.originalSizeKB} KB
                                    {item.convertedSizeKB && (
                                        <> → Convertido: <span className="text-green-600">{item.convertedSizeKB} KB</span></>
                                    )}
                                </p>
                            </div>
                            <button
                                onClick={() => handleRemoveFile(index)}
                                className="ml-4 text-red-600 hover:text-red-800 font-bold text-lg"
                                title="Eliminar"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>) : (<div className="text-center text-gray-500 text-lg font-medium">
                    ¡Ningún archivo seleccionado!
                </div>)
            }


            {urls.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Imágenes convertidas:</h2>
                    <div className="flex flex-wrap justify-center">
                        {urls.map((url, i) => (
                            <img key={i} src={url} alt={`img-${i}`} style={{ maxWidth: 200, margin: 10 }} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImagesForm;
