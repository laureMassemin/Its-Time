/**
 * Formate un type de produit pour un affichage plus naturel
 * @param {string} productType - Le type de produit (ex: "lip_liner")
 * @returns {string} - Le type formaté (ex: "Lip Liner")
 */
export function formatProductType(productType) {
    if (!productType) return '';
    
    return productType
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
