/* eslint-disable camelcase */
import './Layout/SoloGameResult.css';
import { useEffect, useState, useContext } from 'react';
import Popup from "reactjs-popup";
import { GiPartyPopper } from 'react-icons/gi';
import { postUserStats, computeResults } from '../../Controller/GameResultsHelper';
import AuthContext from '../../Context/AuthContext';

function SoloGameResult({ isOpen, closeWindow, timer, originalText, displayText }) {
    const [userStats, setUserStats] = useState({ "time": 0, "wpm": 0, "accuracy": 0 });
    const auth = useContext(AuthContext);

    useEffect(() => {
        (async () => {
            if (isOpen === true) {
                const results = 
                    await computeSoloGameResults(timer.time().s, originalText, displayText);
                setUserStats(results);
            }
        })();
    }, [isOpen]);

    /**
     * Compute the results for the solo game upon end and post them
     */
    async function computeSoloGameResults(numberOfSeconds, text, typedText) {
        const results = computeResults(numberOfSeconds, text, typedText);
        if (auth.userLoggedIn) {
            postUserStats(results);
        }

        return results;
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
                    <GiPartyPopper />
                </div>
            </div>
        </Popup>
    );
}

export default SoloGameResult;