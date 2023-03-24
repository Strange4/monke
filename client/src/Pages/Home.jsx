import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import GameSettings from "../Components/GameSettings";
import FirstTimePopUp from "../Components/FirstTimePopUp";
import { getCookieValue, deleteCookie } from "../Controller/CookieHelper.js";
import { useState } from "react";

const Home = () => {


    // Kat when you want to test use the delete here and refresh the page so the style of the banners
    // deleteCookie("cookieFirstTime");
    // deleteCookie("homeFirstTime");
    // deleteCookie("leaderboardFirstTime");
    // deleteCookie("lobbyFirstTime");
    // deleteCookie("loginFirstTime");

    const [cookieCookie, visitedCookie] = useState(getCookieValue("cookieFirstTime") === "visited");
    const [homeCookie, visitedHome] = useState(getCookieValue("homeFirstTime") === "visited");
    const [leaderboardCookie, visitedLeaderboard] = useState(getCookieValue("leaderboardFirstTime") === "visited");
    const [lobbyCookie, visitedLobby] = useState(getCookieValue("lobbyFirstTime") === "visited"); 
    const [loginCookie, visitedLogin] = useState(getCookieValue("loginFirstTime") === "visited");
    
    return (
        <div id="home">
            <NavBar />
            { cookieCookie ? <></> : <FirstTimePopUp area={"cookie"} setCookieArea={visitedCookie}/> }
            { homeCookie ? <></> : <FirstTimePopUp area={"home"} setCookieArea={visitedHome}/> }
            { leaderboardCookie ? <></> : <FirstTimePopUp area={"leaderboard"} setCookieArea={visitedLeaderboard}/> }
            { lobbyCookie ? <></> : <FirstTimePopUp area={"lobby"} setCookieArea={visitedLobby}/> }
            { loginCookie ? <></> : <FirstTimePopUp area={"login"} setCookieArea={visitedLogin}/> }
            <div id="game-component">
                <GameSettings />
                <TypingScreen />
            </div>
        </div>
    );
}

export default Home;