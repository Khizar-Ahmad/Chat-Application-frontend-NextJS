// progress is tracked via XMLHttpRequest because axios and fetch
// both support upload progress via XHR onprogress event

export const uploadFileWithProgress = (
    file:           File,
    caption:        string,
    sender:         number,
    receiver:       number,
    token:          string,
    onProgress:     (percent: number) => void,
    onComplete:     (data: any) => void,
    onError:        (error: string) => void
): void => {

    const formData = new FormData()
    formData.append("file",     file)
    formData.append("sender",   String(sender))
    formData.append("receiver", String(receiver))
    if (caption.trim()) {
        formData.append("caption", caption.trim())
    }

    const xhr = new XMLHttpRequest()

    // track upload progress
    xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100)
            onProgress(percent)
        }
    }

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const data = JSON.parse(xhr.responseText)
                onComplete(data)
            } catch {
                onError("Invalid server response")
            }
        } else {
            try {
                const err = JSON.parse(xhr.responseText)
                onError(err.detail || "Upload failed")
            } catch {
                onError("Upload failed")
            }
        }
    }

    xhr.onerror = () => onError("Network error during upload")

    xhr.open("POST", `${process.env.NEXT_PUBLIC_BASE_URL}upload`)
    xhr.setRequestHeader("Authorization", `Bearer ${token}`)
    xhr.send(formData)
}