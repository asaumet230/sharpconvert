'use client'

import { useRef, useState } from 'react';

import Swal from 'sweetalert2';

import { UploadProgressOverlay } from '..';

import {
    ConvertActions,
    ConvertedImageGallery,
    DownloadActions,
    FilePreviewList,
    FileUploader,
    FormatSelector,
    EmptyFileNotice
} from '.';

import { useAppDispatch, useAppSelector } from '@/store';
import { isImagesLoad } from '@/store/imageComponentsLoad/imagesComponentsLoad';

import { ConvertedImage, ImagePreview } from '@/interfaces';
import { triggerBlobDownload } from '@/helpers';
import { convertImagesService, downloadImagesZipService } from '@/services';

export const ImagesForm = () => {

    const [conversionFinished, setConversionFinished] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [globalProgress, setGlobalProgress] = useState(0);

    const [outputFormat, setOutputFormat] = useState('webp');
    const [urls, setUrls] = useState<string[]>([]);

    const [filePreviews, setFilePreviews] = useState<ImagePreview[]>([]);
    const [filesToConvert, setFilesToConvert] = useState<FileList | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();
    const imagesLoad = useAppSelector(state => state.imagesComponentsLoad.isImagesLoad);

    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/avif',
    ];

    const validateAndStoreFiles = (files: FileList | null) => {

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

        const result = await convertImagesService(filesToConvert, outputFormat);

        clearInterval(interval);
        setGlobalProgress(100);
        await new Promise(resolve => setTimeout(resolve, 400));

        if (result && result.files) {
            const updatedPreviews = filePreviews.map((preview, index) => ({
                ...preview,
                convertedSizeKB: result.files[index]?.sizeKB ?? 0
            }));

            setConversionFinished(true);
            setFilePreviews(updatedPreviews);
            setUrls(
                result.files.map((f: ConvertedImage) =>
                    `data:image/${outputFormat};base64,${f.base64}`
                )
            );

            filesToConvert.length === 1 ? Swal.fire('¡Listo!', 'La imagen fue convertida con éxito.', 'success') : Swal.fire('¡Listo!', 'Las imágenes fueron convertidas con éxito.', 'success') 
            
        } else {
            Swal.fire('Error', 'Hubo un problema al convertir las imágenes.', 'error');
        }
    };

    const handleDownloadAllAsZip = async () => {

        if (!filesToConvert || filesToConvert.length === 0) {
            Swal.fire('¡Ups!', 'Primero debes seleccionar imágenes válidas.', 'warning');
            return;
        }

        const blob = await downloadImagesZipService(filesToConvert, outputFormat);

        if (!blob) {
            Swal.fire('Error', 'No se pudo descargar el archivo ZIP.', 'error');
            return;
        }

        triggerBlobDownload(blob, 'imagenes-convertidas.zip');
    };

    const handleDownloadByUrl = (url: string, filename: string) => {

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleRemoveFile = (index: number) => {

        const updated = [...filePreviews];

        updated.splice(index, 1);
        setFilePreviews(updated);

        const updatedFiles = new DataTransfer();
        updated.forEach(p => updatedFiles.items.add(p.file));
        setFilesToConvert(updatedFiles.files);
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
                onChange={(e) => validateAndStoreFiles(e.target.files)}
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
                    <UploadProgressOverlay filesToConvert={filesToConvert} />
                )
            }

            {
                imagesLoad && !conversionFinished && (
                    <ConvertActions
                        filesToConvert={filesToConvert}
                        handleConvert={handleConvert}
                        handleReset={handleReset} />
                )
            }
            {
                imagesLoad && conversionFinished && (
                    <DownloadActions
                        filesToConvert={filesToConvert}
                        handleDownloadAllAsZip={handleDownloadAllAsZip}
                        handleReset={handleReset} />
                )
            }

            {
                imagesLoad && (
                    <FilePreviewList
                        filePreviews={filePreviews}
                        urls={urls}
                        isLoading={isLoading}
                        globalProgress={globalProgress}
                        outputFormat={outputFormat}
                        handleDownloadByUrl={handleDownloadByUrl}
                        handleRemoveFile={handleRemoveFile} />
                )
            }

            {
                filePreviews.length === 0 && (<EmptyFileNotice noticeText='No has seleccionado ningún archivo. Puedes convertir hasta 20 imágenes por carga.' />)
            }

            {urls.length > 0 && (
                <ConvertedImageGallery
                    urls={urls}
                    filePreviews={filePreviews}
                    outputFormat={outputFormat}
                    handleDownloadByUrl={handleDownloadByUrl} />
            )
            }

        </div>
    );
};

export default ImagesForm;
