

import Accommodation from "./Accommodation.js";
import { CODE_BY_COUNTRY } from "./Country.js";
import Job from "./Job.js"


/**
 * Represents the backend to be connected to.
 */
class Backend {
    /**
     * Represents the backend to be connected to.
     * 
     * @param {int} port The port of the backend.
     */
    constructor(port = 8000) {
        this.port = port;
    }
    
    /**
     * The base URL of the backend.
     */
    get url() {
        return `http://localhost:${this.port}`;
    }
    
    /**
     * An asynchronous function that returns all jobs.
     *
     * @returns {Promise<Job[]>} The list of jobs from the backend API.
     */
    async jobs() {
        const url = `${this.url}/api/jobs/`;
        const data = await this.#getDataFromAPI(url);
        
        if (data === null)
            return [];
        
        const jobs = data["results"];
        return this.#convertDataToJobArray(jobs);
    }
    
    /**
     * An asynchronous function that returns all jobs given a country code.
     * 
     * @param {string} countryCode The code of the country to be searched for jobs.
     * @returns {Promise<Job[]>} The list of jobs based on a specific country given
     *      by the backend API.
     */
    async jobsFrom(countryCode) {
        const countryCodes = Object.values(CODE_BY_COUNTRY);
        if (!countryCodes.includes(countryCode))
            throw new Error(`Invalid country code: ${countryCode}`);

        const url = `${this.url}/api/jobs/${countryCode}/`;
        const data = await this.#getDataFromAPI(url);

        if (data === null)
            return [];

        const jobs = data["results"];
        return this.#convertDataToJobArray(jobs);
    }
    
    /**
     * An asynchronous function that returns all jobs in UK.
     * 
     * @returns {Promise<Job[]>} The list of jobs from UK given by 
     *      the backend API.
     */
    async jobsFromUK() {
        const countryCode = CODE_BY_COUNTRY["United Kingdom"];
        const jobs = await this.jobsFrom(countryCode);
        return jobs;
    }
    
    /**
     * An asynchronous function that returns all jobs in USA.
     * 
     * @returns {Promise<Job[]>} The list of jobs from USA given by 
     *      the backend API.
     */
    async jobsFromUSA() {
        const countryCode = CODE_BY_COUNTRY["United States of America"];
        const jobs = await this.jobsFrom(countryCode);
        return jobs;
    }
    
    /**
     * An asynchronous function that returns all jobs in Germany.
     * 
     * @returns {Promise<Job[]>} The list of jobs from Germany given by 
     *      the backend API.
     */
    async jobsFromGermany() {
        const countryCode = CODE_BY_COUNTRY["Germany"];
        const jobs = await this.jobsFrom(countryCode);
        return jobs;
    }
    
    /**
     * An asynchronous function that returns all jobs in France.
     * 
     * @returns {Promise<Job[]>} The list of jobs from France given by 
     *      the backend API.
     */
    async jobsFromFrance() {
        const countryCode = CODE_BY_COUNTRY["France"];
        const jobs = await this.jobsFrom(countryCode);
        return jobs;
    }
    
    /**
     * An asynchronous function that returns all jobs in Canada.
     * 
     * @returns {Promise<Job[]>} The list of jobs from Canada given by 
     *      the backend API.
     */
    async jobsFromCanada() {
        const countryCode = CODE_BY_COUNTRY["Canada"];
        const jobs = await this.jobsFrom(countryCode);
        return jobs;
    }
    
    /**
     * An asynchronous function that returns all accommodations in
     * the given city.
     * 
     * @param {string} city The city to look for accommodations.
     * @returns {Promise<Accommodation[]>} The list of accommodations 
     *      from the city given by the backend API.
     */
    async accommodationsFrom(city) {
        if (city === undefined)
            throw new Error("City cannot be undefined.");
        if (city === null)
            throw new Error("City cannot be null.");
        if (city === "")
            throw new Error("City cannot be an empty string.");

        const url = `${this.url}/api/accommodations/${city}/`;
        const data = await this.#getDataFromAPI(url);
        
        if (data === null)
            return [];
        
        const accommodations = data["listings"]["results"];
        return this.#convertDataToAccommodationArray(accommodations);
    }

    /**
     * Retrieves the data from the backend API.
     * 
     * If there was a problem with the request, then the function returns null
     * instead of the JSON object.
     * 
     * Note that the JSON object can be a single object or an array of objects.
     * This depends on the backend API.
     *
     * @param {string} url The URL of the backend API.
     * @returns {object[] | object | null} The JSON object returned by the backend API.
     */
    async #getDataFromAPI(url) {
        try {
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`Response status: ${response.status}`);
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * Converts the data returned by the backend API to an array of {@link Job} objects.
     * 
     * @param {object[] | object | null} jobs The data returned by the backend API
     *      when called about the list of jobs.
     * @returns The list of {@link Job} objects.
     */
    #convertDataToJobArray(jobs) {
        if (jobs == null || jobs.length === 0)
            return [];
        if (jobs.length === 1)
            return [new Job(jobs[0])]
        return Job.from(...jobs);
    }
    
    /**
     * Converts the data returned by the backend API to an array of {@link Accommodation} 
     * objects.
     * 
     * @param {object[] | object | null} jobs The data returned by the backend API
     *      when called about the list of jobs.
     * @returns The list of {@link Accommodation} objects.
     */
    #convertDataToAccommodationArray(accommodations) {
        if (accommodations == null || accommodations.length === 0)
            return [];
        if (accommodations.length === 1)
            return [new Accommodation(accommodations[0])];
        return Accommodation.from(...accommodations);
    }
}


// This creates a Singleton object for Backend.
const backend = new Backend()
export default backend

