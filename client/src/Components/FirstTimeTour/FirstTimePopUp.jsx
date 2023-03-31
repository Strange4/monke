import { setCookie } from "../../Controller/CookieHelper.js";
import firstTimeData from "../../Data/first_time_messages.json";
import "../Styles/FirstTimePopUp.css";

/**
 * This ReactElement is a pop up that show users a message about how the website works.
 * @param {function + bool} props, function to set cookie area to visited and 
 * to set the state of the next area of cookie (shows the user) the next cookie banner.
 * Also, has a function to skip all cookie banner and bools to know which function is in the props.
 * @returns {ReactElement}
 */
function FirstTimePopUp(props){
    
    // Get the cookie information from the json object.
    const data = firstTimeData.messages.filter(data =>{
        if(data.message.area === props.area){
            return data.message;
        }
    });

    /**
     * Set cookie with area name to visited and opens the next cookie banner.
     */
    function setCookieArea(){
        const cookieName = `${props.area}FirstTime`;
        setCookie(cookieName, "visited");
        props.setCookieArea(true);
        if(props.nextArea){
            props.setNextArea(false);
        }
    }

    /**
     * Skip all the cookie banner.
     */
    function skipAll(){
        props.skipAll();
    }
        
    return(
        <div className="firstTimeMessage">
            <div id={`${props.area}FirstTime`}>{data[0].message.body}</div>
            <div className="cookie-button-container">
                <button type="button" onClick={setCookieArea}>
                    {`${data[0].message.btnMessage}`}
                </button>
                { props.skip ? <button type="button" onClick={skipAll}>skip</button> : <></> }
            </div>
        </div>
    );
}

export default FirstTimePopUp;