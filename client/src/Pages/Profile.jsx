/* eslint-disable max-len */
/* eslint-disable camelcase */
import NavBar from "../Components/NavBar";
import "./Styles/Profile.css";
import AuthContext from "../Context/AuthContext";
import { useContext, useEffect, useState, useRef } from "react";
import { RiImageEditFill, RiEdit2Fill, RiSave3Line } from "react-icons/ri";

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
    const [Editing, setEditing] = useState(false)
    const [Feedback, setFeedback] = useState("")
    const usernameField = useRef()

    useEffect(() => {
        (async () => {
            if (auth.userEmail) {
                console.log(`PROFILE: user logged in [${auth.userEmail}]`)
                let data = await fetch("/api/user", {
                    method: "POST",
                    headers: { 'Accept': 'application/json', "Content-Type": "application/json" },
                    body: JSON.stringify({ "email": auth.userEmail })
                });
                setProfileData(await data.json());
            } else {
                console.log("PROFILE: user NOT logged in");
            }
        })();
    }, []);

    function editUsername() {
        console.log("modifying...")
        setEditing(true)
    }

    function saveUsername() {
        if (validateUsername()) {
            console.log("it was valid")
            setEditing(false)
        } else {
            //TODO display warning to the user
        }
    }

    function validateUsername() {
        const username = usernameField.current.textContent;
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        var validUsername = username.match(usernameRegex);

        if (validUsername === null) {
            console.log("invalid");
            return false;
        } 
        return true
    }

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
                        <RiImageEditFill id="edit-pic-icon" onClick={editUsername} />
                    </div>
                    <div id="user-info">
                        <div id="username-info">
                            {
                                Editing ?
                                    <RiSave3Line onClick={saveUsername} />
                                    :
                                    <RiEdit2Fill id="edit-name-icon" onClick={editUsername} />
                            }
                            <h2><span className="label">Name: </span></h2>
                            <h2 contentEditable={Editing} ref={usernameField}> {profileData.username} </h2>
                        </div>
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
                <div id="update-user">
                    <span className="label">Edit Profile: </span>
                    <form id="image-picker-form" onSubmit={(e) => { handleSubmit(e) }}>
                        <input type="file" id="avatar" name="image" accept="image/png, image/jpeg, image/jpg" />
                        <input type="submit" id="imageSubmit" className="submit-btn" value="Submit" />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;