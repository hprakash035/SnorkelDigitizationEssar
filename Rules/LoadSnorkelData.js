import { loadSection1Data } from './loadSection1Data';
import { loadSection2Data } from './loadSection2Data';
import { loadSection3Data } from './loadSection3Data';
import { loadSection32Data } from './loadSection32Data';
import { loadSection41Data } from './loadSection41Data';
import { loadSection42Data } from './loadSection42Data';
import { loadSection51Data } from './loadSection51Data';
import { loadSection52Data } from './loadSection52Data';
import { loadSection53Data } from './loadSection53Data';
import { loadSection61Data } from './loadSection61Data';
import { loadSection62Data } from './loadSection62Data';
import { loadSection63Data } from './loadSection63Data';
import { loadSection71Data } from './loadSection71Data';
import { loadSection72Data } from './loadSection72Data';
import { loadSection81Data } from './loadSection81Data';
import { loadSection82Data } from './loadSection82Data';
import { loadSection83Data } from './loadSection83Data';
import { loadSection84Data } from './loadSection84Data';
import { loadSection91Data } from './loadSection91Data';
import { loadSection101Data } from './loadSection101Data';
import { loadSection102Data } from './loadSection102Data';
import { loadSection103Data } from './loadSection103Data';
import { loadSection111Data } from './loadSection111Data';
import { loadSection112Data } from './loadSection112Data';
import { loadSection113Data } from './loadSection113Data';
import { loadSection121Data } from './loadSection121Data';
import { loadSection122Data } from './loadSection122Data';
import { loadSection123Data } from './loadSection123Data';
import { loadSection131Data } from './loadSection131Data';
import { loadSection132Data } from './loadSection132Data';
import { loadSection133Data } from './loadSection133Data';
import { loadSection134Data } from './loadSection134Data';
import { loadSection135Data } from './loadSection135Data';
import { loadSection136Data } from './loadSection136Data';
import { loadSection141Data } from './loadSection141Data';
import { loadSection142Data } from './loadSection142Data';
import { loadSection143Data } from './loadSection143Data';
import { loadSection144Data } from './loadSection144Data';
import { loadSection145Data } from './loadSection145Data';
import { loadSection146Data } from './loadSection146Data';
import { loadSection151Data } from './loadSection151Data';
import { loadSection161Data } from './loadSection161Data';
import { loadSection162Data } from './loadSection162Data';
import { loadSection171Data } from './loadSection171Data';
import { loadSection181Data } from './loadSection181Data';
import { loadSection182Data } from './loadSection182Data';
import { loadSection183Data } from './loadSection183Data';
import { loadSection184Data } from './loadSection184Data';
import { loadSection191Data } from './loadSection191Data';
import { loadSection192Data } from './loadSection192Data';
import { loadSection193Data } from './loadSection193Data';
import { loadSection194Data } from './loadSection194Data';
import { loadSection195Data } from './loadSection195Data';


export default async function LoadSnorkelData(clientAPI) {
    try {
        clientAPI.showActivityIndicator("Loading data...");

        const pageProxy = clientAPI.getPageProxy();
        const binding = pageProxy.getBindingObject();
        const readLink = binding['@odata.readLink'];
        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        const headerSection = FormSectionedTable.getSection('HeaderSection');


        headerSection.getControl('SnorkelNo').setEditable(false);
        const headerResult = clientAPI.binding.SNORKEL_NO;

        if (headerResult) {
            FormSectionedTable.getSection('Section1Form').setVisible(true);
            headerSection.getControl('DownloadReport').setVisible(true);
            headerSection.getControl('DownloadPDF').setVisible(true);
            headerSection.getControl('GenerateEntry').setVisible(false);
        }

        const [itemsResult, headerFiles, attachmentsResult, testdata] = await Promise.all([
            clientAPI.read(service, `${readLink}/qc_ITEMS`, [], ''),
            clientAPI.read(service, `${readLink}/headerFiles`, [], ''),
            clientAPI.read(service, `${readLink}/qc_ATTACHMENTS`, [], ''),
            clientAPI.read(service, `${readLink}/qc_TESTS`, [], ''),
        ]);

        const snorkelNo = pageProxy.getClientData().snorkelNo;
        const items = itemsResult._array;
        const attachments = attachmentsResult._array;
        const attachmentGroups = groupAttachmentsByQuestion(attachments);
        const flags = { next: false };

        // Process header files
        if (headerFiles && headerFiles._array.length > 0) {
    // console.log(`📁 Found ${headerFiles._array.length} header file(s)`);

    const uploadPdfControl = FormSectionedTable.getSection('HeaderSection').getControl('uploadPdf');
    if (uploadPdfControl) {
        const fileDataArray = [];

        for (let i = 0; i < headerFiles._array.length; i++) {
            const headerFile = headerFiles._array[i];
            if (!headerFile.file) {
                // console.warn(`⚠️ Skipping file ${i + 1}: No base64 content`);
                continue;
            }

            try {
                const fileData = await processFileData(headerFile);
                fileDataArray.push(fileData);
                // console.log(`✅ Loaded header file ${i + 1}: ${headerFile.name}`);
            } catch (err) {
                // console.error(`❌ Error processing file ${i + 1}:`, err);
            }
        }

        if (fileDataArray.length > 0) {
            uploadPdfControl.setValue(fileDataArray);
            uploadPdfControl.setVisible(true);
            // console.log(`📦 Set ${fileDataArray.length} file(s) into uploadPdf control`);
        } else {
            // console.warn("⚠️ No valid files to load into uploadPdf control");
        }
    } else {
        // console.warn("❌ uploadPdf control not found");
    }
}


        const orderedSectionKeys = [
            '1.1', '2.1', '3.1', '3.2', '4.1', '4.2',
            '5.1', '5.2', '5.3', '6.1', '6.2', '6.3',
            '7.1', '7.2', '8.1', '8.2', '8.3', '8.4',
            '9.1', '10.1', '10.2', '10.3', '11.1', '11.2', '11.3', '12.1',  '12.2','12.3', '13.1', '13.2', '13.3', '13.4', '13.5', '13.6', '14.1', '14.2', '14.3',
            '14.4', '14.5','14.6', '15.1', '16.1', '16.2', '17.1', '18.1', '18.2', '18.3', '18.4', '19.1', '19.2', '19.3', '19.4', '19.5'

        ];

        for (const sectionKey of orderedSectionKeys) {
            const loader = getSectionLoader(sectionKey);
            if (!loader) {
                // console.warn(`⚠️ No loader mapped for section: ${sectionKey}`);
                continue;
            }

            const item = items.find(it => {
                const sectionKeyFromItem = it.QUESTION?.trimStart().split(' ')[0];
                return sectionKeyFromItem === sectionKey;
            });

            if (item && item.DATE_INSPECTED && item.INSPECTED_BY) {
                const question = item.QUESTION?.trim();
                const normalize = str => str?.replace(/\s+/g, ' ')?.trim();
                const matchingAttachments = attachmentGroups[normalize(question)] || [];
                

                try {
                    // console.log(`🛠️ Running loader for section ${sectionKey}...`);
                    await loader(
                        pageProxy,
                        item,
                        FormSectionedTable,
                        matchingAttachments,
                        flags,
                        testdata._array
                    );
                    // console.log(`✅ Loader for ${sectionKey} executed successfully`);
                } catch (err) {
                    // console.error(`❌ Error running loader for section ${sectionKey}:`, err);
                }
            } else {
                // console.warn(`⛔ No matching item or missing inspection data for section: ${sectionKey}`);
            }
        }

        clientAPI.dismissActivityIndicator();

    } catch (error) {
        // console.error('❌ Fatal error in LoadSnorkelData:', error);
        clientAPI.dismissActivityIndicator();
    }
}

function groupAttachmentsByQuestion(attachments = []) {
    const grouped = {};
    for (const attachment of attachments) {
        const rawKey = attachment.QUESTION || attachment.question || '';
        const key = rawKey.replace(/\s+/g, ' ').trim();
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(attachment);
    }
    return grouped;
}

function getSectionLoader(sectionKey) {
    const sectionLoaders = {
        '1.1': loadSection1Data,
        '2.1': loadSection2Data,
        '3.1': loadSection3Data,
        '3.2': loadSection32Data,
        '4.1': loadSection41Data,
        '4.2': loadSection42Data,
        '5.1': loadSection51Data,
        '5.2': loadSection52Data,
        '5.3': loadSection53Data,
        '6.1': loadSection61Data,
        '6.2': loadSection62Data,
        '6.3': loadSection63Data,
        '7.1': loadSection71Data,
        '7.2': loadSection72Data,
        '8.1': loadSection81Data,
        '8.2': loadSection82Data,
        '8.3': loadSection83Data,
        '8.4': loadSection84Data,
        '9.1': loadSection91Data,
        '10.1': loadSection101Data,
        '10.2': loadSection102Data,
        '10.3': loadSection103Data,
        '11.1': loadSection111Data,
        '11.2': loadSection112Data,
        '11.3': loadSection113Data,
        '12.1': loadSection121Data,
        '12.2': loadSection122Data,
        '12.3': loadSection123Data,
        '13.1': loadSection131Data,
        '13.2': loadSection132Data,
        '13.3': loadSection133Data,
        '13.4': loadSection134Data,
        '13.5': loadSection135Data,
        '13.6': loadSection136Data,
        '14.1': loadSection141Data,
        '14.2': loadSection142Data,
        '14.3': loadSection143Data,
        '14.4': loadSection144Data,
        '14.5': loadSection145Data,
        
        '14.6': loadSection146Data,
        '15.1': loadSection151Data,
        '16.1': loadSection161Data,
        '16.2': loadSection162Data,
        '17.1': loadSection171Data,
        '18.1': loadSection181Data,
        '18.2': loadSection182Data,
        '18.3': loadSection183Data,
        '18.4': loadSection184Data,
        '19.1': loadSection191Data,
        '19.2': loadSection192Data,
        '19.3': loadSection193Data,
        '19.4': loadSection194Data,
        '19.5': loadSection195Data,
    };

    return sectionLoaders[sectionKey];
}

async function processFileData(headerFile) {
    const base64File = headerFile.file;
    const fileName = headerFile.name;
    try {


        let cleanBase64 = base64File;
        if (base64File.startsWith('data:')) {
            cleanBase64 = base64File.split(',')[1];
        }

        const arrayBuffer = convertBase64ToArrayBuffer(cleanBase64);

        return {
            urlString: fileName,
            content: arrayBuffer,
            contentType: 'application/pdf',
            size: arrayBuffer.byteLength
        };
    } catch (error) {
        console.error('Error converting base64 to ArrayBuffer:', error);
        throw error;
    }
}

function convertBase64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
