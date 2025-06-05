import { FaDownload, FaTrashCan } from "react-icons/fa6";

import { ImagePreview } from "@/interfaces";

interface FilePreviewListProps{
  filePreviews: ImagePreview[];
  urls: string[];
  isLoading: boolean;
  globalProgress: number;
  outputFormat: string;
  handleDownloadByUrl: (url: string, filename: string) => void;
  handleRemoveFile: (index: number) => void;
};

export const FilePreviewList = ({
    filePreviews,
    urls,
    isLoading,
    globalProgress,
    outputFormat,
    handleDownloadByUrl,
    handleRemoveFile
}:FilePreviewListProps) => {
    return (
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
        </div>
    )
}

export default FilePreviewList