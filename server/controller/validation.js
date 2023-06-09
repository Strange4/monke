import { z } from 'zod';

// List of acceptable image types
const IMG_MIME_TYPES = ["image/jpg", "image/png", "image/webp", "image/jpeg"];

// Constant value for filesize check
const MAX_FILESIZE = 500000;

/**
 * Validation for the image file when receiving from the Post method.
 */
export const ImgParser = z.object({
    mimetype: z.string().refine((mime) => IMG_MIME_TYPES.includes(mime), 'invalid image type'),
    size: z.number().max(MAX_FILESIZE)
});