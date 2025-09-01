import ValidateAndConvertFile from './ValidateAndConvertFile';

export default function CreateHeaderAndUploadFile(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();

    const attachmentControl = pageProxy.getControl('FormSectionedTable').getControl('uploadPdf');
    const attachments = attachmentControl.getValue();

    if (!attachments || attachments.length === 0 || !attachments[0].content || attachments[0].content.byteLength === 0) {
        return showMessage(clientAPI, 'Missing or Empty Attachment', 'Please upload a valid file before proceeding.');
    }

    const file = attachments[0];
    const base64Content = arrayBufferToBase64(file.content);
    const fileName = file.urlString || 'UploadedFile.pdf';
    const mimeType = file.contentType || 'application/pdf';
    const fileSize = file.content.byteLength;

    const customerName = pageProxy.getControl('Company').getValue();
    const type = pageProxy.getControl('TypeList').getValue();
    const prodNo = pageProxy.getControl('ProductionNo').getValue();

    const headerPayload = {
        CUSTOMER_NAME: customerName,
        TYPE: type,
        PRODUCTION_NO: prodNo,
        DRAFT_FLAG: true
    };

    return clientAPI.createEntity('/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service', 'QC_HEADER', headerPayload)
        .then(result => {
            const readLink = result.readLink;
            if (!readLink) {
                throw new Error('Missing readLink in QC_HEADER response.');
            }

            return clientAPI.read('/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service', readLink, [], '');
        })
        .then(entity => {
            const snorkelNo = entity.SNORKEL_NO;
            if (!snorkelNo) {
                throw new Error('SNORKEL_NO missing in QC_HEADER entity.');
            }

            const filePayload = {
                name: fileName,
                mimeType: mimeType,
                file: base64Content,
                size: fileSize,
                SNORKEL_NO: snorkelNo,
                CUSTOMER_NAME: customerName
            };

            return clientAPI.createEntity('/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service', 'QC_HEADER_FILES', filePayload);
        })
        .then(() => {
            return clientAPI.executeAction('/TRL_RH_SnorkelApp/Actions/CreateEntitySuccessMessage.action');
        })
        .catch(error => {
            return clientAPI.executeAction({
                "Name": "/TRL_RH_SnorkelApp/Actions/CreateEntityFailureMessage.action",
                "Properties": {
                    "Message": error.message || 'An unexpected error occurred.'
                }
            });
        });
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function showMessage(clientAPI, title, message) {
    return clientAPI.executeAction({
        "Name": "/TRL_RH_SnorkelApp/Actions/AttachmnetValidation.action",
        "Properties": {
            "Title": title,
            "Message": message,
            "OKCaption": "OK"
        }
    });
}
