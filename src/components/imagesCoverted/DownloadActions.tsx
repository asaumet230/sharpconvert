import { FaSyncAlt } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";

import 'animate.css';

interface DownloadActionsProps {
    filesToConvert: FileList | null;
    handleDownloadAllAsZip: () => void;
    handleReset: () => void;
};

export const DownloadActions = ({filesToConvert, handleDownloadAllAsZip, handleReset }: DownloadActionsProps) => {
    return (
        <div className='flex flex-col sm:flex-row gap-4 justify-center w-10/12 sm:w-7/12 md:w-9/12 my-10 animate__animated animate__fadeIn'>
            <button
                className='flex justify-center items-center gap-2 cursor-pointer w-full p-3 font-semibold bg-blue-600 text-white rounded-md text-base hover:bg-blue-700 transition-colors'
                onClick={handleDownloadAllAsZip}>
                <FaDownload className="text-sm" />
                <p>{filesToConvert?.length === 1? 'Descargar imagen' : 'Descargar todas'}</p>
            </button>

            <button
                className='flex justify-center items-center gap-2 cursor-pointer w-full p-3 font-semibold bg-purple-700 text-white rounded-md text-base hover:bg-purple-800 transition-colors'
                onClick={handleReset}>
                <FaSyncAlt className="text-sm" />
                <p>Convertir más</p>
            </button>
        </div>
    )
}

export default DownloadActions;