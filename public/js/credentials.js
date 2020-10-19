let verifyCredentials = () => {
    let credentials = localStorage.getItem('session') || sessionStorage.getItem('session');
    if(credentials == null) {
        window.location = '/';
    }
}

let signOut = () => {
    localStorage.removeItem('session');
    sessionStorage.removeItem('session');

    window.location = '/';
}