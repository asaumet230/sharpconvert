import { ConvertedImageResponse } from "@/interfaces";

export const convertImagesService = async ( files: FileList, outputFormat: string ): Promise<ConvertedImageResponse | null> => {
    
    try {
        const formData = new FormData();
        formData.append('format', outputFormat);

        Array.from(files).forEach(file => {
            formData.append('imagenes', file);
        });

        const res = await fetch('/api/convert-images', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) return null;

        return await res.json();

    } catch (error) {
        console.error('Error al convertir imágenes:', error);
        return null;
    }
};
