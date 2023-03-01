import NavBar from "../Components/NavBar";
import "./Styles/Profile.css";
import AuthContext from "../Context/AuthContext";
import { useContext, useEffect, useState } from "react";
import * as FetchModule from "../Controller/FetchModule"
import { RiImageEditFill, RiEdit2Fill } from "react-icons/ri";

const Profile = (props) => {

    const [userData, setUserData] = useState({
        username: "",
        rank: 0,
        avgWpm: 0,
        avgAcc: 0,
        winCount: 0,
        loseCount: 0,
        drawCount: 0,
        gameCount: 0
    });
    
    const auth = useContext(AuthContext);
    const { loadingPlaceHolder, sendRequest } = FetchModule.useFetch("/api/user", { body: { "username": userData.username } });

    useEffect(() => {
        console.log("fetching the userData");
        sendRequest((data) => {
            setUserData(data);
        });
    }, []);

    return (
        <div id="home">
            <NavBar loginStatus={props.loginStatus} />
            <div id="profile">
                <div id="image">
                    <img id="profile-pic"
                        src={`${auth.user.picture ?
                            auth.user.picture :
                            // eslint-disable-next-line max-len
                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}`}
                        alt="your profile image"></img>
                    <RiImageEditFill id="edit-icon" />
                    <RiImageEditFill id="edit-pic-icon"/>
                </div>

                <div id="user-info">
                    {console.log(auth)}
                    <h2>Name: {auth.user.name}</h2>
                    <h2>Rank: {userData.rank}</h2>
                    <h2>Name: Testing {props.username} <RiEdit2Fill id="edit-name-icon"/></h2>
                    <h2>Rank: {props.rank}</h2>
                </div>
                <div id="user-stats">
                    <p>Avg. WPM: {userData.avgWpm}</p>
                    <p>Avg. ACC: {userData.avgAcc}</p>
                    <p>Games: {userData.gameCount}</p>
                    <p>Wins: {userData.winCount}</p>
                    <p>Loses: {userData.loseCount}</p>
                    <p>Draws: {userData.drawCount}</p>
                </div>
            </div>
        </div>
    );
}

export default Profile;