async function checkAccess() {
    const response = await fetch("/authentication/checkLogin");
    return response.status === 200
}

export default checkAccess;