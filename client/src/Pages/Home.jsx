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

    const cookieValue = getCookieValue("cookieFirstTime") === "visited";
    const homeValue = getCookieValue("homeFirstTime") === "visited";
    const leaderboardValue = getCookieValue("leaderboardFirstTime") === "visited";
    const lobbyValue = getCookieValue("lobbyFirstTime") === "visited"
    const loginValue = getCookieValue("loginFirstTime") === "visited";

    const [cookieCookie, visitedCookie] = useState(cookieValue);
    const [homeCookie, visitedHome] = useState(cookieValue ? homeValue :!(cookieValue && homeValue));
    const [leaderboardCookie, visitedLeaderboard] = useState(cookieValue ? leaderboardValue : !(homeCookie && leaderboardValue));
    const [lobbyCookie, visitedLobby] = useState(cookieValue ? lobbyValue : !(leaderboardValue && lobbyValue)); 
    const [loginCookie, visitedLogin] = useState( cookieValue ? loginValue : !(lobbyValue && loginValue));

    return (
        <div id="home">
            <NavBar />
            { cookieCookie ? <></> : <FirstTimePopUp area={"cookie"} setCookieArea={visitedCookie} setNextArea={visitedHome}/> }
            { homeCookie ? <></> : <FirstTimePopUp area={"home"} setCookieArea={visitedHome} setNextArea={visitedLeaderboard}/> }
            { leaderboardCookie ? <></> : <FirstTimePopUp area={"leaderboard"} setCookieArea={visitedLeaderboard} setNextArea={visitedLobby}/> }
            { lobbyCookie ? <></> : <FirstTimePopUp area={"lobby"} setCookieArea={visitedLobby} setNextArea={visitedLogin}/> }
            { loginCookie ? <></> : <FirstTimePopUp area={"login"} setCookieArea={visitedLogin}/> }
            <div id="game-component">
                <GameSettings />
                <TypingScreen />
            </div>
        </div>
    );
}

export default Home;