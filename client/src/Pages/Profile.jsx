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
        },
        rank: 0
    });

    useEffect(() => {
        (async () => {
            if (auth.userEmail) {
                console.log(`PROFILE: user logged in [${auth.userEmail}]`)
                let data = await fetch("/api/user", {
                    method: "POST",
                    headers: { 'Accept': 'application/json', "Content-Type": "application/json" },
                    body: JSON.stringify({"email": auth.userEmail })
                });
                data = await data.json()
                console.log(data);
                setProfileData(data);
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
                            // eslint-disable-next-line max-len
                            src={`${profileData.picture_url || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}`}
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
                    <p><span className="label">Avg. WPM: </span>
                        {profileData.user_stats.wpm}
                    </p>
                    <p><span className="label">Avg. ACC: </span> 
                        {profileData.user_stats.accuracy}
                    </p>
                    <p><span className="label">Games: </span>
                        {profileData.user_stats.games_count}
                    </p>
                    <p><span className="label">Wins: </span>
                        {profileData.user_stats.win}
                    </p>
                    <p><span className="label">Loses: </span>
                        {profileData.user_stats.lose}
                    </p>
                    <p><span className="label">Draws: </span>
                        {profileData.user_stats.draw}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Profile;