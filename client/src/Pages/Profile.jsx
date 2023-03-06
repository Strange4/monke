/* eslint-disable max-len */
/* eslint-disable camelcase */
import NavBar from "../Components/NavBar";
import "./Styles/Profile.css";
import AuthContext from "../Context/AuthContext";
import { useFetch } from "../Controller/FetchModule";
import { useContext, useEffect, useState, useRef } from "react";
import { RiImageEditFill, RiEdit2Fill, RiSave3Line, RiCloseCircleLine } from "react-icons/ri";
import * as FetchModule from "../Controller/FetchModule"

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
    const [EditingUsername, setEditingUsername] = useState(false)
    const [EditingAvatar, setEditingAvatar] = useState(false)
    const [UsernameFeedback, setUsernameFeedback] = useState("")
    const [AvatarFeedback, setAvatarFeedback] = useState("")
    const usernameField = useRef()

    useEffect(() => {
        (async () => {
            if (auth.userEmail) {
                console.log(auth.token)
                let data = await fetch("/api/user", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        "Content-Type": "application/json",
                        // 'X-CSRF-TOKEN': auth.token
                    },
                    body: JSON.stringify({ "email": auth.userEmail })
                });
                data = await data.json()
                setProfileData(data);
            }
        })();
    }, []);

    function editUsername() {
        setEditingUsername(true)
    }

    async function saveUsername() {
        if (validateUsername()) {
            console.log(auth.token)
            setEditingUsername(false)
            let newUsername = usernameField.current.textContent;
            let data = await fetch("/api/update_username", {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    // 'X-CSRF-TOKEN': auth.token
                },
                body: JSON.stringify({ email: auth.userEmail, username: newUsername })
            });
            setProfileData(await data.json());
        } else {
            setUsernameFeedback("Invalid username: \n * Usernames can consist of lowercase and capitals \n",
                "Usernames can consist of alphanumeric characters \n",
                "Usernames can consist of underscore and hyphens and spaces\n",
                "Cannot be two underscores, two hypens or two spaces in a row\n",
                "Cannot have a underscore, hypen or space at the start or end")
        }
    }

    function validateUsername() {
        const username = usernameField.current.textContent;
        const usernameRegex = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
        var validUsername = username.match(usernameRegex);
        if (validUsername === null) {
            return false;
        }
        setUsernameFeedback("")
        return true
    }

    function editAvatar() {
        setEditingAvatar(true)
    }

    const saveAvatar = async (e) => {
        e.preventDefault()
        let image = e.target.image.files[0]
        if (validateImageForm(image)) {
            FetchModule.readImage(image, auth.userEmail, validateImageForm, postImage);
            e.target.reset();
            setEditingAvatar(false)
        }
    }

    async function postImage(data) {
        let newData = await FetchModule.postImageAPI("/api/update_avatar", data, auth.token);
        setProfileData(await newData.json())
    }

    /**
     * Validates the given image form fields and sets the image feedback accordingly
     * @param image 
     * @returns 
     */
    function validateImageForm(image) {
        if (!image) {
            setAvatarFeedback("Please select a valid image");
            return false;
        } else {
            setAvatarFeedback("");
            return true;
        }
    }

    function cancelAvatar() {
        setEditingAvatar(false)
    }

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
                        {
                            EditingAvatar ?
                                <RiCloseCircleLine id="edit-pic-icon" onClick={cancelAvatar} />
                                :
                                <RiImageEditFill id="edit-pic-icon" onClick={editAvatar} />
                        }
                    </div>
                    <div id="update-avatar">
                        {
                            EditingAvatar ?
                                <>
                                    <form id="image-picker-form" onSubmit={(e) => saveAvatar(e)}>
                                        <input type="file" id="avatar" name="image" accept="image/png, image/jpeg, image/jpg" />
                                        <input type="submit" id="imageSubmit" className="submit-btn" value="Save" />
                                    </form>
                                    <p> {AvatarFeedback} </p>
                                </>
                                :
                                null
                        }

                    </div>
                    <div id="user-info">
                        <div id="username-info">
                            {
                                EditingUsername ?
                                    <>
                                        <RiSave3Line onClick={saveUsername} />
                                        <p>{UsernameFeedback}</p>
                                    </>
                                    :
                                    <RiEdit2Fill id="edit-name-icon" onClick={editUsername} />
                            }
                            <h2><span className="label">Name: </span></h2>
                            <h2 contentEditable={EditingUsername} suppressContentEditableWarning={true} ref={usernameField}>{profileData.username}</h2>
                        </div>
                        <h2> <span className="label">Rank: </span> {profileData.rank}</h2>
                    </div>
                </div>

                <div id="user-stats">
                    <p><span className="label">Avg. WPM: </span>
                        {Math.round(profileData.user_stats.wpm * 100) / 100}
                    </p>
                    <p><span className="label">Avg. ACC: </span>
                        {Math.round(profileData.user_stats.accuracy * 100) / 100}
                    </p>
                    <p><span className="label">Max WPM: </span>
                        {Math.round(profileData.user_stats.max_wpm * 100) / 100}
                    </p>
                    <p><span className="label">Max ACC: </span>
                        {Math.round(profileData.user_stats.max_accuracy * 100) / 100}
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