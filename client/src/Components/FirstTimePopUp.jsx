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
        try{
            if(props.setNextArea()){
                props.setNextArea(true);
            }
        } catch {
            // To not print out the error
        }    
    }

    function skipAll(){
        
    }
        
    return(
        <div className="firstTimeMessage">
            <div id={`${props.area}FirstTime`}>{message}</div>
            <div className="cookie-button-container">
                <button type="button" onClick={setCookieArea}>{`${btnMessage}`}</button>
                <button id="skip-tutorial" type="button" onClick={skipAll}>skip</button>
            </div>
        </div>
    );
}

export default FirstTimePopUp;