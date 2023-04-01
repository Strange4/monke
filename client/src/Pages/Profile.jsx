/* eslint-disable camelcase */
import "./Styles/Profile.css";
import NavBar from "../Components/NavBar";
import AuthContext from "../Context/AuthContext";
import { useContext, useEffect, useState, useRef } from "react";
import { RiImageEditFill, RiEdit2Fill, RiSave3Line, RiCloseCircleLine } from "react-icons/ri";
import * as FetchModule from "../Controller/FetchModule";
import { useNavigate } from "react-router-dom";
import UserStats from "../Components/UserStats";
import { LocationContext } from "../Context/LocationContext";
import FirstTimePopUp from "../Components/FirstTimeTour/FirstTimePopUp";
import { getCookieValue } from "../Controller/CookieHelper.js";

const Profile = () => {
    const navigate = useNavigate();
    const locationContext = useContext(LocationContext);
    const auth = useContext(AuthContext);
    const defaultProfileData = {
        username: "",
        picture_url:
            // eslint-disable-next-line max-len
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
    }
    const [profileData, setProfileData] = useState(defaultProfileData);
    const [EditingUsername, setEditingUsername] = useState(false);
    const [EditingAvatar, setEditingAvatar] = useState(false);
    const [UsernameFeedback, setUsernameFeedback] = useState("");
    const [AvatarFeedback, setAvatarFeedback] = useState("");
    const usernameField = useRef();
    const avatarField = useRef();
    const DefaultPicture =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    const [image, setImage] = useState("");
    const inputFile = useRef();

    useEffect(() => {
        if (!locationContext.validAccess) {
            navigate("/");
        }
    }, [locationContext.validAccess]);

    useEffect(() => {
        (async () => {
            if (auth.userLoggedIn) {
                const url = "/api/user";
                const data = await FetchModule.postData(url, undefined, "POST");
                if (data) {
                    setProfileData(data)
                }
            } else {
                navigate("/");
            }
        })();
    }, []);

    /**
     * Saves the username after it is validated else provides proper feedback
     */
    async function saveUsername() {
        if (validateUsername()) {
            setEditingUsername(false);
            const newUsername = usernameField.current.textContent;
            const body = { username: newUsername };
            const data = await FetchModule.postData("/api/update_username", body, "PUT");
            if (data) {
                setProfileData(data);
            }
        } else {
            setUsernameFeedback(`
                Invalid, usernames consist of:
                - alphanumeric, lower and upper case characters
                - underscore and hyphens and spaces
                - no consistent underscores, hypens or spaces
                - no underscore, hypen or space at start or end
                - must be 1 - 10 characters`);
        }
    }

    /**
     * validates username with regex pattern
     * @returns {boolean}
     */
    function validateUsername() {
        const username = usernameField.current.textContent;
        const usernameRegex = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
        var validUsername = username.match(usernameRegex);
        if (validUsername === null || username.length > 10 || username.length < 0) {
            return false;
        }
        setUsernameFeedback("");
        return true;
    }

    /**
     * Validates the image and updates the profile picture
     * @param {Event} e 
     */
    const saveAvatar = async () => {
        if (validateImageForm(image)) {
            FetchModule.readImage(image, validateImageForm, postImage);
            setEditingAvatar(false);
        }
    }

    /**
     * Cancels the editing of the avatar and resets it back to previously saved one
     */
    function cancelAvatarEdit() {
        setEditingAvatar(false);
        setAvatarFeedback("");
        avatarField.current.src = profileData.picture_url;
    }

    async function postImage(data) {
        const newData = await FetchModule.postImageAPI("/api/update_avatar", data);
        if (newData) {
            setProfileData(newData)
        }
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
        } else if (image.size / 1048576 > 5) {
            setAvatarFeedback("Image too big, select a different image");
            return false;
        } else {
            setAvatarFeedback("");
            return true;
        }
    }

    /**
     * Reads image as url
     * @param {Event} e 
     */
    function readURL(e) {
        const img = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            avatarField.current.src = e.target.result;
        }
        reader.readAsDataURL(img);
    }

    /**
     * Temporarily displays the chosen image for preview
     * @param {Event} e 
     */
    const handleFileUpload = e => {
        const { files } = e.target;
        if (files && files.length) {
            readURL(e);
            setEditingAvatar(true);
            setImage(files[0]);
        }
    };

    // Cookie related variables.
    const profileValue = getCookieValue("profileFirstTime") === "visited";
    const [profileCookie, visitedProfile] = useState(profileValue);

    return (
        <div id="home">
            <div className="blur"></div>
            <NavBar />
            {profileCookie ? <></> :
                <FirstTimePopUp area={"profile"} setCookieArea={visitedProfile} />}
            <div id="profile">
                <div id="user">
                    <div id="image">
                        <img id="profile-pic"
                            ref={avatarField}
                            src={`${profileData?.picture_url || DefaultPicture}`}
                            alt="your profile image"></img>
                        {
                            EditingAvatar ?
                                <div id="avatar-settings">
                                    <RiCloseCircleLine
                                        id="cancle-avatar-btn"
                                        onClick={cancelAvatarEdit} />
                                    <RiSave3Line
                                        id="save-avatar-btn"
                                        onClick={(e) => {
                                            saveAvatar(e)
                                        }} />
                                </div>
                                :
                                <RiImageEditFill
                                    id="edit-pic-icon"
                                    onClick={() => {
                                        inputFile.current.click()
                                    }} />
                        }
                    </div>

                    <div id="update-avatar">
                        <form id="image-picker-form"
                            onSubmit={async (e) => await saveAvatar(e)}>
                            <input
                                style={{ display: "none" }}
                                ref={inputFile}
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={(e) => {
                                    handleFileUpload(e)
                                }}
                                type="file"
                            />
                        </form>
                        <p> {AvatarFeedback} </p>
                    </div>
                    <div id="user-info">
                        <div id="username-info">
                            {EditingUsername ?
                                <RiSave3Line
                                    id="edit-name-icon"
                                    onClick={saveUsername} />
                                :
                                <RiEdit2Fill
                                    id="edit-name-icon"
                                    onClick={() => {
                                        setEditingUsername(true)
                                    }} />}

                            <h2><span className="user-label">Name: </span></h2>
                            <h2 id="user-name" contentEditable={EditingUsername}
                                className={EditingUsername ? "editable" : ""}
                                suppressContentEditableWarning={true}
                                ref={usernameField}
                                maxLength={5}>{profileData.username}</h2>
                            {
                                EditingUsername ?
                                    <>
                                        <RiSave3Line
                                            id="edit-name-icon"
                                            onClick={saveUsername} />
                                    </>
                                    :
                                    <RiEdit2Fill
                                        id="edit-name-icon"
                                        onClick={() => {
                                            setEditingUsername(true)
                                        }} />
                            }
                        </div>
                        <div id="rank-info">
                            <h2> <span className="user-label">Rank: </span></h2>
                            <h2>{profileData.rank}</h2>
                        </div>
                    </div>
                    <UserStats userData={profileData} />
                </div>
                <p id="username-error">{UsernameFeedback}</p>
            </div>
        </div>
    );
}

export default Profile;