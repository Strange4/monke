import { useState, useCallback } from "react";
import Spinner from "../Components/Spinner";

/**
 * Generic fetch function to fetch from any given
 * url and return a json object with the contained data
 * 
 * @param {String} url 
 * @returns {JSON} data
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
 * Post the user stat to the api
 * @param url 
 * @param userInput 
 */
async function postUserStatAPI(url, userStat) {
    let response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userStat)
    });
    if (!response.ok) {
        throw Error("Something Went wrong posting data");
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
            let data = null;
            // return the right content type
            if(contentType.match("json")){
                data = await response.json();
            } else if(contentType.match("text")){
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
            <Spinner/> : undefined

    return { sendRequest, loadingPlaceHolder };
}


export { fetchData, useFetch, postUserStatAPI };
