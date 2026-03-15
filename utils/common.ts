const getToken=()=>{
    if(typeof window !== "undefined"){
        return localStorage.getItem("token") || null;
    }
    return null;
}

export { getToken };