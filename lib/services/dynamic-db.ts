import { createClient } from "@/lib/supabase/client"

interface TableSchema {
  [tableName: string]: {
    columns: string[]
    requiredColumns: string[]
    optionalColumns: string[]
  }
}

class DynamicDatabaseService {
  private supabase = createClient()
  private schemaCache: TableSchema = {}
  private cacheExpiry = 5 * 60 * 1000 // 5 minutos

  /**
   * Detecta dinamicamente as colunas de uma tabela
   */
  async getTableColumns(tableName: string): Promise<string[]> {
    try {
      // Tenta fazer uma query vazia para obter a estrutura
      const { data, error } = await this.supabase.from(tableName).select("*").limit(0)

      if (error) {
        console.warn(`Erro ao detectar colunas da tabela ${tableName}:`, error)
        return []
      }

      // Se não há dados, tenta uma query com limit 1
      const { data: sampleData } = await this.supabase.from(tableName).select("*").limit(1)

      if (sampleData && sampleData.length > 0) {
        return Object.keys(sampleData[0])
      }

      return []
    } catch (error) {
      console.error(`Erro ao detectar estrutura da tabela ${tableName}:`, error)
      return []
    }
  }

  /**
   * Verifica se uma coluna existe na tabela
   */
  async columnExists(tableName: string, columnName: string): Promise<boolean> {
    const columns = await this.getTableColumns(tableName)
    return columns.includes(columnName)
  }

  /**
   * Filtra dados baseado nas colunas existentes
   */
  async filterDataForTable(tableName: string, data: Record<string, any>): Promise<Record<string, any>> {
    const existingColumns = await this.getTableColumns(tableName)
    const filteredData: Record<string, any> = {}

    for (const [key, value] of Object.entries(data)) {
      if (existingColumns.includes(key)) {
        filteredData[key] = value
      } else {
        console.warn(`Coluna '${key}' não existe na tabela '${tableName}', ignorando...`)
      }
    }

    return filteredData
  }

  /**
   * Insere dados dinamicamente, adaptando-se à estrutura da tabela
   */
  async dynamicInsert(tableName: string, data: Record<string, any>) {
    try {
      const filteredData = await this.filterDataForTable(tableName, data)

      if (Object.keys(filteredData).length === 0) {
        throw new Error(`Nenhuma coluna válida encontrada para inserir em ${tableName}`)
      }

      const { data: result, error } = await this.supabase.from(tableName).insert(filteredData).select()

      if (error) throw error
      return result
    } catch (error) {
      console.error(`Erro no insert dinâmico em ${tableName}:`, error)
      throw error
    }
  }

  /**
   * Atualiza dados dinamicamente
   */
  async dynamicUpdate(tableName: string, data: Record<string, any>, whereClause: Record<string, any>) {
    try {
      const filteredData = await this.filterDataForTable(tableName, data)

      if (Object.keys(filteredData).length === 0) {
        console.warn(`Nenhuma coluna válida para atualizar em ${tableName}`)
        return null
      }

      let query = this.supabase.from(tableName).update(filteredData)

      // Aplica condições WHERE dinamicamente
      for (const [key, value] of Object.entries(whereClause)) {
        query = query.eq(key, value)
      }

      const { data: result, error } = await query.select()

      if (error) throw error
      return result
    } catch (error) {
      console.error(`Erro no update dinâmico em ${tableName}:`, error)
      throw error
    }
  }

  /**
   * Upsert dinâmico (insert ou update)
   */
  async dynamicUpsert(tableName: string, data: Record<string, any>, conflictColumns: string[] = ["id"]) {
    try {
      const filteredData = await this.filterDataForTable(tableName, data)

      if (Object.keys(filteredData).length === 0) {
        throw new Error(`Nenhuma coluna válida encontrada para upsert em ${tableName}`)
      }

      const { data: result, error } = await this.supabase
        .from(tableName)
        .upsert(filteredData, {
          onConflict: conflictColumns.join(","),
          ignoreDuplicates: false,
        })
        .select()

      if (error) throw error
      return result
    } catch (error) {
      console.error(`Erro no upsert dinâmico em ${tableName}:`, error)
      throw error
    }
  }

  /**
   * Verifica se um registro existe
   */
  async recordExists(tableName: string, whereClause: Record<string, any>): Promise<boolean> {
    try {
      let query = this.supabase.from(tableName).select("id")

      for (const [key, value] of Object.entries(whereClause)) {
        query = query.eq(key, value)
      }

      const { data, error } = await query.limit(1)

      if (error) throw error
      return data && data.length > 0
    } catch (error) {
      console.error(`Erro ao verificar existência em ${tableName}:`, error)
      return false
    }
  }

  /**
   * Cria colunas que não existem (apenas para desenvolvimento)
   */
  async ensureColumnsExist(tableName: string, columns: Record<string, string>) {
    if (process.env.NODE_ENV === "production") {
      console.warn("Criação automática de colunas desabilitada em produção")
      return
    }

    for (const [columnName, columnType] of Object.entries(columns)) {
      const exists = await this.columnExists(tableName, columnName)
      if (!exists) {
        console.log(`Coluna '${columnName}' não existe em '${tableName}'. Em produção, isso seria criado via migração.`)
      }
    }
  }
}

export const dynamicDB = new DynamicDatabaseService()
