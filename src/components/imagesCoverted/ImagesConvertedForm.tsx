'use client'

import { useRef, useState } from 'react';

import Swal from 'sweetalert2';
import { FaTrashCan, FaDownload } from 'react-icons/fa6';

import { SpinnerLoadImages } from '..';
import { isImagesLoad } from '@/store/imageComponentsLoad/imagesComponentsLoad';

import { ConvertActions, DownloadActions, FileUploader, FormatSelector } from '.';

import { useAppDispatch, useAppSelector } from '@/store';
import { ImagePreview } from '@/interfaces';

export const ImagesForm = () => {

    const [urls, setUrls] = useState<string[]>([]);
    const [outputFormat, setOutputFormat] = useState('webp');
    const [filePreviews, setFilePreviews] = useState<ImagePreview[]>([]);
    const [filesToConvert, setFilesToConvert] = useState<FileList | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [conversionFinished, setConversionFinished] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [globalProgress, setGlobalProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);


    const imagesLoad = useAppSelector(state => state.imagesComponentsLoad.isImagesLoad);
    const dispatch = useAppDispatch();

    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/avif',
    ];

    const validateAndStoreFiles = (files: FileList) => {

        if (!files || files.length === 0) {
            Swal.fire('¡Ups!', 'Selecciona al menos una imagen.', 'warning');
            return;
        }

        const invalidFiles = Array.from(files).filter(file => !allowedTypes.includes(file.type));
        if (invalidFiles.length > 0) {
            Swal.fire('Formato inválido', 'Solo se permiten imágenes en formato jpg, jpeg, png, webp y avif', 'error');
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

        const res = await fetch('/api/images-test', {
            method: 'POST',
            body: formData,
        });


        clearInterval(interval);
        setGlobalProgress(100);

        await new Promise(resolve => setTimeout(resolve, 400));

        const data = await res.json();

        if (data.files) {

            const updatedPreviews = filePreviews.map((preview, index) => ({
                ...preview,
                convertedSizeKB: data.files[index]?.sizeKB ?? 0
            }));

            setConversionFinished(true);
            setFilePreviews(updatedPreviews);
            setUrls(data.files.map((f: any) => `data:image/${outputFormat};base64,${f.base64}`));

            Swal.fire('¡Listo!', 'Las imágenes fueron convertidas con éxito.', 'success');
        } else {
            Swal.fire('Error', 'Hubo un problema al convertir las imágenes.', 'error');
        }
    };

    const handleDownloadAllAsZip = async () => {
        if (!filesToConvert || filesToConvert.length === 0) {
            Swal.fire('¡Ups!', 'Primero debes seleccionar imágenes válidas.', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('format', outputFormat);

        Array.from(filesToConvert).forEach(file => {
            formData.append('imagenes', file); // Este campo es leído por el backend
        });

        const response = await fetch('/api/download-zip', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            Swal.fire('Error', 'No se pudo descargar el archivo ZIP.', 'error');
            return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'imagenes-convertidas.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadByUrl = (url: string, filename: string) => {

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReset = () => {
        setUrls([]);
        setFilePreviews([]);
        setOutputFormat('webp');
        setFilesToConvert(null);
        setConversionFinished(false);
        setIsDragging(false);
        setIsLoading(false);
        setGlobalProgress(0);
        dispatch(isImagesLoad(false));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };


    return (
        <div className='flex flex-col items-center justify-center'>

            {
                filePreviews.length === 0 && (
                    <FormatSelector
                        outputFormat={outputFormat}
                        setOutputFormat={setOutputFormat} />
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
                filePreviews.length === 0 ? (

                    <FileUploader
                        handleDrop={handleDrop}
                        setIsDragging={setIsDragging}
                        isDragging={isDragging}
                        fileInputRef={fileInputRef}
                    />

                ) : (
                    <SpinnerLoadImages />
                )
            }

            {
                imagesLoad && !conversionFinished && (
                    <ConvertActions 
                        handleConvert={handleConvert} 
                        handleReset={handleReset} />
                )
            }
            {
                imagesLoad && conversionFinished && (
                    <DownloadActions 
                        handleDownloadAllAsZip={handleDownloadAllAsZip} 
                        handleReset={handleReset}/>
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
                                        <p className="text-sm font-semibold text-gray-500"> Nombre: {item.file.name}</p>

                                        <p className="text-sm text-gray-500">
                                            Tamaño: {item.originalSizeKB} KB
                                        </p>
                                    </div>


                                    {isLoading && (
                                        <div className="w-3/12 mx-5">
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
                                        globalProgress === 100 && urls[index] && (
                                            <div className='flex flex-col justify-center items-center mr-2 ml-5'>
                                                <button
                                                    onClick={() => handleDownloadByUrl(urls[index], filePreviews[index].file.name.split('.')[0] + '.' + outputFormat)}
                                                    className='flex items-center justify-center cursor-pointer text-white py-0.5 px-3 mb-0.5 border rounded-lg bg-blue-600 hover:bg-blue-700'>
                                                    <span className='text-sm'>Descargar</span>
                                                    <FaDownload className="text-sm ml-1" />
                                                </button>
                                                <span className="text-green-600 text-center text-sm uppercase">
                                                    {outputFormat} | {filePreviews[index].convertedSizeKB ?? '...'} KB
                                                </span>
                                            </div>
                                        )
                                    }

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
                <div >
                    <h2 className="text-2xl mt-10 mb-6 text-center font-bold ">Imágenes convertidas:</h2>
                    <div className="flex flex-wrap justify-center">
                        {

                            urls.map((url, i) => {

                                return (
                                    <div
                                        key={i}
                                        className="relative mx-3 my-2 cursor-pointer group"
                                        onClick={() => handleDownloadByUrl(url, filePreviews[i].file.name.split('.')[0] + '.' + outputFormat)}>

                                        <img
                                            src={url}
                                            alt={`img-${i}`}
                                            className="w-40 h-40 object-cover rounded-lg border border-gray-300 
                                                    transition-transform duration-300 ease-in-out group-hover:scale-105"/>

                                        <div className="absolute top-2 right-2 bg-gray-200 bg-opacity-60 p-2 rounded-full 
                                                    transition-transform duration-300 ease-in-out group-hover:scale-110 hover:bg-gray-300">
                                            <FaDownload className="text-sm text-gray-600" />
                                        </div>
                                    </div>
                                );
                            })

                        }
                    </div>
                </div>
            )}

        </div>
    );
};

export default ImagesForm;
