/* eslint-disable camelcase */
import NavBar from "../Components/NavBar";
import "./Styles/Profile.css";
import AuthContext from "../Context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { RiImageEditFill, RiEdit2Fill } from "react-icons/ri";

const Profile = (props) => {
    const auth = useContext(AuthContext);

    const [userData, setUserData] = useState({
        username: "",
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

    // useEffect(() => {
    //     sendRequest((data) => {
    //         setUserData(data);
    //     });
    // })

    useEffect(() => {
        (async () => {
            console.log(auth.userEmail)
            console.log("FETCHING USER DATA 4")
            let data = await fetch("/api/user", {
                method: "POST",
                headers: { 'Accept': 'application/json', "Content-Type": "application/json" },
                body: JSON.stringify({ "user": { "email": auth.userEmail } })
            });
            setUserData(await data.json())
        })()
    }, []);

    return (
        <div id="home">
            <NavBar loginStatus={props.loginStatus} />
            <div id="profile">
                <div id="image">
                    <img id="profile-pic"
                        src={`${userData.image ?
                            userData.image :
                            // eslint-disable-next-line max-len
                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}`}
                        alt="your profile image"></img>
                    <RiImageEditFill id="edit-icon" />
                    <RiImageEditFill id="edit-pic-icon" />
                </div>

                <div id="user-info">
                    <h2>Name: {userData.username} <RiEdit2Fill id="edit-name-icon" /></h2>
                    <h2>Rank: {userData.rank}</h2>
                </div>
                <div id="user-stats">
                    <p>Avg. WPM: {userData.wpm}</p>
                    <p>Avg. ACC: {userData.accuracy}</p>
                    <p>Games: {userData.games_count}</p>
                    <p>Wins: {userData.win}</p>
                    <p>Loses: {userData.lose}</p>
                    <p>Draws: {userData.draw}</p>
                </div>
            </div>
        </div>
    );
}

export default Profile;