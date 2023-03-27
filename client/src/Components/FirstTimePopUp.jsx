import { setCookie } from "../Controller/CookieHelper.js";
import firstTimeData from "../Data/first_time_messages.json";
import "./Styles/FirstTimePopUp.css";

function FirstTimePopUp(props){
    
    let message;
    let btnMessage;

    firstTimeData.messages.forEach( (data) => {
        if (data.message.area === props.area){
            message = data.message.body;
            btnMessage = data.message.btnMessage;
        }
    });

    function setCookieArea(){
        const cookieName = `${props.area}FirstTime`;
        setCookie(cookieName, "visited");
        props.setCookieArea(true);
        if(props.nextArea){
            props.setNextArea(false);
        }
    }

    function skipAll(){
        props.skipAll();
    }
        
    return(
        <div className="firstTimeMessage">
            <div id={`${props.area}FirstTime`}>{message}</div>
            <div className="cookieButtonContainer">
                <button type="button" onClick={setCookieArea}>{`${btnMessage}`}</button>
                { props.skip ? <button type="button" onClick={skipAll}>Skip all</button> : <></> }
            </div>
        </div>
    );
}

export default FirstTimePopUp;