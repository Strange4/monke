/* eslint-disable camelcase */
import './Layout/SoloGameResult.css';
import { useEffect, useState, useContext } from 'react';
import Popup from "reactjs-popup";
import * as FetchModule from '../../Controller/FetchModule';
import AuthContext from '../../Context/AuthContext';
import { postData } from '../../Controller/FetchModule';

function SoloGameResult({ isOpen, closeWindow, timer, originalText, displayText }) {
    const [userStats, setUserStats] = useState({ "time": 0, "wpm": 0, "accuracy": 0 });

    const auth = useContext(AuthContext);
    const [userData, setUserData] = useState({
        username: "",
        picture_url:
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        user_stats: {
            wpm: 0,
            max_wpm: 0,
            accuracy: 0,
            max_accuracy: 0,
            win: 0,
            lose: 0,
            draw: 0,
            games_count: 0
        }
    });

    useEffect(() => {
        (async () => {
            if (isOpen === true) {
                const results = await computeResults(timer.time().s, originalText, displayText);
                setUserStats(results);
            }
        })()
    }, [isOpen]);

    /**
     * Compute the results for the solo game upon end and post them
     */
    async function computeResults(numberOfSeconds, text, typedText) {
        let nbWords = text.split(" ").length;
        let minutes = numberOfSeconds / 60;
        let wpm = nbWords / minutes;
        let result = {
            time: Math.round(numberOfSeconds * 100) / 100,
            wpm: Math.round(wpm * 100) / 100,
            accuracy: Math.round(computeAccuracy(typedText) * 100) / 100
        }

        let loggedIn = await auth.checkAccess()
        if (loggedIn) {
            let data = await postData("/api/user", { email: auth.userEmail }, "POST")
            setUserData(data)
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
     * @param {Object} result 
     */
    async function postUserStats(result) {
        setUserStats(result);
        const userStats = {
            username: userData.username,
            email: auth.userEmail,
            wpm: result.wpm,
            accuracy: result.accuracy
        };

        FetchModule.postData("/api/user_stat", userStats, "PUT")
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