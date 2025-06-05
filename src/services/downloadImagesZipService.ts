export const downloadImagesZipService = async (files: FileList, outputFormat: string): Promise<Blob | null> => {

  try {

    const formData = new FormData();
    formData.append('format', outputFormat);

    Array.from(files).forEach(file => {
      formData.append('imagenes', file);
    });

    const response = await fetch('/api/convert-images-zip', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('Error en la respuesta del servidor:', response.statusText);
      return null;
    }

    return await response.blob();

  } catch (error) {
    console.error('Error al descargar el ZIP:', error);
    return null;
  }
};