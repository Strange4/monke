/* eslint-disable camelcase */
import NavBar from "../Components/NavBar";
import "./Styles/Profile.css";
import AuthContext from "../Context/AuthContext";
import { useContext, useEffect, useState, useRef } from "react";
import { RiImageEditFill, RiEdit2Fill, RiSave3Line, RiCloseCircleLine } from "react-icons/ri";
import * as FetchModule from "../Controller/FetchModule"
import { useNavigate } from "react-router-dom";

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
    const avatarField = useRef()
    // const inputFile = useRef();
    const navigate = useNavigate()
    const DefaultPicture =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"


    //test start
    const [image, setImage] = useState("");
    const inputFile = useRef();
    //test end

    useEffect(() => {
        (async () => {
            if (auth.userEmail) {
                const url = "/api/user"
                const data = await FetchModule.postData(url, { email: auth.userEmail }, "POST")
                setProfileData(data);
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
            setEditingUsername(false)
            const newUsername = usernameField.current.textContent;
            const body = { email: auth.userEmail, username: newUsername }
            const data = await FetchModule.postData("/api/update_username", body, "PUT")
            setProfileData(data);
        } else {
            setUsernameFeedback(
                "Invalid username: \n * Usernames can consist of lowercase and capitals \n",
                "Usernames can consist of alphanumeric characters \n",
                "Usernames can consist of underscore and hyphens and spaces\n",
                "Cannot be two underscores, two hypens or two spaces in a row\n",
                "Cannot have a underscore, hypen or space at the start or end")
        }
    }

    function editUsername() {
        setEditingUsername(true)
    }

    /**
     * validates username with regex pattern
     * @returns {boolean}
     */
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

    /**
     * Validates the image and updates the profile picture
     * @param {Event} e 
     */
    const saveAvatar = async () => {
        // e.preventDefault()
        // const image = e.target.image.files[0]
        console.log(image)
        if (validateImageForm(image)) {
            FetchModule.readImage(image, auth.userEmail, validateImageForm, postImage);
            // e.target.reset();
            setEditingAvatar(false)
        }
    }

    /**
     * Cancels the editing of the avatar and resets it back to previously saved one
     */
    function cancelAvatarEdit() {
        setEditingAvatar(false)
        setAvatarFeedback("");
        avatarField.current.src = profileData.picture_url
    }

    /**
     * 
     * @param {*} data 
     */
    async function postImage(data) {
        const newData = await FetchModule.postImageAPI("/api/update_avatar", data);
        setProfileData(newData)
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
            setAvatarFeedback("Image to big, select a different image");
            return false;
        } else {
            setAvatarFeedback("");
            return true;
        }
    }

    function readURL(e) {
        const img = e.target.files[0]
        var reader = new FileReader();
        reader.onload = function (e) {
            avatarField.current.src = e.target.result
        }
        reader.readAsDataURL(img);
    }

    //test start
    const handleFileUpload = e => {
        const { files } = e.target;
        console.log(files[0])
        if (files && files.length) {
            readURL(e)
            setEditingAvatar(true)
            setImage(files[0])
        } 
    };

    const onButtonClick = () => {
        inputFile.current.click();
    };

    //test end


    return (
        <div id="home">
            <NavBar />
            <div id="profile">
                <div id="user">
                    <div id="image">
                        <img id="profile-pic"
                            ref={avatarField}
                            src={`${profileData.picture_url || DefaultPicture}`}
                            alt="your profile image"></img>
                        {
                            EditingAvatar ?
                                <div id="avatar-settings">
                                    <RiCloseCircleLine
                                        onClick={cancelAvatarEdit} />
                                    <RiSave3Line onClick={(e) => { saveAvatar(e) }} />
                                </div>
                                :
                                <RiImageEditFill
                                    id="edit-pic-icon"
                                    onClick={onButtonClick} />
                        }
                    </div>

                    <div id="update-avatar">
                        {
                            // EditingAvatar ? 
                            <>
                                <form id="image-picker-form" onSubmit={async (e) => await saveAvatar(e)}>
                                    {/* <input
                                        type="file"
                                        id="avatar" name="image"
                                        accept="image/png, image/jpeg, image/jpg"
                                        style={{ display: "none" }}
                                        ref={inputFile}
                                        onChange={(e) => { handleFileUpload(e) }} /> */}
                                    <input
                                        style={{ display: "none" }}
                                        ref={inputFile}
                                        // id="avatar" name="image"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={(e) => { handleFileUpload(e) }}
                                        type="file"
                                    />
                                </form>
                                <p> {AvatarFeedback} </p>
                            </>
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
                                    <RiEdit2Fill
                                        id="edit-name-icon"
                                        onClick={editUsername} />
                            }
                            <h2><span className="label">Name: </span></h2>
                            <h2 contentEditable={EditingUsername}
                                className={EditingUsername ? "editable" : ""}
                                suppressContentEditableWarning={true}
                                ref={usernameField}>
                                {profileData.username}
                            </h2>
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