

import { COUNTRY_BY_CODE } from "./Country.js";


/**
 * Represents a job given by the backend API.
 */
export default class Job {
    /**
     * Represents a job given by the backend API.
     * 
     * @param {object} data 
     */
    constructor(data) {
        this.id = parseInt(data["id"]);
        this.adzuna_id = data["adzuna_id"];

        this.title = data["title"];
        this.company = data["company_display_name"];
        this.location = data["location_display_name"];
        this.location_areas = data["location_area"];
        this.city = data["enriched_city"];
        
        // Properly get the country name.
        this.countryCode = data["enriched_country_code"];
        this.country = COUNTRY_BY_CODE[this.countryCode.toLowerCase()];
        
        const clean_float = number => number === null ? null : parseFloat(number);
        this.salaryMin = clean_float(data["salary_min"]);
        this.salaryMax = clean_float(data["salary_max"]);
        
        this.contractType = data["contract_type"];
        this.category = data["category_label"];
        this.description = data["description"];
        this.redirect_url = data["redirect_url"];
        this.created = new Date(data["created"]);
        
        this.tags = [];
    }
    
    /**
     * Creates the necessary job objects from the job data passed.
     * 
     * If the {@link jobs} variable contains multiple objects, then
     * those objects are converted to {@link Job} objects. The return 
     * value is the list of {@link Job} objects.
     * 
     * If the {@link jobs} variable only contains a single object, then
     * that single object is converted to a {@link Job} object. The return
     * value is the {@link Job} object itself.
     * 
     * @param  {...any} jobs The objects containing job details to be
     *      converted to a Job object.
     * @returns A list of {@link Job} objects or a single {@link Job}
     *      object.
     */
    static from(...jobs){
        if (jobs.length === 0)
            throw new Error("A list of data must be passed to create Job objects.")
        if (jobs.length === 1)
            return new Job(jobs[0])
        
        return jobs.map(job => new Job(job))
    }
}

