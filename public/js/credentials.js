let verifyCredentials = () => {
    let credentials = localStorage.getItem('session') || sessionStorage.getItem('session');

    if(credentials != null) {
        credentials = JSON.parse(credentials);
        fetch(`/api/users/${credentials.userID}?user=${credentials.userID}&session=${credentials.session}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(reply => {
            return {
                ok: reply.ok,
                body: reply.json()
            }
        }).then(response => {
            response.body.then(res => {
                if(response.ok) {
                    credentials.name = res.user.name;
                    if(localStorage.getItem('session')) {
                        localStorage.setItem('session', JSON.stringify(credentials));
                    } else {
                        if(sessionStorage.getItem('session')) {
                            sessionStorage.setItem('session', JSON.stringify(credentials));
                        }
                    }
                } else {
                    localStorage.removeItem('session');
                    sessionStorage.removeItem('session');
                    window.location = '/';
                }
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
    }
}

let signOut = () => {
    localStorage.removeItem('session');
    sessionStorage.removeItem('session');

    window.location = '/';
}

let login = () => {
    let credentials = localStorage.getItem('session') || sessionStorage.getItem('session');

    if(credentials != null) {
        credentials = JSON.parse(credentials);
        fetch(`/api/users/${credentials.userID}?user=${credentials.userID}&session=${credentials.session}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(reply => {
            return {
                ok: reply.ok,
                body: reply.json()
            }
        }).then(response => {
            response.body.then(res => {
                if(response.ok) {
                    credentials.name = res.user.name;
                    if(localStorage.getItem('session')) {
                        localStorage.setItem('session', JSON.stringify(credentials));
                    } else {
                        if(sessionStorage.getItem('session')) {
                            sessionStorage.setItem('session', JSON.stringify(credentials));
                        }
                    }
                    window.location = '/lab/apps/';
                } else {
                    localStorage.removeItem('session');
                    sessionStorage.removeItem('session');
                    window.location = '/';
                }
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
    }
}