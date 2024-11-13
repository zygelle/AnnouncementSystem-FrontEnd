export const getToken = () => {
    return localStorage.getItem("accessToken");
};
export const getEmail = () => {
    return localStorage.getItem("email");
}
export const isAuthenticated = () => {
    return getToken() != null;
};
export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("email");
};