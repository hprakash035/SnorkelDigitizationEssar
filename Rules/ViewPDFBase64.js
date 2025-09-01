export default async function ViewPDFBase64(clientAPI) {
    try {
        const result = await clientAPI.executeAction({
            "_Type": "Action.Type.ODataService.CallFunction",
            "ActionResult": { "_Name": "callGeneratePdFFunction" },
            "Target": {
                "Service": "/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service",
                "Function": {
                    "Name": "generateQCReport",
                    "Parameters": {
                        "SNORKEL_NO": clientAPI.evaluateTargetPath('#Page:SnorkelInstallation/#Control:SnorkelNo/#Value')
                    }
                }
            }
        });

        const base64PDF = result.data?.pdfBase64; // adjust this path based on actual return key
        const snorkelNo = result.data?.snorkelNo || 'QC_Report'; // fallback name if needed

        if (!base64PDF) {
            throw new Error('PDF content not found in response');
        }

        await clientAPI.executeAction({
            "_Type": "Action.Type.OpenDocument",
            "Document": {
                "Name": `QC_Report_${snorkelNo}.pdf`,
                "Content": base64PDF,
                "ContentType": "application/pdf",
                "Encoding": "Base64"
            }
        });

    } catch (err) {
        console.error('PDF generation error:', err);
        await clientAPI.executeAction({
            "_Type": "Action.Type.Message",
            "Properties": {
                "Title": "Error",
                "Message": "Failed to generate or open PDF report."
            }
        });
    }
}
