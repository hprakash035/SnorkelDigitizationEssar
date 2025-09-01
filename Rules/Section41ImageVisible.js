/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section41ImageVisible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section41Form').getControl('Section41NextButton').setVisible(false);
    const Section41StaticImage =FormSectionedTable.getSection('Section41StaticImage');
    
    Section41StaticImage.setVisible('true');
    const Section41UserInputImage =FormSectionedTable.getSection('Section41UserInputImage');
    
    Section41UserInputImage.setVisible('true');

    return;
}
