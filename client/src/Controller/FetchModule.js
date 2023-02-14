import { useState, useCallback } from "react";

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

function useFetch(url, params) {
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const sendRequest = useCallback(async (callback) => {
        setIsLoading(true);
        try{
            const response = await fetch(url, params);

            if(!response.ok){
                setError(await response.text());
                setIsLoading(false);
                return;
            }
            const contentType = response.headers.get("Content-Type");
            console.log(contentType);
            let data = null;
            // return the right content type
            if(contentType.match("application/json")){
                data = await response.json();
            } else if(contentType.match("text/html")){
                data = await response.text()
            } else {
                data = await response.blob();
            }
            setIsLoading(false);
            callback(data);
        } catch (caughtError){
            setError(caughtError);
            setIsLoading(false);
        }
    });
    
    const loadingPlaceHolder = 
        isLoading || error ?
            <div>
                {isLoading && "Loading..."}
                {error && `There was an error fetching the page: ${error}`}
            </div> : undefined

    return { sendRequest, loadingPlaceHolder };
}


export { fetchData, useFetch };