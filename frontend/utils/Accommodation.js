

/**
 * Represents an accommodation given by the backend API.
 */
export default class Accommodation {
    /**
     * Represents an accommodation given by the backend API.
     * 
     * @param {object} data The data given by the backend API.
     */
    constructor(data) {
        this.id = parseInt(data["id"]);
        this.name = data["name"];
        this.url = data["url"];

        /**
         * The {@link this.price} member is a string with the form:
         * 
         *      <currency symbol><price>
         *      
         * For example, the price could have the following values:
         * 
         *      $1,000
         *      $54
         *      $7,941
         */
        this.price = data["price"];

        this.description = data["description"];
        this.rating = data["rating"];
    }
    
    /**
     * Creates the necessary accomodation objects from the accomodation 
     * data passed.
     * 
     * If the {@link accomodations} variable contains multiple objects, then
     * those objects are converted to {@link Accomodation} objects. The return 
     * value is the list of {@link Accomodation} objects.
     * 
     * If the {@link accomodation} variable only contains a single object, then
     * that single object is converted to a {@link Accomodation} object. The return
     * value is the {@link Accommodation} object itself.
     * 
     * @param  {...any} accommodations The objects containing accommodation details 
     * to be converted to an Accomodation object.
     * @returns A list of {@link Accommodation} objects or a single {@link Accommodation}
     *      object.
     */
    static from (...accommodations) {
        if (accommodations.length === 0)
            throw new Error("A list of data must be passed to create Accommodation objects.");
        if (accommodations.length === 1)
            return new Accommodation(accommodations[0]);
        
        return accommodations.map(a => new Accommodation(a));
    }
}

