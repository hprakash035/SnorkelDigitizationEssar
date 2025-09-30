/**
 * Returns the image path for FinalA or FinalB based on the binding type.
 * @param {IClientAPI} clientAPI
 */
export default function FinalInletOutletImageB(clientAPI) {
    const binding = clientAPI.getBindingObject();

    if (binding && binding.type && binding.type.toLowerCase() === 'inlet') {
        return '/TRL_RH_SnorkelApp/Images/FinalInletB.png';
    } else {
        return '/TRL_RH_SnorkelApp/Images/FinalOutletB.png';
    }
}
