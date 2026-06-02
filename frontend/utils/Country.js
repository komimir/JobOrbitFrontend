

/**
 * A wrapper class for some country details.
 */
export default class Country {
    constructor(name, code) {
        this.name = name;
        this.code = code;
    }
}


const countries = [
    new Country("United Kingdom", "gb"),
    new Country("United States of America", "us"),
    new Country("Germany", "de"),
    new Country("France", "fr"),
    new Country("Canada", "ca"),
]

/*
 * Automatically create objects that map country codes to country
 * names, and vice versa.
 */
const code_by_country = {}
const country_by_code = {}
for (const country of countries) {
    code_by_country[country.name] = country.code;
    country_by_code[country.code] = country.name;
}

const CODE_BY_COUNTRY = Object.freeze(code_by_country);
const COUNTRY_BY_CODE = Object.freeze(country_by_code);
export { 
    CODE_BY_COUNTRY,
    COUNTRY_BY_CODE,
};
