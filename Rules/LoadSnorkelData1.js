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

export default async function LoadSnorkelDataPage1(clientAPI) {
    try {
        clientAPI.showActivityIndicator("Loading data...");

        const pageProxy = clientAPI.getPageProxy();
        const binding = pageProxy.getBindingObject();
        const readLink = binding['@odata.readLink'];
        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        const headerSection = FormSectionedTable.getSection('HeaderSection');

        // Header setup
        headerSection.getControl('SnorkelNo').setEditable(false);
        if (clientAPI.binding.SNORKEL_NO) {
            FormSectionedTable.getSection('Section1Form').setVisible(true);
            headerSection.getControl('DownloadReport').setVisible(true);
            headerSection.getControl('DownloadPDF').setVisible(true);
            headerSection.getControl('GenerateEntry').setVisible(false);
        }

        // Read all backend data in parallel
        const [itemsResult, headerFiles, attachmentsResult, testdata] = await Promise.all([
            clientAPI.read(service, `${readLink}/qc_ITEMS`, [], ''),
            clientAPI.read(service, `${readLink}/headerFiles`, [], ''),
            clientAPI.read(service, `${readLink}/qc_ATTACHMENTS`, [], ''),
            clientAPI.read(service, `${readLink}/qc_TESTS`, [], ''),
        ]);

        const items = itemsResult._array;
        const attachments = attachmentsResult._array;
        const attachmentGroups = groupAttachmentsByQuestion(attachments);
        const flags = { next: false };

        // Handle header files (PDF upload control)
        if (headerFiles && headerFiles._array.length > 0) {
            const uploadPdfControl = headerSection.getControl('uploadPdf');
            if (uploadPdfControl) {
                const fileDataArray = [];
                for (let i = 0; i < headerFiles._array.length; i++) {
                    const headerFile = headerFiles._array[i];
                    if (!headerFile.file) continue;
                    try {
                        const fileData = await processFileData(headerFile);
                        fileDataArray.push(fileData);
                    } catch (err) {
                        // console.error(`❌ Error processing file ${i + 1}:`, err);
                    }
                }
                if (fileDataArray.length > 0) {
                    uploadPdfControl.setValue(fileDataArray);
                    uploadPdfControl.setVisible(true);
                }
            }
        }

        // Sections for Page 1
        const orderedSectionKeys = [
            '1.1', '2.1', '3.1', '3.2', '4.1', '4.2',
            '5.1', '5.2', '5.3', '6.1', '6.2', '6.3'
        ];

        for (const sectionKey of orderedSectionKeys) {
            const loader = getSectionLoader(sectionKey);
            if (!loader) continue;

            const item = items.find(it => {
                const sectionKeyFromItem = it.QUESTION?.trimStart().split(' ')[0];
                return sectionKeyFromItem === sectionKey;
            });

            if (item && item.DATE_INSPECTED && item.INSPECTED_BY) {
                const question = item.QUESTION?.trim();
                const normalize = str => str?.replace(/\s+/g, ' ')?.trim();
                const matchingAttachments = attachmentGroups[normalize(question)] || [];
                try {
                    await loader(pageProxy, item, FormSectionedTable, matchingAttachments, flags, testdata._array);
                    // console.log(`✅ Loader for ${sectionKey} executed successfully`);
                } catch (err) {
                    // console.error(`❌ Error running loader for section ${sectionKey}:`, err);
                }
            }
        }

        clientAPI.dismissActivityIndicator();
    } catch (error) {
        clientAPI.dismissActivityIndicator();
        // console.error('❌ Fatal error in LoadSnorkelDataPage1:', error);
    }
}

// --- Helpers ---
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
    };
    return sectionLoaders[sectionKey];
}

function groupAttachmentsByQuestion(attachments = []) {
    const grouped = {};
    for (const attachment of attachments) {
        const rawKey = attachment.QUESTION || attachment.question || '';
        const key = rawKey.replace(/\s+/g, ' ').trim();
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(attachment);
    }
    return grouped;
}

async function processFileData(headerFile) {
    const base64File = headerFile.file;
    const fileName = headerFile.name;
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
