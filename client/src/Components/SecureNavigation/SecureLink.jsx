import React from "react";
import { LocationContext } from "../../Context/LocationContext";
import { Link } from "react-router-dom";

const SecureLink = React.forwardRef(function a(props, ref) {
    const { registerLocation } = React.useContext(LocationContext);
    return (
        <Link onClick={() => registerLocation(props.to)} ref={ref} {...props} />
    );
});

export { SecureLink };