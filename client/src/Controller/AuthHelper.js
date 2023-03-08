async function checkAccess() {
    const response = await fetch("/authentication/protected");
    return response.status === 200
}

export default checkAccess;