export default async function OpenPDF(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const binding = pageProxy.getBindingObject();
    const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';
    const readLink = binding['@odata.readLink'];

    try {
        const headerFilesResult = await clientAPI.read(service, `${readLink}/headerFiles`, [], '');
        const filesArray = headerFilesResult?._array || [];

        if (filesArray.length === 0) {
            console.warn("⚠️ No header files found.");
            return;
        }

        // console.log(`📂 Found ${filesArray.length} file(s). Opening...`);

        const windowsToUse = [];

        // Step 1: Open blank windows synchronously to avoid popup blocking
        for (let i = 0; i < filesArray.length; i++) {
            const fileWindow = window.open('', `_blank`);
            if (fileWindow) {
                windowsToUse.push(fileWindow);
            } else {
                console.warn(`⚠️ Could not open window for file ${i + 1}`);
            }
        }

        // Step 2: Now process the files and write the content into each window
        for (let i = 0; i < filesArray.length; i++) {
            const file = filesArray[i];
            const fileWindow = windowsToUse[i];

            if (!file || !file.file || !fileWindow) continue;

            const arrayBuffer = base64ToArrayBuffer(file.file);
            const blob = new Blob([arrayBuffer], { type: file.mimeType || 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            // Redirect the blank window to the PDF Blob URL
            fileWindow.location.href = blobUrl;

            // console.log(`✅ Opened: ${file.name || `Document_${i + 1}.pdf`}`);
        }

    } catch (error) {
        console.error("❌ Error in OpenPDF:", error);
    }

    function base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
}
