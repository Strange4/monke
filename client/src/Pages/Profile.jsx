/* eslint-disable camelcase */
import NavBar from "../Components/NavBar";
import "./Styles/Profile.css";
import AuthContext from "../Context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { RiImageEditFill, RiEdit2Fill } from "react-icons/ri";

const Profile = () => {
    const auth = useContext(AuthContext);

    const [profileData, setProfileData] = useState({
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

    useEffect(() => {
        (async () => {
            if (auth.userEmail) {
                console.log(`PROFILE: user logged in [${auth.userEmail}]`)
                let data = await fetch("/api/user", {
                    method: "POST",
                    headers: { 'Accept': 'application/json', "Content-Type": "application/json" },
                    body: JSON.stringify({ "user": { "email": auth.userEmail } })
                });
                setProfileData(await data.json());
            } else {
                console.log("PROFILE: user NOT logged in");
            }
        })();
    }, []);

    return (
        <div id="home">
            <NavBar />
            <div id="profile">
                <div id="user">
                    <div id="image">
                        <img id="profile-pic"
                            src={`${profileData.image ?
                                profileData.image :
                            // eslint-disable-next-line max-len
                                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}`}
                            alt="your profile image"></img>
                        <RiImageEditFill id="edit-pic-icon" />
                    </div>
                    <div id="user-info">
                        <h2> 
                            <span className="label">Name: </span> 
                            {profileData.username} <RiEdit2Fill id="edit-name-icon" />
                        </h2>
                        <h2> <span className="label">Rank: </span> {profileData.rank}</h2>
                    </div>
                </div>


                <div id="user-stats">
                    <p><span className="label">Avg. WPM: </span> {profileData.wpm}</p>
                    <p><span className="label">Avg. ACC: </span> {profileData.accuracy}</p>
                    <p><span className="label">Games: </span> {profileData.games_count}</p>
                    <p><span className="label">Wins: </span> {profileData.win}</p>
                    <p><span className="label">Loses: </span> {profileData.lose}</p>
                    <p><span className="label">Draws: </span> {profileData.draw}</p>
                </div>
            </div>
        </div>
    );
}

export default Profile;