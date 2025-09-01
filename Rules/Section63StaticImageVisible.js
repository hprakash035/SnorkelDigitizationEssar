/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section63StaticImageVisible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section62Form').getControl('Section63NextButton').setVisible(false);
    const Section63StaticImage =FormSectionedTable.getSection('Section63StaticImage');
    Section63StaticImage.setVisible('true');
    const Section63UserInputImage =FormSectionedTable.getSection('Section63UserInputImage');
    Section63UserInputImage.setVisible('true');
    
    return;
}

