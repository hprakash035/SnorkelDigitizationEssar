import ValidateAndConvertFile from './ValidateAndConvertFile';

export default async function CreateFilesAfterHeader(clientAPI) {
    const header = clientAPI.getActionResult("HeaderCreate")?.data;

    if (!header || !header.SNORKEL_NO || !header.CUSTOMER_NAME) {
        return clientAPI.executeAction({
            Name: "/TRL_RH_SnorkelApp/Actions/ErrorMessage.action",
            Properties: {
                Message: "Failed to retrieve generated SNORKEL_NO."
            }
        });
    }

    const fileData = await ValidateAndConvertFile(clientAPI);

    if (!fileData) {
        return;
    }

    const relatedFile = {
        name: fileData.name,
        mimeType: fileData.mimeType,
        file: fileData.base64,
        size: fileData.size,
        SNORKEL_NO: header.SNORKEL_NO,
        CUSTOMER_NAME: header.CUSTOMER_NAME
    };

    await clientAPI.executeAction({
        Name: "/TRL_RH_SnorkelApp/Actions/CreateQCHeaderFile.action",
        Properties: {
            Properties: relatedFile
        }
    });

    return clientAPI.executeAction({
        Name: "/TRL_RH_SnorkelApp/Actions/ShowSnorkelToast.action"
    });
}
