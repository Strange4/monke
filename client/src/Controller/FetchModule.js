import { useQuery } from "react-query";
import Spinner from "../Components/Spinner";
// importing definitions for better intellisense
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
async function postUserStatAPI(url, userStat, token) {
    console.log(token)
    let response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            // 'X-CSRF-TOKEN': token
        },
        body: JSON.stringify(userStat)
    });
    if (!response.ok) {
        throw Error("Something Went wrong posting data");
    }
}

/**
 * fetches data using react-query and handles errors
 * @param {string} cacheKey the key used by react-query to cache the response
 * @param {string} url the url used for the fetch request
 * @param {RequestInit?} fetchParams the parameters for the fetch request
 * @returns {[JSX.Element?, any?]}
 */
function useFetch(cacheKey, url, fetchParams) {
    const { data, error, isLoading } = useQuery(cacheKey, async () => {
        const response = await fetch(url, fetchParams);
        if (!response.ok) {
            throw new Error("There was an error in the response");
        }
        return await transformData(response);
    });
    if (isLoading) {
        return [<Spinner key="spinner" />, undefined];
    }
    if (error) {
        return (
            [<div key="spinner">
                <h1>There was an error contacting the server. Please try again later</h1>
            </div>, undefined]
        );
    }
    return [undefined, data];
}

/**
 * transforms the data type from a fetch response to it's sent content type
 * @param {Response} data the data that needs to be transformed to it's data type
 */
async function transformData(response) {
    const contentType = response.headers.get("Content-Type");
    if (contentType.match("json")) {
        return await response.json();
    } else if (contentType.match("text")) {
        return await response.text()
    }
    return await response.blob();
}

/**
 * Helper function to read the given image, convert it and post it
 * @param image 
 * @param username 
 * @param validateForm 
 * @param postImage 
 */
function readImage(image, email, validateForm, postImage) {
    if (validateForm(image)) {
        const fr = new FileReader();
        fr.readAsArrayBuffer(image);

        fr.onload = function () {
            let formData = new FormData()
            formData.append('image', image);
            formData.append('email', email);
            formData.append('fileName', image.name);
            postImage(formData);
        }
    }
}

async function postImageAPI(url, userInput, token) {
    console.log(token)
    let response = await fetch(url, {
        method: 'PUT',
        headers: {
            // 'X-CSRF-TOKEN': token
        },
        body: userInput
    });
    if (response.ok) {
        console.log(`sent data successfully: ${JSON.stringify(userInput)}`);
        return response
    } else {
        throw Error("Something Went wrong posting data");
    }
}


export { fetchData, postUserStatAPI, useFetch, readImage, postImageAPI };
