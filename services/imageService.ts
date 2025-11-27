// services/imageService.ts
import api from "./api"

export const ImageService = {
  /**
   * Busca a URL de visualização de uma imagem
   */
  async getImageUrl(imageId: string): Promise<string> {
    // Se estiver usando signed URLs no backend
    const res = await api.get(`/uploads/${imageId}/view`)
    // Ou se quiser a URL direta:
    // return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${imageId}/view`
    return res.data.url || `${process.env.NEXT_PUBLIC_API_URL}/uploads/${imageId}/view`
  },

  /**
   * Busca a imagem de perfil do usuário
   */
  async getProfileImage(userId: string): Promise<string | null> {
    try {
      const res = await api.get(`/uploads/user/${userId}`)
      const images = res.data || []
      
      // Encontra a imagem de perfil
      const profileImage = images.find((img: any) => img.type === 'PROFILE_IMAGE')
      return profileImage ? this.getImageUrl(profileImage.id) : null
    } catch (error) {
      console.error('Erro ao buscar imagem de perfil:', error)
      return null
    }
  },

   /**
   * Upload ou substitui a foto de perfil do usuário
   */
  async uploadProfileImage(file: File): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)

    const res = await api.post('/uploads/profile-image', formData, { 
      noJson: true 
    })
    
    return res.data
  }

}

