let credentials = localStorage.getItem('session') || sessionStorage.getItem('session');
if (credentials == null) {
    window.location = '/';
} else {
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
                if (response.ok) {
                    document.getElementById('updateUserName').value = `${res.user.name}`;
                    document.getElementById('updateUserEmail').value = `${res.user.email}`;
                    document.getElementById('updateUserPassword').value = '';
                } else {
                    console.log(res.err.message);
                    localStorage.removeItem('session');
                    sessionStorage.removeItem('session');

                    window.location = '/';
                }
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        });
}


document.getElementById('updateButton').addEventListener('click', () => {
    if(document.getElementById('updateUserName').value == '' &&
       document.getElementById('updateUserEmail').value == '' &&
       document.getElementById('updateUserPassword').value == '') {
        let warningMessage = '';
        warningMessage += `<div id="warm1" class="alert alert-warning alert-dismissible fade show" role="alert">`;
        warningMessage += `    Debe llenar al menos un campo`;
        warningMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
        warningMessage += `    <span aria-hidden="true">&times;</span>`;
        warningMessage += `    </button>`;
        warningMessage += `</div>`;
        document.getElementById('alertArea').innerHTML = warningMessage + document.getElementById('alertArea').innerHTML;
        // setTimeout(() => {
        //     document.getElementById('warm1').remove();
        // }, 4500);
    } else {
        if(document.getElementById('updateUserPassword').value.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/) == null && document.getElementById('updateUserPassword').value != '') {
            let warningMessage = '';
            warningMessage += `<div id="warn2" class="alert alert-warning alert-dismissible fade show" role="alert">`;
            warningMessage += `    La contraseña debe ser de al menos 8 caracteres y contener al menos un número, una mayúscula y una minúscula`;
            warningMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
            warningMessage += `    <span aria-hidden="true">&times;</span>`;
            warningMessage += `    </button>`;
            warningMessage += `</div>`;
            document.getElementById('alertArea').innerHTML = warningMessage + document.getElementById('alertArea').innerHTML;
            // setTimeout(() => {
            //     document.getElementById('warn2').remove();
            // }, 4500);
        } else {
            let data = {
            }

            if(document.getElementById('updateUserName').value != '') {
                data.name = document.getElementById('updateUserName').value;
            }
            if(document.getElementById('updateUserEmail').value != '') {
                data.email = document.getElementById('updateUserEmail').value;
            }
            if(document.getElementById('updateUserPassword').value != '') {
                data.password = document.getElementById('updateUserPassword').value;
            }

            fetch(`/api/users/${credentials.userID}?user=${credentials.userID}&session=${credentials.session}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(reply => {
                    return {
                        body: reply.json(),
                        ok: reply.ok
                    }
                }).then(r => {
                    r.body.then(res => {
                        if (r.ok) {
                            let successMessage = '';
                            successMessage += `<div id="alert1" class="alert alert-info alert-dismissible fade show" role="alert">`;
                            successMessage += `    Usuario actualizado correctamente`;
                            successMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
                            successMessage += `    <span aria-hidden="true">&times;</span>`;
                            successMessage += `    </button>`;
                            successMessage += `</div>`;
                            document.getElementById('alertArea').innerHTML = successMessage + document.getElementById('alertArea').innerHTML;
                            setTimeout(() => {
                                document.getElementById('alert1').remove();

                                if(data.name) {
                                    credentials.name = data.name;

                                    if(localStorage.getItem('session') != null) {
                                        localStorage.setItem('session', JSON.stringify(credentials));
                                    } else {
                                        if(sessionStorage.getItem('session') != null) {
                                            sessionStorage.setItem('session', JSON.stringify(credentials));
                                        }
                                    }
                                }

                                window.location.reload();
                            }, 4500);
                        } else {
                            let errorMessage = '';
                            errorMessage += `<div id="alert2" class="alert alert-danger alert-dismissible fade show" role="alert">`;
                            errorMessage += `    ${res.err.message}`;
                            errorMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
                            errorMessage += `    <span aria-hidden="true">&times;</span>`;
                            errorMessage += `    </button>`;
                            errorMessage += `</div>`;
                            document.getElementById('alertArea').innerHTML = errorMessage + document.getElementById('alertArea').innerHTML;
                            // setTimeout(() => {
                            //     document.getElementById('alert2').remove();
                            // }, 4500);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }).catch(err => {
                    console.log(err.message);
                });
        }
    }
});


let deleteAccount = () => {
    console.log('delete user');

    fetch(`/api/users/${credentials.userID}?user=${credentials.userID}&session=${credentials.session}`, {
        method: 'DELETE',
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
                if (response.ok) {
                    let successMessage = '';
                    successMessage += `<div id="deleteAlert" class="alert alert-info alert-dismissible fade show" role="alert">`;
                    successMessage += `    Usuario eliminado correctamente`;
                    successMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
                    successMessage += `    <span aria-hidden="true">&times;</span>`;
                    successMessage += `    </button>`;
                    successMessage += `</div>`;
                    document.getElementById('alertArea').innerHTML = successMessage + document.getElementById('alertArea').innerHTML;
                    setTimeout(() => {
                        document.getElementById('deleteAlert').remove();

                        localStorage.removeItem('session');
                        sessionStorage.removeItem('session');

                        window.location = '/';
                    }, 4500);
                } else {
                    let errorMessage = '';
                    errorMessage += `<div id="deleteUserError1" class="alert alert-danger alert-dismissible fade show" role="alert">`;
                    if(res.err.message) {
                        errorMessage += `    ${res.err.message}`;
                    } else {
                        errorMessage += `    Ha ocurrido un error inesperado. Intentelo de nuevo más tarde`;
                    }
                    errorMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
                    errorMessage += `    <span aria-hidden="true">&times;</span>`;
                    errorMessage += `    </button>`;
                    errorMessage += `</div>`;
                    document.getElementById('alertArea').innerHTML = errorMessage + document.getElementById('alertArea').innerHTML;
                    // setTimeout(() => {
                    //     document.getElementById('deleteUserError1').remove();
                    // }, 4500);
                }
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        });
}