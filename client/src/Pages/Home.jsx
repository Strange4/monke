import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import GameSettings from "../Components/GameSettings";
import FirstTimePopUp from "../Components/FirstTimePopUp";
import { getCookieValue, deleteCookie } from "../Controller/CookieHelper.js";
import { useState } from "react";

const Home = () => {


    // Kat when you want to test use the delete here 
    // and refresh the page so the style of the banners

    // deleteCookie("cookieFirstTime");
    // deleteCookie("settingsFirstTime");
    // deleteCookie("gameFirstTime");
    // deleteCookie("leaderboardFirstTime");
    // deleteCookie("lobbyFirstTime");
    // deleteCookie("loginFirstTime");

    const cookieNames = ["cookieFirstTime", "settingsFirstTime", "gameFirstTime", 
        "leaderboardFirstTime", "lobbyFirstTime", "loginFirstTime"];

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

    let count = 0;
    cookieValues.forEach(element => {
        if (element === true) {
            count++;
        }
    });

    const cookieSetter = [];

    // Reset the cookie if the person did not finish pressing next until the end.
    if (count < 6){
        cookieValues.forEach( (value, index) => {
            if (index === 0){
                cookieSetter.push(false);
            } else {
                cookieSetter.push(true);
            }
        });
    } else {
        for (let i = 0; i < cookieValues.length; i++){
            if (i <= falseIndex){
                cookieSetter.push(false);
            } else {
                cookieSetter.push(true);
            }
        }
    }
    
    const [cookieCookie, visitedCookie] = useState(cookieSetter[0]);
    const [settingsCookie, visitedSettings] = useState(cookieSetter[1]);
    const [gameCookie, visitedGame] = useState(cookieSetter[2]);
    const [leaderboardCookie, visitedLeaderboard] = useState(cookieSetter[3]);
    const [lobbyCookie, visitedLobby] = useState(cookieSetter[4]);
    const [loginCookie, visitedLogin] = useState(cookieSetter[5]);

    return (
        <div id="home">
            <div className="blur"></div>
            { cookieCookie ? <></> : 
                <FirstTimePopUp area={"cookie"} 
                    setCookieArea={visitedCookie} 
                    setNextArea={visitedSettings}/> }

            { settingsCookie ? <></> :
                <FirstTimePopUp area={"settings"} 
                    setCookieArea={visitedSettings} 
                    setNextArea={visitedGame}/> }
                
            { gameCookie ? <></> :
                <FirstTimePopUp area={"game"} 
                    setCookieArea={visitedGame} 
                    setNextArea={visitedLeaderboard}/> }

            { leaderboardCookie ? <></> : 
                <FirstTimePopUp area={"leaderboard"} 
                    setCookieArea={visitedLeaderboard} 
                    setNextArea={visitedLobby}/> }

            { lobbyCookie ? <></> : 
                <FirstTimePopUp area={"lobby"} 
                    setCookieArea={visitedLobby} 
                    setNextArea={visitedLogin}/> }

            { loginCookie ? <></> : 
                <FirstTimePopUp 
                    area={"login"} 
                    setCookieArea={visitedLogin}/> }
            <NavBar />
            <div id="game-component">
                
                <GameSettings />
                <TypingScreen />
            </div>
        </div>

    );
}

export default Home;