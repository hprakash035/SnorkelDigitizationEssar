export default async function Section1Visible(clientAPI) {
    

    try {
        const snorkelNo = clientAPI.evaluateTargetPath('#ActionResults:HeaderCreate/data/SNORKEL_NO');
       

        if (!snorkelNo) {
          
            return;
        }

        const fileDataArray = clientAPI.getClientData().uploadedFiles;
      

        if (!fileDataArray || fileDataArray.length === 0) {
          
            return;
        }

        const pageProxy = clientAPI.getPageProxy();
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');

    
        FormSectionedTable.getSection('Section1Form').setVisible(true);

        const headerSection = FormSectionedTable.getSection('HeaderSection');
        headerSection.getControl('DownloadPDF').setVisible(true);
        headerSection.getControl('GenerateEntry').setVisible(false);
        headerSection.getControl('SnorkelNo').setValue(snorkelNo);
        headerSection.getControl('SnorkelNo').setEditable(false);

      

        for (let i = 0; i < fileDataArray.length; i++) {
            const file = fileDataArray[i];
            

            await clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/CreateFilesHeader.action',
                Properties: {
                    Properties: {
                        SNORKEL_NO: snorkelNo,
                        name: file.name,
                        mimeType: file.mimeType,
                        file: file.base64
                    }
                }
            });

          
        }

        await clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ShowSnorkelToast.action',
            Properties: {
                Message: `Snorkel No: ${snorkelNo} - ${fileDataArray.length} file(s) uploaded`
            }
        });

       

    } catch (error) {
        console.error("💥 [Section1Visible] Error occurred:", error);
    }
}
