import { loadSection111Data } from './loadSection111Data';
import { loadSection112Data } from './loadSection112Data';
import { loadSection113Data } from './loadSection113Data';
import { loadSection121Data } from './loadSection121Data';
import { loadSection122Data } from './loadSection122Data';
import { loadSection123Data } from './loadSection123Data';

export default async function LoadSnorkelDataPage3(clientAPI) {
    try {
        // console.log('🚀 LoadSnorkelDataPage3 started');
        clientAPI.showActivityIndicator("Loading data...");

        const pageProxy = clientAPI.getPageProxy();
        const binding = pageProxy.getBindingObject();
        const readLink = binding['@odata.readLink'];
        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        const headerSection = FormSectionedTable.getSection('HeaderSection');

        // console.log('🔗 Read link:', readLink);

        // --- Read Data ---
        // console.log('📡 Reading data from backend...');
        const [itemsResult, headerFiles, attachmentsResult, testdata] = await Promise.all([
            clientAPI.read(service, `${readLink}/qc_ITEMS`, [], ''),
            clientAPI.read(service, `${readLink}/headerFiles`, [], ''),
            clientAPI.read(service, `${readLink}/qc_ATTACHMENTS`, [], ''),
            clientAPI.read(service, `${readLink}/qc_TESTS`, [], ''),
        ]);
        // console.log('✅ Data read complete');

        const items = itemsResult._array;
        const attachments = attachmentsResult._array;
        const attachmentGroups = groupAttachmentsByQuestion(attachments);
        const flags = { next: false };

        // console.log(`📦 Items loaded: ${items.length}`);
        // console.log(`📎 Attachments loaded: ${attachments.length}`);
        // console.log(`🧪 Test data loaded: ${testdata._array.length}`);

        // --- Process Header Files ---
        if (clientAPI.binding.SNORKEL_NO) {
            // console.log(`📋 SNORKEL_NO found: ${clientAPI.binding.SNORKEL_NO}`);
            FormSectionedTable.getSection('Section111Form').setVisible(true);
        } else {
            // console.warn('⚠️ SNORKEL_NO not found in binding');
        }

        // --- Section Keys (Page 3 only) ---
        const orderedSectionKeys = [
            '11.1', '11.2', '11.3',
            '12.1', '12.2', '12.3'
        ];

        // console.log('🔁 Beginning section data loading...');

        for (const sectionKey of orderedSectionKeys) {
            // console.log(`➡️ Processing section ${sectionKey}`);
            const loader = getSectionLoader(sectionKey);
            if (!loader) {
                // console.warn(`⚠️ No loader found for section ${sectionKey}`);
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

                // console.log(`📄 Found item for section ${sectionKey} with ${matchingAttachments.length} attachments`);

                try {
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
                // console.log(`ℹ️ Skipping section ${sectionKey}: item not found or missing DATE_INSPECTED / INSPECTED_BY`);
            }
        }

        clientAPI.dismissActivityIndicator();
        // console.log('✅ LoadSnorkelDataPage3 completed successfully');
    } catch (error) {
        clientAPI.dismissActivityIndicator();
        // console.error('❌ Fatal error in LoadSnorkelDataPage3:', error);
    }
}

// --- Helpers ---
function groupAttachmentsByQuestion(attachments = []) {
    const grouped = {};
    for (const attachment of attachments) {
        const rawKey = attachment.QUESTION || attachment.question || '';
        const key = rawKey.replace(/\s+/g, ' ').trim();
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(attachment);
    }
    // console.log(`📎 Grouped attachments by question. Total groups: ${Object.keys(grouped).length}`);
    return grouped;
}

function getSectionLoader(sectionKey) {
    const sectionLoaders = {
        '11.1': loadSection111Data,
        '11.2': loadSection112Data,
        '11.3': loadSection113Data,
        '12.1': loadSection121Data,
        '12.2': loadSection122Data,
        '12.3': loadSection123Data,
    };
    return sectionLoaders[sectionKey];
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
