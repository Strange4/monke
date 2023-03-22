import Cookies from "js-cookie";

function Cookie(props){
    const name = props.cookieName;
    const value = props.cookieValue;

    Cookies.set(name, value, {expires: 100000});


    return(
        <>
        </>
    );
}

function getValue(cookieName){
    return Cookies.get(cookieName);
}


export default {Cookie, getValue};