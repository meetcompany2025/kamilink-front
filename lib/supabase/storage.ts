import { createClient } from "./client"
import { v4 as uuidv4 } from "uuid"

// Definição de tipos para os arquivos
export interface FileUploadResult {
  path: string
  name: string
  size: number
  type: string
  url: string
}

/**
 * Faz upload de um arquivo para o Supabase Storage
 */
export async function uploadFile(
  file: File,
  bucket = "freight-attachments",
  folder = "cargo-images",
): Promise<FileUploadResult> {
  const supabase = createClient()

  // Gera um nome único para o arquivo para evitar colisões
  const fileExt = file.name.split(".").pop()
  const fileName = `${uuidv4()}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  // Faz o upload do arquivo
  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    throw new Error(`Erro ao fazer upload: ${error.message}`)
  }

  // Obtém a URL pública do arquivo
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath)

  return {
    path: data.path,
    name: file.name,
    size: file.size,
    type: file.type,
    url: urlData.publicUrl,
  }
}

/**
 * Exclui um arquivo do Supabase Storage
 */
export async function deleteFile(path: string, bucket = "freight-attachments"): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    throw new Error(`Erro ao excluir arquivo: ${error.message}`)
  }
}

/**
 * Verifica se o arquivo é válido (tipo e tamanho)
 */
export function validateFile(file: File): { valid: boolean; message?: string } {
  // Verifica o tamanho do arquivo (máximo 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB em bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      message: `O arquivo excede o tamanho máximo de 10MB (tamanho atual: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`,
    }
  }

  // Verifica o tipo do arquivo
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"]

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: "Tipo de arquivo não permitido. Use apenas JPG, PNG ou PDF.",
    }
  }

  return { valid: true }
}
