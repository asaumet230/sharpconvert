import { PreviewProgressBar } from "../ui";
import { DownloadInfo, RemoveFileButton } from ".";

import { ImagePreview } from "@/interfaces";

import 'animate.css';

interface FilePreviewListProps {
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
}: FilePreviewListProps) => {
    return (
        <div className="w-full max-w-3xl mt-6 space-y-4 animate__animated animate__fadeIn">
            {
                filePreviews.map((item, index) => (

                    <div key={index} className="flex items-center justify-between bg-gray-50 border border-gray-300 p-2 rounded-lg shadow-md ">

                        <img src={item.url} alt={item.file.name} className="w-12 h-12 object-cover rounded-lg mr-2 sm:mr-4 border border-gray-300" />

                        <div className="flex-1 text-left space-y-1">
                            <p className="text-sm font-semibold text-gray-500"> Nombre: {item.file.name}</p>

                            <p className="text-sm text-gray-500">
                                Tamaño: {item.originalSizeKB} KB
                            </p>
                        </div>


                        <div className={`flex flex-col items-center justify-center ${!isLoading && 'hidden'} w-6/12 sm:flex-row`}>
                            { isLoading && (<PreviewProgressBar globalProgress={globalProgress} />)}

                            {
                                globalProgress === 100 && urls[index] && (
                                    <DownloadInfo
                                        urls={urls}
                                        filePreviews={filePreviews}
                                        index={index}
                                        outputFormat={outputFormat}
                                        handleDownloadByUrl={handleDownloadByUrl}
                                    />
                                )
                            }
                        </div>


                        {
                            !isLoading && (
                                <RemoveFileButton
                                    index={index}
                                    handleRemoveFile={handleRemoveFile} />
                            )
                        }

                    </div>
                ))}
        </div>
    )
}

export default FilePreviewList