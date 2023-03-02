/* eslint-disable camelcase */
import './Layout/SoloGameResult.css';
import { useEffect, useState, useContext } from 'react';
import Popup from "reactjs-popup";
import * as FetchModule from '../../Controller/FetchModule';
import AuthContext from '../../Context/AuthContext';

function SoloGameResult({ isOpen, closeWindow, timer, originalText, displayText }) {
    const [userStats, setUserStats] = useState({ "time": 0, "wpm": 0, "accuracy": 0 });

    const auth = useContext(AuthContext);
    const [userData, setUserData] = useState({
        username: "",
        email: auth.userEmail,
        image:
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        wpm: 0,
        max_wpm: 0,
        accuracy: 0,
        max_accuracy: 0,
        win: 0,
        lose: 0,
        draw: 0,
        games_count: 0
    });

    //temp
    async function fetchUserData() {
        console.log("FETCHING USER DATA 1")
        let data = await fetch("/api/user", {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ "user": { "email": auth.userEmail } })
        })
        setUserData(await data.json())
    }

    // useEffect(() => {
    // (async () => {
    //     console.log("FETCHING USER DATA 1")
    //     let data = await fetch("/api/user", {
    //         method: "POST",
    //         headers: { 'Accept': 'application/json', "Content-Type": "application/json" },
    //         body: JSON.stringify({ "user": { "email": auth.userEmail } })
    //     });
    //     setUserData(await data.json())
    // })()
    // }, [])

    useEffect(() => {
        if (isOpen === true) {
            const results = computeResults(timer.time().s, originalText, displayText);
            setUserStats(results);
            postUserStats(results);
        }
    }, [isOpen]);

    /**
     * Compute the results for the solo game upon end and post them
     */
    function computeResults(numberOfSeconds, text, typedText) {
        let nbWords = text.split(" ").length;
        let minutes = numberOfSeconds / 60;
        let wpm = nbWords / minutes;
        let result = {
            time: Math.round(numberOfSeconds * 100) / 100,
            wpm: Math.round(wpm * 100) / 100,
            accuracy: Math.round(computeAccuracy(typedText) * 100) / 100
        }
        //TODO ONLY POST WHEN LOGGED IN
        console.log(auth.checkAccess())
        if (localStorage.getItem("userEmail") !== "") {
            fetchUserData()
            postUserStats(result);
        }
        return result;
    }

    /**
     * computes the accuracy and returns it to the results computation
     * @returns {number}
     */
    function computeAccuracy(typedText) {
        let wrongCount = 0;
        let rightCount = 0;
        typedText.forEach(letter => {
            if (letter.type === "right") {
                ++rightCount;
            } else if (letter.type === "wrong") {
                ++wrongCount;
            }
        });
        let accuracy = rightCount / (rightCount + wrongCount) * 100;
        if (wrongCount === 0) {
            accuracy = 100;
        }
        return accuracy;
    }

    /**
     * Sends data to the post api for a user's solo game
     * TODO change the username to be the real username 
     * once login is implemented
     * @param {Object} result 
     */
    async function postUserStats(result) {
        console.log("FETCHING USER DATA 2")
        let data = await fetch("/api/user", {
            method: "POST",
            body: JSON.stringify({ "user": { "email": auth.userEmail } }),
            headers: { 'Accept': 'application/json', "Content-Type": "application/json" },
        });
        console.log(data)

        setUserStats(result);
        console.log(auth.userEmail)
        let userStats = {
            "username": userData.username,
            "email": auth.userEmail,
            "wpm": result.wpm,
            "accuracy": result.accuracy,
            "win": 0,
            "lose": 0,
            "draw": 0
        };
        console.log("FETCHING USER DATA 3")
        FetchModule.postUserStatAPI("/api/user_stat", userStats);
    }

    return (
        <Popup open={isOpen} position="center" onClose={closeWindow} modal>
            <div id="solo-game-result">
                <h1>END Solo Game Popup</h1>
                <p>time: {userStats.time} seconds </p>
                <p>wpm: {userStats.wpm}</p>
                <p>accuracy: {userStats.accuracy}%</p>
                <p> press escape or click out of the popup to leave </p>
            </div>
        </Popup>
    );
}

export default SoloGameResult;