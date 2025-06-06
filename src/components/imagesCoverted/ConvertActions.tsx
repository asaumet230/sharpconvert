import { FaBroom, FaSyncAlt } from "react-icons/fa";

import 'animate.css';

interface ConvertActionsProps {
    filesToConvert: FileList | null;
    handleConvert: () => void;
    handleReset: () => void;
}

export const ConvertActions = ({filesToConvert, handleConvert, handleReset}: ConvertActionsProps) => {

    return (
        <div className='flex flex-col sm:flex-row gap-4 justify-center w-10/12 sm:w-7/12 md:w-9/12 my-10 animate__animated animate__fadeIn'>
            <button
                className='flex justify-center items-center gap-2  cursor-pointer w-full p-3 font-semibold bg-yellow-400 text-black rounded-md text-base hover:bg-yellow-500 transition-colors'
                onClick={handleConvert}>
                <FaSyncAlt className="text-sm" />
                <p>{filesToConvert?.length === 1? 'Convertir imagen' : 'Convertir imágenes'}</p>
            </button>

            <button
                className='flex justify-center items-center gap-2 cursor-pointer w-full p-3 font-semibold bg-green-700 text-white rounded-md text-base hover:bg-green-800 transition-colors'
                onClick={handleReset}>
                <FaBroom className="text-sm" />
                Limpiar
            </button>
        </div>
    )
}

export default ConvertActions;