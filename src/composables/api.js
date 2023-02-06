import { ref } from "vue";

/**
 * Generic wrapper for an API GET request
 * @returns 
 */
export function useGetRequest() {
    const data = ref("");
    const loading = ref(false);
    const error = ref("");

    /**
     * Executes the API GET request, with success & error callbacks
     * @param {*} url 
     * @param {*} callback 
     * @param {*} errorCallback 
     */
    function doRequest(url, callback = () => {}, errorCallback = () => {}) {
        loading.value = true;

        fetch(url)
        .then(r => {
            if (!r.ok) {
                throw new Error("Response was not OK");
            }
            return r.text();
        })
        .then(text => {
            data.value = text;
            callback();
            loading.value = false;
        })
        .catch(e => {
            error.value = e;
            errorCallback();
            loading.value = false;
        });
    }

    /**
     * Executes a SPARQL query, with success & error callbacks
     * @param {string} url 
     * @param {string} query 
     * @param {*} callback 
     * @param {*} errorCallback 
     */
    function doSparqlPostQuery(url, query, callback = () => {}, errorCallback = () => {}) {
        loading.value = true;

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/sparql-query",
                "Authorization": "Basic YWRtaW46VEtTSEczOCZQakNDJWIhb2ckcmZ4YyYybzJ6NTNlRW1KbVZ2"
            },
            body: query
        })
        .then(r => {
            if (!r.ok) {
                throw new Error("Response was not OK");
            }
            return r.json();
        })
        .then(results => {
            data.value = results.results.bindings;
            callback();
            loading.value = false;
        })
        .catch(e => {
            error.value = e;
            errorCallback();
            loading.value = false;
        });
    }

    function doSparqlGetQuery(url, query, callback = () => {}, errorCallback = () => {}) {
        loading.value = true;

        fetch(`${url}?query=${encodeURIComponent(query)}`)
        .then(r => {
            if (!r.ok) {
                throw new Error("Response was not OK");
            }
            return r.json();
        })
        .then(results => {
            data.value = results.results.bindings;
            callback();
            loading.value = false;
        })
        .catch(e => {
            error.value = e;
            errorCallback();
            loading.value = false;
        });
    }

    return { data, loading, error, doRequest, doSparqlPostQuery, doSparqlGetQuery };
};