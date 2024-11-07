export const getToken = localStorage.getItem("accessToken");
export const getEmail = localStorage.getItem("email");
export const isAuthenticated = () => {
    return localStorage.getItem("accessToken") != null;
}
export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("email")
}