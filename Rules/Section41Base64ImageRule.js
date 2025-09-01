export default function Section41Base64ImageRule(context) {
    const imageUri = context.binding.imageBase64;

    if (imageUri && imageUri.startsWith('data:')) {
        return imageUri;
    }

    return '';
}
