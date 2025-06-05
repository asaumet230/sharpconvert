import { FaDownload } from "react-icons/fa6";

import { ImagePreview } from "@/interfaces";

import 'animate.css';

interface ConvertedImageGalleryProps {
    urls: string[];
    filePreviews: ImagePreview[];
    outputFormat: string;
    handleDownloadByUrl: (url: string, filename: string) => void;
};

export const ConvertedImageGallery = ({
    urls,
    filePreviews,
    outputFormat,
    handleDownloadByUrl
}: ConvertedImageGalleryProps) => {
    return (
        <div className="animate__animated animate__fadeIn" >
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
    )
}

export default ConvertedImageGallery