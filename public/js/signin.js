let loginNormal = () => {
    let reqBody = {
        name: document.getElementById('email').value,
        password: document.getElementById('pass').value,
        keepSession: document.getElementById('keepMe').checked,
        platform: window.clientInformation.platform
    };

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
    })
        .then(reply => {
            return {
                body: reply.json(),
                ok: reply.ok
            }
        }).then(r => {
            r.body.then(res => {
                if(r.ok) {
                    let save = {
                        name: reqBody.name,
                        session: res.session,
                        userID: res.userID
                    }
                    if(reqBody.keepSession) {
                        localStorage.setItem('session', JSON.stringify(save));
                    } else {
                        sessionStorage.setItem('session', JSON.stringify(save));
                    }
                    window.location = '/lab/apps';
                } else {
                    let errorMessage = '';
                    errorMessage += `<div id="error" class="alert alert-danger alert-dismissible fade show" role="alert">`;
                    errorMessage += `    ${res.err.message}`;
                    errorMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
                    errorMessage += `    <span aria-hidden="true">&times;</span>`;
                    errorMessage += `    </button>`;
                    errorMessage += `</div>`;
                    document.getElementById('body').innerHTML = errorMessage + document.getElementById('body').innerHTML;
                    
                    setTimeout(() => {
                        document.getElementById('error').remove();
                    }, 4500);
                    document.getElementById('email').focus();
                }
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err.message);
        });
};