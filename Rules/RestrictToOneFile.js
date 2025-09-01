/**
 * Restrict to one file and show dynamic alert if exceeded
 * @param {IClientAPI} clientAPI
 */
export default function RestrictToOneFile(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const attachmentControl = pageProxy.getControl('FormSectionedTable').getControl('uploadPdf');
    const attachments = attachmentControl.getValue();


    if (attachments && attachments.length > 1) {
      
        const singleAttachment = [attachments[0]];
        attachmentControl.setValue(singleAttachment);

        return clientAPI.executeAction({
            "Name": "/TRL_RH_SnorkelApp/Actions/AttachmnetValidation.action",
            "Properties": {
                "Title": "Attachment Limit",
                "Message": "Only one attachment is allowed.",
                "OKCaption": "OK"
            }
        });
    }

    return Promise.resolve();
}
