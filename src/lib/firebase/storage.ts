import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"
import { getStorageInstance } from "./config"

export async function uploadPhoto(
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  // リサイズ
  const resizedFile = await resizeImage(file, 1200)
  const fileName = `${Date.now()}_${file.name}`
  const storageRef = ref(getStorageInstance(), `users/${userId}/photos/${fileName}`)

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, resizedFile)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        onProgress?.(progress)
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(url)
      }
    )
  })
}

export async function deletePhoto(userId: string, fileName: string) {
  const storageRef = ref(getStorageInstance(), `users/${userId}/photos/${fileName}`)
  await deleteObject(storageRef)
}

async function resizeImage(file: File, maxWidth: number): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement("canvas")
      let { width, height } = img

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => resolve(blob!),
        "image/jpeg",
        0.85
      )
    }
    img.src = url
  })
}
