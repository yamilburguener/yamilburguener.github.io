/**
 * Mezcla un array utilizando el algoritmo de Fisher-Yates.
 * @param {Array} array - El array a mezclar.
 */
export function mezclar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
