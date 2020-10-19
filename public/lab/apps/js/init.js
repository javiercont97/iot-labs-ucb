let init = () => {
    verifyCredentials();

    let credentials = localStorage.getItem('session') || sessionStorage.getItem('session');
    if(credentials == null) {
        window.location = '/';
    } else {
        document.getElementById('nameHolder').innerHTML = `${JSON.parse(credentials).name}`;
    }
}