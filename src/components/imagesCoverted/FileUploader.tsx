import { RefObject } from "react";

import Image from "next/image";

import { FaUpload } from "react-icons/fa6";

interface FileUploaderProps {
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    setIsDragging: (dragging: boolean) => void;
    isDragging: boolean;
    fileInputRef: RefObject<HTMLInputElement | null>;
}

export const FileUploader = ({
    handleDrop,
    setIsDragging,
    isDragging,
    fileInputRef
}: FileUploaderProps) => {

    return (
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
    )
}

export default FileUploader;