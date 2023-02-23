async function checkAccess() {
    const response = await fetch("/authentication/protected");
    if (response.status === 200) {
        console.log("true")
        return true
    } else if (response.status === 401) {
        console.log("false")
        return false
    } else {
        console.log("error")
        return false
    }
}

export default checkAccess;