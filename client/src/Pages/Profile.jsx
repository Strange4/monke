import NavBar from "../Components/NavBar";
import "./Styles/Profile.css"

const Profile = (props) => {
    return (
        <div id="home">
            <NavBar />
            <div id="profile">
                <img id="profile-pic" src={`${props.profilePicture}`}></img>
                <div id="user-info">
                    <h2>Name: {props.username}</h2>
                    <h2>Rank: {props.rank}</h2>
                </div>

            </div>
        </div>
    );
}

export default Profile;