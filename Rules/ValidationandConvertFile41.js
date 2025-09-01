/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
import Section41TestFormVisible from './Section41TestFormVisible';

export default async function ValidateAndConvertFile41(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();

    try {
        const sectionedTable = pageProxy.getControl('FormSectionedTable');

        const snorkelNo = sectionedTable
            .getSection('HeaderSection')
            ?.getControl('SnorkelNo')
            ?.getValue();

        const photoSection = sectionedTable.getSection('Section41UserInputImage');
        const photoControl = photoSection?.getControl('Section41TakePhoto');
        const attachments = photoControl?.getValue();

        const question = sectionedTable
            .getSection('Section41Form')
            .getControl('Section41Question')
            .getValue();

        // Validate attachment
        if (!attachments || attachments.length === 0 || !attachments[0].content) {
            await clientAPI.executeAction({
                Name: "/TRL_RH_SnorkelApp/Actions/AttachmnetValidation.action",
                Properties: {
                    Title: "Invalid Attachment",
                    Message: "Please upload exactly one valid file before proceeding.",
                    OKCaption: "OK"
                }
            });
            return null;
        }

        // Limit to one file
        if (attachments.length > 1) {
            photoControl.setValue([attachments[0]]); // Keep only the first

            await clientAPI.executeAction({
                Name: "/TRL_RH_SnorkelApp/Actions/AttachmnetValidation.action",
                Properties: {
                    Title: "Only One File Allowed",
                    Message: "Only one file is allowed. Extra files were removed.",
                    OKCaption: "OK"
                }
            });
            return null;
        }

        const file = attachments[0];
        const base41Content = arrayBufferToBase41(file.content);
        const uploadedFile = {
            base41: base41Content,
            name: file.urlString || 'UploadedFile.pdf',
            mimeType: file.contentType || 'application/pdf',
            size: file.content.byteLength
        };

        clientAPI.getClientData().uploadedFile = uploadedFile;

        await clientAPI.executeAction({
            Name: "/TRL_RH_SnorkelApp/Actions/AttachmentCreate.action",
            Properties: {
                Properties: {
                    question: question,
                    mimeType: uploadedFile.mimeType,
                    name: uploadedFile.name,
                    file: uploadedFile.base41,
                    size: uploadedFile.size,
                    qC_HEADER_SNORKEL_NO: snorkelNo
                }
            }
        });

        return Section41TestFormVisible(clientAPI);

    } catch (error) {
        await clientAPI.executeAction({
            Name: "/TRL_RH_SnorkelApp/Actions/AttachmnetValidation.action",
            Properties: {
                Title: "Unexpected Error",
                Message: "An unexpected error occurred while uploading the file. Please try again.",
                OKCaption: "OK"
            }
        });

        return null;
    }
}

function arrayBufferToBase41(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
