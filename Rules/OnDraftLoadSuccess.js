/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function OnDraftLoadSuccess(clientAPI) {
 
 






    const pageProxy = clientAPI.getPageProxy();
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        const Section1Form = FormSectionedTable.getSection('Section1Form');
        const headerSection = FormSectionedTable.getSection('HeaderSection');
        
        
       
       
      const SnorkelNo=  headerSection.getControl('SnorkelNo').getValue();
      
        if(SnorkelNo){
            const headerSection = FormSectionedTable.getSection('HeaderSection');
            headerSection.getControl('GenerateEntry').setVisible(false);
        }

       
       // headerSection.getControl('SnorkelNo').setValue(snorkelNo);
}
