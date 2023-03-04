import NavBar from "../Components/NavBar";
import "./Styles/Profile.css"
import { RiImageEditFill, RiEdit2Fill } from "react-icons/ri";

const Profile = (props) => {

    return (
        <div id="home">
            <NavBar />
            <div id="profile">
                <div id="user">
                    <div id="image">
                        <img id="profile-pic" 
                            src={`${props.profilePicture ? 
                                props.profilePicture : 
                            // eslint-disable-next-line max-len
                                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}`}
                            alt="your profile image"></img>
                        <RiImageEditFill id="edit-pic-icon"/>
                    </div>
                    <div id="user-info">
                        <h2>Name: Testing {props.username} <RiEdit2Fill id="edit-name-icon"/></h2>
                        <h2>Rank: {props.rank}</h2>
                    </div>
                </div>

                <div id="user-stats">
                    <p>Avg. WPM: {props.avg_wpm}</p>
                    <p>Avg. ACC: {props.avg_acc}</p>
                    <p>Games: {props.games}</p>
                    <p>Wins: {props.wins}</p>
                    <p>Loses: {props.loses}</p>
                    <p>Draws: {props.draws}</p>
                </div>
            </div>
        </div>
    );
}

export default Profile;