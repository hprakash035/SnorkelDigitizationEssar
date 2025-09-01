export default async function DownloadPDF(clientAPI) {
    try {
        console.log('🚀 Starting PDF download...');

        const result = clientAPI.getActionResult('DownloadPDF');
        console.log('📦 Action result:', result);

        const base64Content = result.data.content;
        const filename = result.data.filename || 'Report.pdf';
        const mimeType = result.data.mimeType || 'application/pdf';

        if (!base64Content) {
            throw new Error('No PDF content received from backend.');
        }

        

    } catch (error) {
        console.error('❌ Error during PDF download or open:', error);
    }
}
