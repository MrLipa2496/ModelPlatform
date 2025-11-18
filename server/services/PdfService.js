const pdf = require('html-pdf-node');
const ejs = require('ejs');
const path = require('path');

class PdfService {
  async generatePdf (templateName, data) {
    try {
      const templatePath = path.join(
        __dirname,
        '../templates',
        `${templateName}.ejs`
      );

      const htmlContent = await ejs.renderFile(templatePath, data);

      const file = { content: htmlContent };
      const options = {
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', bottom: '20px' },
      };

      return await pdf.generatePdf(file, options);
    } catch (error) {
      console.error('PdfService Error:', error);
      throw new Error('Failed to generate PDF');
    }
  }
}

module.exports = new PdfService();
