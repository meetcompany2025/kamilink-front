"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DocumentUploadCard = ({ user }: { user: any }) => {
  const router = useRouter()
  const [documentType, setDocumentType] = useState(user?.document_type || "")
  const [fileFront, setFileFront] = useState<File | null>(null)
  const [fileBack, setFileBack] = useState<File | null>(null)
  const [singleFile, setSingleFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [uploadProgress, setUploadProgress] = useState(0)

  const isUploading = uploadStatus === "uploading"

  const handleUpload = async () => {
    setUploadStatus("uploading")
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("document_type", documentType)

      if (documentType === "BI") {
        if (fileFront) formData.append("file_front", fileFront)
        if (fileBack) formData.append("file_back", fileBack)
      } else if (singleFile) {
        formData.append("file", singleFile)
      }

      // Simular upload
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setUploadStatus("success")
            setTimeout(() => {
              router.push(values.uploadDocument ? "/upload-documents" : "/login")
            }, 2000)
          }
          return prev + 10
        })
      }, 150)

    } catch (error) {
      setUploadStatus("error")
    }
  }

  const renderFileInput = (id: string, label: string, file: File | null, setFile: (f: File | null) => void) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <label
        htmlFor={id}
        className="cursor-pointer border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center transition hover:bg-muted/30"
      >
        {file ? (
          <div className="text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={(e) => {
              e.stopPropagation()
              setFile(null)
            }}>
              Remover
            </Button>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">Clique para selecionar ou arraste o arquivo</p>
            <p className="text-xs text-muted-foreground mt-1">Suporta PDF, JPG ou PNG (máx. 5MB)</p>
          </>
        )}
      </label>
      <Input
        id={id}
        type="file"
        className="hidden"
        onChange={(e) => {
          const selected = e.target.files?.[0] || null
          setFile(selected)
        }}
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </div>
  )

  return (
    <div className="max-w-md mx-auto my-10 ">
  <Card>
    <CardHeader>
      <CardTitle>Envio de Documentos</CardTitle>
      <CardDescription>Envie uma cópia do seu documento para verificação da sua conta</CardDescription>
    </CardHeader>

    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="document-type">Tipo de Documento</Label>

        <Select value={documentType} onValueChange={setDocumentType}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar documento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Passaporte">Passaporte</SelectItem>
            <SelectItem value="BI">BI</SelectItem>
            <SelectItem value="NIF">NIF</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {documentType === "BI" ? (
        <>
          {renderFileInput("file-front", "Documento - Frente", fileFront, setFileFront)}
          {renderFileInput("file-back", "Documento - Verso", fileBack, setFileBack)}
        </>
      ) : (
        renderFileInput("single-file", "Enviar Documento", singleFile, setSingleFile)
      )}

      {uploadStatus === "uploading" && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Enviando...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {uploadStatus === "success" && (
        <div className="flex items-center p-3 rounded-md bg-green-50 text-green-700 border border-green-200">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span className="text-sm">Documento enviado com sucesso!</span>
        </div>
      )}

      {uploadStatus === "error" && (
        <div className="flex items-center p-3 rounded-md bg-red-50 text-red-700 border border-red-200">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span className="text-sm">Erro ao enviar documento. Tente novamente.</span>
        </div>
      )}
    </CardContent>

    <CardFooter className="flex justify-between">
      <Button variant="outline" onClick={() => router.push("/dashboard")}>
        Pular por agora
      </Button>
      <Button
        onClick={handleUpload}
        disabled={
          isUploading ||
          uploadStatus === "success" ||
          (documentType === "BI" ? !fileFront || !fileBack : !singleFile)
        }
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar Documento"
        )}
      </Button>
    </CardFooter>
  </Card>
</div>

  )
}

export default DocumentUploadCard
