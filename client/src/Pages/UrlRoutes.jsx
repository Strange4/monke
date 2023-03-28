const PUBLIC_ALLOWED_ROUTES = ["/", "/profile", "/lobby", "/multiplayer-game", "/", "/"];

function useInvalidUrlRoutes() {
    const currentLocation = useLocation();
    const { lastVisitedLocation } = React.useContext(LocationContext);
    console.log(lastVisitedLocation.current, currentLocation);
    if (
        lastVisitedLocation.current === null &&
        !PUBLIC_ALLOWED_ROUTES.includes(currentLocation.pathname)
    ) {
        throw new Error("Cannot come here directly, buddy");
    }
}