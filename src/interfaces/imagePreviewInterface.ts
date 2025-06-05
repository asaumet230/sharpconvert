export interface ImagePreview {
    file: File;
    url: string;
    originalSizeKB: number;
    convertedSizeKB?: number;
    progress: number;
}
