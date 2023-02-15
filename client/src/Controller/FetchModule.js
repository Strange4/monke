/**
 * Generic fetch function to fetch from any given
 * url and return a json object with the contained data
 * 
 * @param {String} url 
 * @returns {JSON} data
 * @author Rim Dallali
 */
async function fetchData(url) {
    let data;
    let response = await fetch(url);
    if (response.ok) {
        data = await response.json();
        return data;
    } else {
        throw Error("Something Went wrong fetching data");
    }
}

export { fetchData };