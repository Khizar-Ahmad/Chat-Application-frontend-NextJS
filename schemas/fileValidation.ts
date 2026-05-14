import * as Yup from "yup"

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp"
]

const ALLOWED_VIDEO_TYPES = [
    "video/mp4",
    "video/quicktime",
    "video/webm",
    "video/x-msvideo"
]

const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]

const MAX_IMAGE_SIZE = 10 * 1024 * 1024   // 10MB
const MAX_VIDEO_SIZE = 30 * 1024 * 1024   // 30MB

export const fileSchema = Yup.object({
    file: Yup.mixed<File>()
        .required("Please select a file")
        .test(
            "fileType",
            "Only JPEG, PNG, GIF, WEBP images and MP4, MOV, WEBM videos are allowed",
            (value) => {
                if (!value) return true
                return ALLOWED_TYPES.includes((value as File).type)
            }
        )
        .test(
            "fileSize",
            "File is too large",
            (value) => {
                if (!value) return true
                const file = value as File
                if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
                    return file.size <= MAX_IMAGE_SIZE
                }
                return file.size <= MAX_VIDEO_SIZE
            }
        ),
    caption: Yup.string().max(500, "Caption too long").optional()
})

export const validateFile = async (file: File): Promise<string | null> => {
    try {
        await fileSchema.validate({ file })
        return null
    } catch (err: any) {
        return err.message
    }
}

export const getFileType = (file: File): "image" | "video" | null => {
    if (ALLOWED_IMAGE_TYPES.includes(file.type)) return "image"
    if (ALLOWED_VIDEO_TYPES.includes(file.type)) return "video"
    return null
}