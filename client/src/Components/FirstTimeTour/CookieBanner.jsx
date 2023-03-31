import FirstTimePopUp from "./FirstTimePopUp";
import { getCookieValue, setCookie } from "../../Controller/CookieHelper.js";
import { useState } from "react";

/**
 * The container for cookie banners for the home page. This React Element will control the state 
 * of each cookie banner and display them depending if a cookie is saved or not for that area.
 * @returns {ReactElement}
 */
function CookieBanner(){

    const cookieNames = ["cookieFirstTime", "settingsFirstTime", "gameFirstTime", 
        "leaderboardFirstTime", "lobbyFirstTime", "loginFirstTime"];

    // Check if all cookie banners have been visited or not and keep track of where it has not been.
    const cookieValues = [];
    let falseIndex;
    let setFalseIndex = false;
    for (let i = 0; i < cookieNames.length; i++){
        if (getCookieValue(cookieNames[i]) === "visited"){
            cookieValues.push(true);
        } else{
            if (!setFalseIndex){
                falseIndex = i;
                setFalseIndex = true;
            }
            cookieValues.push(false);
        }    
    }

    // To count if the count is equal to 6 or else we will reset in a later step.
    let count = 0;
    cookieValues.forEach(element => {
        if (element === true) {
            count++;
        }
    });

    const cookieSetter = [];

    // Reset the cookie if the person did not finish pressing next until the end.
    if (count < 6){
        cookieValues.forEach( (_, index) => {
            if (index === 0){
                cookieSetter.push(false);
            } else {
                cookieSetter.push(true);
            }
        });
    } else {
        // This should make it so that no cookie banner appear.
        for (let i = 0; i < cookieValues.length; i++){
            if (i <= falseIndex){
                cookieSetter.push(false);
            } else {
                cookieSetter.push(true);
            }
        }
    }
    
    // This is where we set the set state of cookie banners.
    const [cookieCookie, visitedCookie] = useState(cookieSetter[0]);
    const [settingsCookie, visitedSettings] = useState(cookieSetter[1]);
    const [gameCookie, visitedGame] = useState(cookieSetter[2]);
    const [leaderboardCookie, visitedLeaderboard] = useState(cookieSetter[3]);
    const [lobbyCookie, visitedLobby] = useState(cookieSetter[4]);
    const [loginCookie, visitedLogin] = useState(cookieSetter[5]);

    /**
     * The onClick function to skip all the next cookie banner on the home page.
     * Sets the cookie to visited for each banner and the state also.
     */
    function skipAll(){
        cookieNames.forEach(name => {
            setCookie(name, "visited");
        });
        visitedSettings(true);
        visitedGame(true);
        visitedLeaderboard(true);
        visitedLobby(true);
        visitedLogin(true);
    }

    return(
        <>
            { cookieCookie ? <></> : 
                <FirstTimePopUp area={"cookie"} 
                    setCookieArea={visitedCookie} 
                    setNextArea={visitedSettings}
                    nextArea={true}
                    skip={false}/> }

            { settingsCookie ? <></> :
                <FirstTimePopUp area={"settings"} 
                    setCookieArea={visitedSettings} 
                    setNextArea={visitedGame}
                    skipAll={skipAll}
                    nextArea={true}
                    skip={true}/> }
                
            { gameCookie ? <></> :
                <FirstTimePopUp area={"game"} 
                    setCookieArea={visitedGame} 
                    setNextArea={visitedLeaderboard}
                    skipAll={skipAll}
                    nextArea={true}
                    skip={true}/> }

            { leaderboardCookie ? <></> : 
                <FirstTimePopUp area={"leaderboard"} 
                    setCookieArea={visitedLeaderboard} 
                    setNextArea={visitedLobby}
                    skipAll={skipAll}
                    nextArea={true}
                    skip={true}/> }

            { lobbyCookie ? <></> : 
                <FirstTimePopUp area={"lobby"} 
                    setCookieArea={visitedLobby} 
                    setNextArea={visitedLogin}
                    skipAll={skipAll}
                    nextArea={true}
                    skip={true}/> }

            { loginCookie ? <></> : 
                <FirstTimePopUp 
                    area={"login"} 
                    setCookieArea={visitedLogin}
                    skipAll={skipAll}
                    skip={true}/> }
        </>
    );
}

export default CookieBanner;