import { PrismaClient } from '@prisma/client';

export class DatasourceService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async queryDatasource(datasourceId: string, query: string, context: any) {
    try {
      // Get the datasource
      const datasource = await this.prisma.datasource.findUnique({
        where: { id: datasourceId },
        include: { rows: true }
      });

      if (!datasource) {
        throw new Error(`Datasource ${datasourceId} not found`);
      }

      // Simple query implementation - in production you'd want more sophisticated querying
      const rows = datasource.rows || [];
      
      // Filter rows based on query (simplified)
      if (query && query.trim()) {
        // Basic text search across all fields
        const searchTerm = query.toLowerCase();
        return rows.filter(row => 
          Object.values(row.data).some(value => 
            String(value).toLowerCase().includes(searchTerm)
          )
        );
      }

      return rows;
    } catch (error) {
      console.error('Error querying datasource:', error);
      throw error;
    }
  }

  async getDatasourceMetadata(datasourceId: string) {
    try {
      const datasource = await this.prisma.datasource.findUnique({
        where: { id: datasourceId }
      });

      if (!datasource) {
        throw new Error(`Datasource ${datasourceId} not found`);
      }

      return {
        id: datasource.id,
        name: datasource.name,
        type: datasource.type,
        status: datasource.status,
        rowCount: datasource.rowCount,
        createdAt: datasource.createdAt
      };
    } catch (error) {
      console.error('Error getting datasource metadata:', error);
      throw error;
    }
  }
}
