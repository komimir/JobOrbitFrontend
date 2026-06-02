

/**
 * Converts a string representation of currency into a float value.
 * 
 * This function assumes that the given string is of the form:
 * 
 *      $<number-with-commas>
 *      
 * Examples of such values include:
 * 
 *      $1,000
 *      $54
 *      $20,500
 *
 * @param {string} value The string representation of the currency.
 * @returns {number} The numeric value of the US dollar.
 */
export function parseUSD(value) {
    value = value.slice(1);                 // Remove the dollar sign ($).
    value = value.replaceAll(",", "");      // Remove all commas (,).
    value = parseFloat(value);
    return value;
}

/**
 * Converts US Dollar to Philippine Peso.
 * 
 * @param {number} value The US Dollar to convert to Philippine Peso.
 * @returns {number} The given value in Philippine Pesos.
 */
export function USD2PHP(value) {
    return value * 61.67;
}

