export class PDFService {
  private async getPdfParser() {
    // Dynamic import to prevent build-time execution
    const pdf = await import('pdf-parse')
    return pdf.default
  }

  async extractText(buffer: Buffer): Promise<string> {
    try {
      const pdf = await this.getPdfParser()
      const data = await pdf(buffer)
      return data.text
    } catch (error) {
      console.error('Error extracting PDF text:', error)
      throw new Error('Error al extraer texto del PDF')
    }
  }

  async extractTextWithMetadata(buffer: Buffer): Promise<{
    text: string
    pages: number
    info: any
    metadata: any
  }> {
    try {
      const pdf = await this.getPdfParser()
      const data = await pdf(buffer)
      return {
        text: data.text,
        pages: data.numpages,
        info: data.info,
        metadata: data.metadata
      }
    } catch (error) {
      console.error('Error extracting PDF with metadata:', error)
      throw new Error('Error al extraer texto del PDF')
    }
  }

  // Helper method to validate PDF buffer
  isValidPDF(buffer: Buffer): boolean {
    // Check if buffer starts with PDF signature
    const signature = buffer.toString('ascii', 0, 4)
    return signature === '%PDF'
  }

  // Helper method to get PDF size info
  getPDFInfo(buffer: Buffer): { size: number; isValid: boolean } {
    return {
      size: buffer.length,
      isValid: this.isValidPDF(buffer)
    }
  }
}

