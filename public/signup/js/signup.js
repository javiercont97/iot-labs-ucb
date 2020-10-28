let isValidPassword = (text = '') => {
    if(text.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/) == null) {
        return false;
    } else {
        return true;
    }
};

let signUp = () => {
    if (document.getElementById('userName2').value == '' ||
        document.getElementById('email2').value == '' ||
        document.getElementById('pass2').value == '' ||
        document.getElementById('pass3').value == ''
    ) {
        let warningMessage = '';
        warningMessage += `<div id="warm1" class="alert alert-warning alert-dismissible fade show" role="alert">`;
        warningMessage += `    Debe llenar todos los campos`;
        warningMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
        warningMessage += `    <span aria-hidden="true">&times;</span>`;
        warningMessage += `    </button>`;
        warningMessage += `</div>`;
        document.getElementById('body').innerHTML = warningMessage + document.getElementById('body').innerHTML;
        // setTimeout(() => {
        //     document.getElementById('warm1').remove();
        // }, 4500);
        document.getElementById('userName2').focus();
    } else {
        if (!isValidPassword(document.getElementById('pass2').value)) {
            let warningMessage = '';
            warningMessage += `<div id="warn2" class="alert alert-warning alert-dismissible fade show" role="alert">`;
            warningMessage += `    La contraseña debe ser de al menos 8 caracteres y contener al menos un número, una mayúscula y una minúscula`;
            warningMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
            warningMessage += `    <span aria-hidden="true">&times;</span>`;
            warningMessage += `    </button>`;
            warningMessage += `</div>`;
            document.getElementById('body').innerHTML = warningMessage + document.getElementById('body').innerHTML;
            // setTimeout(() => {
            //     document.getElementById('warn2').remove();
            // }, 4500);
            document.getElementById('userName2').focus();
        } else {

            if (document.getElementById('pass2').value !== document.getElementById('pass3').value) {
                let warningMessage = '';
                warningMessage += `<div id="warn3" class="alert alert-warning alert-dismissible fade show" role="alert">`;
                warningMessage += `    Las contraseñas deben coincidir`;
                warningMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
                warningMessage += `    <span aria-hidden="true">&times;</span>`;
                warningMessage += `    </button>`;
                warningMessage += `</div>`;
                document.getElementById('body').innerHTML = warningMessage + document.getElementById('body').innerHTML;
                // setTimeout(() => {
                //     document.getElementById('warn3').remove();
                // }, 4500);
                document.getElementById('userName2').focus();
            } else {
                let reqBody = {
                    name: document.getElementById('userName2').value,
                    email: document.getElementById('email2').value,
                    password: document.getElementById('pass2').value
                };

                fetch('/api/users', {
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
                            if (r.ok) {
                                let successMessage = '';
                                successMessage += `<div class="alert alert-info alert-dismissible fade show" role="alert">`;
                                successMessage += `    Para finalizar el proceso de creación active su usuario mediante el correo electrónico`;
                                successMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
                                successMessage += `    <span aria-hidden="true">&times;</span>`;
                                successMessage += `    </button>`;
                                successMessage += `</div>`;
                                document.getElementById('body').innerHTML = successMessage + document.getElementById('body').innerHTML;
                            } else {
                                let errorMessage = '';
                                errorMessage += `<div class="alert alert-danger alert-dismissible fade show" role="alert">`;
                                errorMessage += `    ${res.err.message}`;
                                errorMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
                                errorMessage += `    <span aria-hidden="true">&times;</span>`;
                                errorMessage += `    </button>`;
                                errorMessage += `</div>`;
                                document.getElementById('body').innerHTML = errorMessage + document.getElementById('body').innerHTML;

                                document.getElementById('userName2').focus();
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                    }).catch(err => {
                        console.log(err.message);
                    });
            }
        }
    }
};
