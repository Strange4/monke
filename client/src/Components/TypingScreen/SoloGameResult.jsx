/* eslint-disable camelcase */
import './Layout/SoloGameResult.css';
import { useEffect, useState, useContext } from 'react';
import Popup from "reactjs-popup";
import * as FetchModule from '../../Controller/FetchModule';
import AuthContext from '../../Context/AuthContext';
import { postData } from '../../Controller/FetchModule';
import SocketContext from '../../Context/SocketContext';
import { GiPartyPopper } from 'react-icons/gi';

function SoloGameResult({ isOpen, closeWindow, timer, originalText, displayText, multiplayer }) {
    const [userStats, setUserStats] = useState({ "time": 0, "wpm": 0, "accuracy": 0 });
    const socketContext = useContext(SocketContext);
    const auth = useContext(AuthContext);

    useEffect(() => {
        (async () => {
            if (isOpen === true) {
                const results = await computeResults(timer.time().s, originalText, displayText);
                setUserStats(results);
            }
        })();
    }, [isOpen]);

    /**
     * Compute the results for the solo game upon end and post them
     */
    async function computeResults(numberOfSeconds, text, typedText) {
        const nbWords = text.split(" ").length;
        const minutes = numberOfSeconds / 60;
        const wpm = nbWords / minutes;
        const result = {
            time: Math.round(numberOfSeconds * 100) / 100,
            wpm: Math.round(wpm * 100) / 100,
            accuracy: Math.round(computeAccuracy(typedText) * 100) / 100
        }

        const loggedIn = await auth.checkAccess();
        if (loggedIn) {
            // await postData("/api/user", "POST");
            setUserStats(result);
            postUserStats(result);
        } 

        if (multiplayer) {
            socketContext.socket.current.emit("send-results", result);
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
        const userStats = {
            wpm: result.wpm,
            accuracy: result.accuracy
        };

        FetchModule.postData("/api/user_stat", userStats, "PUT");
    }

    return (
        <Popup open={isOpen} position="center" onClose={closeWindow} modal>
            <div id="solo-game-result">
                <h1>Game Results</h1>
                <div id='game-stats'>
                    <p><span className='stat-label'>time: </span>{userStats.time} seconds </p>
                    <p><span className='stat-label'>wpm: </span>{userStats.wpm}</p>
                    <p><span className='stat-label'>accuracy: </span>{userStats.accuracy}%</p>
                </div>
                <div id='end-icon'>
                    <GiPartyPopper/>
                </div>
            </div>
        </Popup>
    );
}

export default SoloGameResult;