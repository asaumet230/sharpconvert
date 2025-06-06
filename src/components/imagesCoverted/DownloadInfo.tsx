import { FaDownload } from "react-icons/fa6"

import { ImagePreview } from "@/interfaces";

import 'animate.css';

interface DownloadInfoProps {
    urls: string[];
    filePreviews: ImagePreview[];
    index: number;
    outputFormat: string;
    handleDownloadByUrl: (url: string, filename: string) => void;
}

export const DownloadInfo = ({
    urls,
    filePreviews,
    index,
    outputFormat, handleDownloadByUrl
}: DownloadInfoProps) => {

    return (
        <div className='flex flex-col justify-center items-center animate__animated animate__fadeIn'>
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

export default DownloadInfo;