'use client'

import { useRef, useState } from 'react';

import Image from 'next/image';
import Swal from 'sweetalert2';
import { FaTrashCan, FaUpload, FaBroom } from 'react-icons/fa6';
import { FaSyncAlt } from 'react-icons/fa';

import { useAppDispatch, useAppSelector } from '@/store';

import { SpinnerLoadImages } from '..';
import { isImagesLoad } from '@/store/imageComponentsLoad/imagesComponentsLoad';

interface ImagePreview {
    file: File;
    url: string;
    originalSizeKB: number;
    convertedSizeKB?: number;
    progress: number;
}

export const ImagesForm = () => {

    const [urls, setUrls] = useState<string[]>([]);
    const [outputFormat, setOutputFormat] = useState('webp');
    const [filePreviews, setFilePreviews] = useState<ImagePreview[]>([]);
    const [filesToConvert, setFilesToConvert] = useState<FileList | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [globalProgress, setGlobalProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);


    const imagesLoad = useAppSelector(state => state.imagesComponentsLoad.isImagesLoad);
    const dispatch = useAppDispatch();

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

        if (files.length > 20) {
            Swal.fire('¡Ups!', 'Solo se permiten hasta 20 imágenes a la vez.', 'warning');
            return;
        }

        const sameFormatImages = Array.from(files).every(file => {
            const fileExt = file.name.split('.').pop()?.toLowerCase();
            return fileExt === outputFormat.toLowerCase();
        });

        if (sameFormatImages) {
            Swal.fire(
                'Formato inválido',
                `Todas las imágenes ya están en formato .${outputFormat}. Por favor selecciona un formato de salida diferente.`,
                'warning'
            );
            return;
        }

        const newPreviews = Array.from(files).map(file => ({
            file,
            url: URL.createObjectURL(file),
            originalSizeKB: +(file.size / 1024).toFixed(2),
            progress: 0
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

        setIsLoading(true);
        setGlobalProgress(0);

        let progress = 0;

        const interval = setInterval(() => {

            progress += Math.floor(Math.random() * 5) + 3;
            setGlobalProgress(p => Math.min(progress, 95));
            if (progress >= 95) clearInterval(interval);

        }, 100);

        const formData = new FormData();
        formData.append('format', outputFormat);

        Array.from(filesToConvert).forEach(file => {
            formData.append('imagenes', file);
        });

        const res = await fetch('/api/images', {
            method: 'POST',
            body: formData,
        });


        clearInterval(interval);
        setGlobalProgress(100);

        await new Promise(resolve => setTimeout(resolve, 400));

        const data = await res.json();

        if (data.urls) {

            // const updatedPreviews = filePreviews.map((preview, index) => ({
            //     ...preview,
            //     convertedSizeKB: data.sizes[index]
            // }));

            // setFilePreviews(updatedPreviews);

            setUrls(data.urls);
            Swal.fire('¡Listo!', 'Las imágenes fueron convertidas con éxito.', 'success');
        } else {
            Swal.fire('Error', 'Hubo un problema al convertir las imágenes.', 'error');
        }
    };

    return (
        <div className='flex flex-col items-center justify-center'>

            {
                filePreviews.length <= 0 && (
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
                )
            }

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
                            className="flex items-center mt-6 px-3 py-2 cursor-pointer bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition">
                            <FaUpload className="text-md mr-2" />
                            <p>Seleccionar imágenes</p>
                        </button>
                    </div>

                ) : (
                    <SpinnerLoadImages />
                )
            }

            {
                imagesLoad && (
                    <div className='flex gap-4 justify-center w-7/12 my-10'>
                        <button
                            className='flex justify-center items-center gap-2  cursor-pointer w-full p-3 font-semibold bg-yellow-400 text-black rounded-md text-base hover:bg-yellow-500 transition-colors'
                            onClick={handleConvert}>
                            <FaSyncAlt className="text-sm" />
                            <p>Convertir imágenes</p>
                        </button>

                        <button
                            className='flex justify-center items-center gap-2 cursor-pointer w-full p-3 font-semibold bg-green-700 text-white rounded-md text-base hover:bg-green-800 transition-colors'
                            onClick={() => {
                                setUrls([]);
                                setFilePreviews([]);
                                setFilesToConvert(null);
                                dispatch(isImagesLoad(false));
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}>
                            <FaBroom className="text-sm" />
                            Limpiar
                        </button>
                    </div>
                )
            }

            {
                imagesLoad && (
                    <div className="w-full max-w-3xl mt-6 space-y-4">
                        {
                            filePreviews.map((item, index) => (

                                <div key={index} className="flex items-center bg-gray-50 border border-gray-300 p-2 rounded-lg shadow-md">

                                    <img src={item.url} alt={item.file.name} className="w-12 h-12 object-cover rounded-lg mr-4 border border-gray-300" />

                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-500"> Nombre: {item.file.name}</p>

                                        <p className="text-sm text-gray-500">
                                            Tamaño: {item.originalSizeKB} KB
                                        </p>
                                    </div>


                                    {isLoading && (
                                        <div className="w-3/12 mr-5">
                                            <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
                                                    style={{ width: `${globalProgress}%` }}
                                                />
                                                <span className={`absolute inset-0 flex items-center justify-center ${globalProgress > 50 ? 'text-white' : 'text-gray-900'} font-semibold text-sm`}>
                                                    {globalProgress}%
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {
                                        globalProgress == 100 && (
                                            <span className="text-green-600 text-sm mr-2 uppercase"> {outputFormat} | {item.convertedSizeKB} 60 KB</span>
                                        )}

                                    {
                                        !isLoading && (
                                            <button
                                                onClick={() => handleRemoveFile(index)}
                                                className="mr-4 text-red-700 hover:text-red-800 flex items-center justify-center cursor-pointer"
                                                title="Eliminar">
                                                <p className='text-sm font-medium'>Eliminar</p>
                                                <FaTrashCan className="text-xl ml-2" />
                                            </button>
                                        )
                                    }

                                </div>
                            ))}
                    </div>)
            }

            {
                filePreviews.length <= 0 && (<div className="text-center text-gray-500 text-sm font-medium">
                    No has seleccionado ningún archivo. Puedes convertir hasta 20 imágenes por carga.
                </div>)
            }

            {urls.length > 0 && (
                <div>
                    <h2 className="text-2xl mt-10 mb-4 text-center font-bold ">Imágenes convertidas:</h2>
                    <div className="flex flex-wrap justify-center">
                        {urls.map((url, i) => (
                            <img key={i} src={url} alt={`img-${i}`} style={{ maxWidth: 150, margin: 10 }} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImagesForm;
