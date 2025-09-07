import { loadSection201Data } from './loadSection201Data';
import { loadSection202Data } from './loadSection202Data';
import { loadSection203Data } from './loadSection203Data';
import { loadSection204Data } from './loadSection204Data';

export default async function LoadSnorkelDataPage5(clientAPI) {
    try {
        console.log("🚀 LoadSnorkelDataPage5 started");
        clientAPI.showActivityIndicator("Loading data...");

        const pageProxy = clientAPI.getPageProxy();
        const binding = pageProxy.getBindingObject();
        console.log("📌 Page binding:", binding);

        const readLink = binding['@odata.readLink'];
        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';
        console.log("📌 Service:", service, " | ReadLink:", readLink);

        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        const headerSection = FormSectionedTable.getSection('HeaderSection');
        console.log("✅ Got FormSectionedTable & HeaderSection");

        // --- Read Data ---
        console.log("⏳ Fetching items, headerFiles, attachments, testdata...");
        const [itemsResult, headerFiles, attachmentsResult, testdata] = await Promise.all([
            clientAPI.read(service, `${readLink}/qc_ITEMS`, [], ''),
            clientAPI.read(service, `${readLink}/headerFiles`, [], ''),
            clientAPI.read(service, `${readLink}/qc_ATTACHMENTS`, [], ''),
            clientAPI.read(service, `${readLink}/qc_TESTS`, [], ''),
        ]);
        console.log("✅ Data fetched:", {
            itemsCount: itemsResult._array.length,
            headerFilesCount: headerFiles._array.length,
            attachmentsCount: attachmentsResult._array.length,
            testsCount: testdata._array.length
        });

        const items = itemsResult._array;
        const attachments = attachmentsResult._array;
        const attachmentGroups = groupAttachmentsByQuestion(attachments);
        console.log("📌 Grouped attachments:", attachmentGroups);

        const flags = { next: false };

        // --- Process Header Files ---
        if (clientAPI.binding.SNORKEL_NO) {
            console.log("📌 SNORKEL_NO found, showing Section201Form");
            FormSectionedTable.getSection('Section201Form').setVisible(true);
        } else {
            console.warn("⚠️ No SNORKEL_NO found in binding");
        }

        // --- Section Keys (Page 5 only) ---
        const orderedSectionKeys = ['20.1', '20.2', '20.3', '20.4', '20.5', '20.6'];
        console.log("📌 Ordered sections to process:", orderedSectionKeys);

        for (const sectionKey of orderedSectionKeys) {
            console.log(`➡️ Processing section ${sectionKey}`);
            const loader = getSectionLoader(sectionKey);
            if (!loader) {
                console.warn(`⚠️ No loader found for ${sectionKey}, skipping`);
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
                console.log(`📌 Item found for ${sectionKey}:`, {
                    question,
                    inspectedBy: item.INSPECTED_BY,
                    dateInspected: item.DATE_INSPECTED,
                    matchingAttachments
                });

                try {
                    await loader(
                        pageProxy,
                        item,
                        FormSectionedTable,
                        matchingAttachments,
                        flags,
                        testdata._array
                    );
                    console.log(`✅ Loader for ${sectionKey} executed successfully`);
                } catch (err) {
                    console.error(`❌ Error running loader for section ${sectionKey}:`, err);
                }
            } else {
                console.warn(`⚠️ No valid item for section ${sectionKey} (missing DATE_INSPECTED or INSPECTED_BY)`);
            }
        }

        clientAPI.dismissActivityIndicator();
        console.log("🎉 LoadSnorkelDataPage5 completed successfully");
    } catch (error) {
        clientAPI.dismissActivityIndicator();
        console.error('❌ Fatal error in LoadSnorkelDataPage5:', error);
    }
}

// --- Helpers ---
function groupAttachmentsByQuestion(attachments = []) {
    console.log("🔧 Grouping attachments by question");
    const grouped = {};
    for (const attachment of attachments) {
        const rawKey = attachment.QUESTION || attachment.question || '';
        const key = rawKey.replace(/\s+/g, ' ').trim();
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(attachment);
    }
    return grouped;
}

function getSectionLoader(sectionKey) {
    const sectionLoaders = {
        '20.1': loadSection201Data,
        '20.2': loadSection202Data,
        '20.3': loadSection203Data,
        '20.4': loadSection204Data
    };
    const loader = sectionLoaders[sectionKey];
    if (!loader) console.warn(`⚠️ No loader implemented for ${sectionKey}`);
    return loader;
}

async function processFileData(headerFile) {
    console.log("🔧 Processing headerFile:", headerFile.name);
    const base64File = headerFile.file;
    const fileName = headerFile.name;
    let cleanBase64 = base64File;
    if (base64File.startsWith('data:')) {
        cleanBase64 = base64File.split(',')[1];
    }
    const arrayBuffer = convertBase64ToArrayBuffer(cleanBase64);
    console.log(`✅ File processed: ${fileName}, size: ${arrayBuffer.byteLength} bytes`);
    return {
        urlString: fileName,
        content: arrayBuffer,
        contentType: 'application/pdf',
        size: arrayBuffer.byteLength
    };
}

function convertBase64ToArrayBuffer(base64) {
    console.log("🔧 Converting base64 to ArrayBuffer, length:", base64.length);
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    console.log("✅ Conversion complete, bytes:", len);
    return bytes.buffer;
}
