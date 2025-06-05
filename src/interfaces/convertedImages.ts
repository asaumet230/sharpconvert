export interface ConvertedImage {
  base64: string;
  sizeKB: number;
}

export interface ConvertedImageResponse {
  files: ConvertedImage[];
}