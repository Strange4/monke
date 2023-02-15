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

/**
 * Post the input comment to the api
 * @param url 
 * @param userInput 
 */
async function postUserStatAPI(url, userStat) {
    console.log(userStat)
    let response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: userStat
    });
    if (response.ok) {
        console.log(`sent data successfully: ${JSON.stringify(userStat)}`);
    } else {
        throw Error("Something Went wrong posting data");
    }
}

export { fetchData, postUserStatAPI };