import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { LocationContext } from "../../Context/LocationContext";
// import { useNavigate } from "react-router-dom";

const ROUTES = ["/", "/profile", "/lobby", "/multiplayer-game"];

export function isRouteInvalid() {
    // const navigate = useNavigate();
    const currentLocation = useLocation();
    const { lastVisitedLocation } = useContext(LocationContext);
    console.log(lastVisitedLocation.current)
    console.log(currentLocation);
    return  (lastVisitedLocation.current === null || !ROUTES.includes(currentLocation.pathname)) 
    //     console.log("NONONO")
    //     navigate("/")
}