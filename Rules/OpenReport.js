/**
 * Opens a generated report in a new browser tab.
 * @param {IClientAPI} clientAPI
 */
export default function OpenReport(clientAPI) {
    try {
        const clientData = clientAPI.getClientData();
        const actionResults = clientData.actionResults;
        const actionResult = actionResults?.callGeneratePdFFunction?.data;

        if (!actionResult || !actionResult.content) {
            throw new Error("PDF content not found in action results.");
        }

        let base64Data = actionResult.content;
        const fileName = actionResult.filename || "document.pdf";
        const mimeType = actionResult.mimeType || "application/pdf";

        // Remove any header if it exists
        if (base64Data.startsWith("data:")) {
            base64Data = base64Data.split(",")[1];
        }

        // Clean Base64: remove line breaks / spaces
        base64Data = base64Data.replace(/[\r\n]+/g, "").trim();

        function base64ToArrayBuffer(base64) {
            base64 = base64.replace(/-/g, "+").replace(/_/g, "/");
            while (base64.length % 4) {
                base64 += "=";
            }

            const binaryString = atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        }

        const arrayBuffer = base64ToArrayBuffer(base64Data);
        const blob = new Blob([arrayBuffer], { type: mimeType });

        // Create a temporary object URL and open in new tab
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");

    } catch (error) {
        // Optional: handle error (e.g., display to user)
    }
}
