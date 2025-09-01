export default async function ValidateAndConvertFile(clientAPI) {
    

    const pageProxy = clientAPI.getPageProxy();

    try {
        const attachmentControl = pageProxy
            .getControl('FormSectionedTable')
            .getControl('uploadPdf');

        const attachments = attachmentControl.getValue();
        

        if (!attachments || attachments.length === 0) {
           
            await clientAPI.executeAction({
                Name: "/TRL_RH_SnorkelApp/Actions/AttachmnetValidation.action",
                Properties: {
                    Title: "Missing Attachment",
                    Message: "Please upload at least one valid PDF file before proceeding.",
                    OKCaption: "OK"
                }
            });
            return null;
        }

        const uploadedFiles = [];

        for (let i = 0; i < attachments.length; i++) {
            const file = attachments[i];
           

            if (!file.content || file.content.byteLength === 0) {
                console.warn(`⚠️ [ValidateAndConvertFile] File ${i + 1} is empty.`);
                await clientAPI.executeAction({
                    Name: "/TRL_RH_SnorkelApp/Actions/AttachmnetValidation.action",
                    Properties: {
                        Title: "Empty File",
                        Message: `One or more uploaded files are empty. Please remove them and try again.`,
                        OKCaption: "OK"
                    }
                });
                return null;
            }

            const base64Content = arrayBufferToBase64(file.content);
            uploadedFiles.push({
                base64: base64Content,
                name: file.urlString || 'UploadedFile.pdf',
                mimeType: file.contentType || 'application/pdf',
                size: file.content.byteLength
            });

           
        }

       
        clientAPI.getClientData().uploadedFiles = uploadedFiles;

        
        return clientAPI.executeAction({
            Name: "/TRL_RH_SnorkelApp/Actions/HeaderCreate.action"
        });
     
    } catch (error) {
        
        await clientAPI.executeAction({
            Name: "/TRL_RH_SnorkelApp/Actions/AttachmnetValidation.action",
            Properties: {
                Title: "Unexpected Error",
                Message: "An unexpected error occurred while processing the files. Please try again.",
                OKCaption: "OK"
            }
        });
        return null;
    }
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
