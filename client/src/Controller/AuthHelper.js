async function checkAccess() {
    const response = await fetch("/authentication/protected");
    if (response.status === 200) {
        return true;
    } else if (response.status === 204) {
        return false;
    } else {
        return false;
    }
}

export default checkAccess;