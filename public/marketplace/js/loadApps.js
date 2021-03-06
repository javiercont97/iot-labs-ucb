let container = document.getElementById('container');


let credentials = localStorage.getItem('session') || sessionStorage.getItem('session');
if (credentials == null) {
    window.location = '/';
} else {
    credentials = JSON.parse(credentials);

    fetch(`/api/public/user-applications?user=${credentials.userID}&session=${credentials.session}`, {
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
                    let apps = [];
                    apps = res.apps;
                    let appCards = [];
                    let addAppCard = '';

                    appCards.push(addAppCard);
                    apps.forEach(app => {
                        let currentAppCard = '';
                        currentAppCard += '<div class="col-md-4 col-12 mt-2">';
                        currentAppCard += `    <div class="card border-dark" style="width: 20rem;">`;
                        currentAppCard += `        <h3 class="card-header bg-dark text-white">`;
                        currentAppCard += `            ${app.name}`;
                        currentAppCard += `        </h3>`;
                        currentAppCard += `        <div class="card-body">`;
                        currentAppCard += `            <h6 class="card-title">`;
                        currentAppCard += `                Descripción`;
                        currentAppCard += `            </h6>`;
                        currentAppCard += `            <p class="card-text">`;
                        currentAppCard += `                ${app.description}`;
                        currentAppCard += `            </p>`;
                        currentAppCard += `            <div class="">`;
                        currentAppCard += `                <h6 class="card-title">`;
                        currentAppCard += `                    Autor`;
                        currentAppCard += `                </h6>`;
                        currentAppCard += `                <p>`;
                        currentAppCard += `                    ${app.owner}`;
                        currentAppCard += `                </p>`;
                        currentAppCard += `            </div>`;
                        currentAppCard += `            <div class="row d-flex justify-content-center">`;
                        currentAppCard += `                <button class="btn btn-primary ml-1" onclick="openApp('${app._id}', ${app.privacyLevel})">`;
                        currentAppCard += `                    <span>`;
                        currentAppCard += `                        <img src="../../assets/img/icons/openApp.white.svg" title="Abrir aplicación"/>`;
                        currentAppCard += `                    </span>`;
                        currentAppCard += `                </button>`;
                        if (app.privacyLevel == 1) {
                            currentAppCard += `                <button class="btn btn-primary ml-1" onclick="shareApp('${app._id}')">`;
                            currentAppCard += `                    <span>`;
                            currentAppCard += `                        <img src="../../assets/img/icons/share.white.svg" title="Compartir"/>`;
                            currentAppCard += `                    </span>`;
                            currentAppCard += `                </button>`;
                        }
                        currentAppCard += `            </div>`;
                        currentAppCard += `        </div>`;
                        currentAppCard += `    </div>`;
                        currentAppCard += `</div>`;

                        appCards.push(currentAppCard);
                    });

                    container.innerHTML = appCards.join('\n');
                } else {
                    console.log(res.err.message);
                }
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        });
}


//=============================================================================================
// Defining callbacks
//=============================================================================================

/**
 * Copy appID and apiKey to clipboard so it is easy to copy it to IoT Labs IDE
 * @param {string} id App ID
 * @param {string} apiKey Application API key
 */
let copyApiKey = (id, apiKey) => {
    if(navigator.clipboard) {
        navigator.clipboard.writeText(`appID: "${id}"\napiKey: "${apiKey}"`);
        let successMessage = '';
        successMessage += `<div id="apiKeyCopied" class="alert alert-info alert-dismissible fade show" role="alert">`;
        successMessage += `    API key copiada al portapapeles`;
        successMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
        successMessage += `    <span aria-hidden="true">&times;</span>`;
        successMessage += `    </button>`;
        successMessage += `</div>`;
        document.getElementById('alertArea').innerHTML = successMessage + document.getElementById('alertArea').innerHTML;
        // setTimeout(() => {
        //     document.getElementById('apiKeyCopied').remove();
        // }, 4500);
    } else {
        let successMessage = '';
        successMessage += `<div id="apiKeyCopied" class="alert alert-info alert-dismissible fade show" role="alert">`;
        successMessage += `    API key: appID: "${id}", apiKey: "${apiKey}"`;
        successMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
        successMessage += `    <span aria-hidden="true">&times;</span>`;
        successMessage += `    </button>`;
        successMessage += `</div>`;
        document.getElementById('alertArea').innerHTML = successMessage + document.getElementById('alertArea').innerHTML;
        // setTimeout(() => {
        //     document.getElementById('apiKeyCopied').remove();
        // }, 4500);
    }
}


let editApp = (id) => {
    let data = {
        name: document.getElementById(`appName-${id}`).value,
        description: document.getElementById(`appDescription-${id}`).value,
        privacyLevel: document.getElementById(`appPrivacy-${id}`).value
    }

    if (data.name.length <= 0 || data.name.length >= 20) {
        let warningMessage = '';
        warningMessage += `<div id="editWarn1" class="alert alert-warning alert-dismissible fade show" role="alert">`;
        warningMessage += `    El nombre debe estar entre 1 y 20 caracteres`;
        warningMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
        warningMessage += `    <span aria-hidden="true">&times;</span>`;
        warningMessage += `    </button>`;
        warningMessage += `</div>`;
        document.getElementById('alertArea').innerHTML = warningMessage + document.getElementById('alertArea').innerHTML;
        // setTimeout(() => {
        //     document.getElementById('editWarn1').remove();
        //     document.getElementById(`appName-${id}`).focus();
        // }, 4500);
        return;
    }

    if (data.description.length <= 0 || data.description.length >= 100) {
        let warningMessage = '';
        warningMessage += `<div id="editWarn2" class="alert alert-warning alert-dismissible fade show" role="alert">`;
        warningMessage += `    La descripción debe estar entre 1 y 100 caracteres`;
        warningMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
        warningMessage += `    <span aria-hidden="true">&times;</span>`;
        warningMessage += `    </button>`;
        warningMessage += `</div>`;
        document.getElementById('alertArea').innerHTML = warningMessage + document.getElementById('alertArea').innerHTML;
        // setTimeout(() => {
        //     document.getElementById('editWarn2').remove();
        //     document.getElementById(`appDescription-${id}`).focus();
        // }, 4500);
        return;
    }

    if (data.privacyLevel == '0') {
        let warningMessage = '';
        warningMessage += `<div id="editWarn3" class="alert alert-warning alert-dismissible fade show" role="alert">`;
        warningMessage += `    Debe seleccionar la privacidad`;
        warningMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
        warningMessage += `    <span aria-hidden="true">&times;</span>`;
        warningMessage += `    </button>`;
        warningMessage += `</div>`;
        document.getElementById('alertArea').innerHTML = warningMessage + document.getElementById('alertArea').innerHTML;
        // setTimeout(() => {
        //     document.getElementById('editWarn3').remove();
        //     document.getElementById(`appPrivacy-${id}`).focus();
        // }, 4500);
        return;
    }

    data.privacyLevel = (data.privacyLevel == '1' ? 'PUBLIC' : 'PRIVATE');


    let session = localStorage.getItem('session') || sessionStorage.getItem('session');
    session = JSON.parse(session);
    let user = session.userID;
    let token = session.session;

    fetch(`/api/user-applications/${id}?user=${user}&session=${token}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(reply => {
            return {
                ok: reply.ok,
                body: reply.json()
            }
        }).then(response => {
            response.body.then(res => {
                if (response.ok) {
                    $(`#updateAppModal-${id}`).modal('hide');
                    window.location.reload();
                } else {
                    let errorMessage = '';
                    errorMessage += `<div id="editError1" class="alert alert-danger alert-dismissible fade show" role="alert">`;
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
                    //     document.getElementById('editError1').remove();
                    // }, 4500);
                }
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
}

let deleteApp = (id) => {
    console.log(id);
    console.log('Delete app');


    let session = localStorage.getItem('session') || sessionStorage.getItem('session');
    session = JSON.parse(session);
    let user = session.userID;
    let token = session.session;


    fetch(`/api/user-applications/${id}?user=${user}&session=${token}`, {
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
                    window.location.reload();
                } else {
                    let errorMessage = '';
                    errorMessage += `<div id="deleteError1" class="alert alert-danger alert-dismissible fade show" role="alert">`;
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
                    //     document.getElementById('deleteError1').remove();
                    // }, 4500);
                }
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
}

/**
 * Upload app code to be compiled and published
 * @param {string} id App ID
 */
let uploadCode = (id) => {
    let session = localStorage.getItem('session') || sessionStorage.getItem('session');
    session = JSON.parse(session);
    let user = session.userID;
    let token = session.session;

    let fileToBeUploaded = document.getElementById(`file-${id}`).files[0];
    let formData = new FormData();
    formData.append('appFiles', fileToBeUploaded);

    fetch(`/api/user-applications/${id}?user=${user}&session=${token}`, {
        method: 'PUT',
        body: formData
    })
        .then(reply => {
            return {
                ok: reply.ok,
                body: reply.json()
            }
        }).then(response => {
            response.body.then(res => {
                if (response.ok) {
                    $(`#uploadAppModal-${id}`).modal('hide');
                    let successMessage = '';
                    successMessage += `<div id="uploadAlert" class="alert alert-info alert-dismissible fade show" role="alert">`;
                    successMessage += `    Su aplicación está siendo procesada. Cuando este lista recibirá un correo electrónico`;
                    successMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
                    successMessage += `    <span aria-hidden="true">&times;</span>`;
                    successMessage += `    </button>`;
                    successMessage += `</div>`;
                    document.getElementById('alertArea').innerHTML = successMessage + document.getElementById('alertArea').innerHTML;
                    // setTimeout(() => {
                    //     document.getElementById('uploadAlert').remove();
                    // }, 4500);
                } else {
                    let errorMessage = '';
                    errorMessage += `<div id="uploadError1" class="alert alert-danger alert-dismissible fade show" role="alert">`;
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
                    //     document.getElementById('uploadError1').remove();
                    // }, 4500);
                }
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
}

/**
 * Open selected application to a new tab
 * @param {string} id App ID
 * @param {number} privacy Privacy level 1 is public and 0 is private
 */
let openApp = (id, privacy) => {
    if (privacy === 1) {
        // public
        window.open(`/api/render/${id}`, '_blank');
    } else {
        // private
        let session = localStorage.getItem('session') || sessionStorage.getItem('session');
        session = JSON.parse(session);
        let user = session.userID;
        let token = session.session;
        window.open(`/api/render/${id}?user=${user}&session=${token}`, '_blank');
    }
}

/**
 * Copy application URL to share
 * @param {string} id App ID
 */
let shareApp = (id) => {
    if(navigator.clipboard) {
        navigator.clipboard.writeText(`${window.location.origin}/api/render/${id}`);
        let successMessage = '';
        successMessage += `<div id="shareMessage" class="alert alert-info alert-dismissible fade show" role="alert">`;
        successMessage += `    Enlace a la aplicación copiado`;
        successMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
        successMessage += `    <span aria-hidden="true">&times;</span>`;
        successMessage += `    </button>`;
        successMessage += `</div>`;
        document.getElementById('alertArea').innerHTML = successMessage + document.getElementById('alertArea').innerHTML;
        // setTimeout(() => {
        //     document.getElementById('shareMessage').remove();
        // }, 4500);
    } else {
        let successMessage = '';
        successMessage += `<div id="shareMessage" class="alert alert-info alert-dismissible fade show" role="alert">`;
        successMessage += `    Enlace a la aplicación: ${window.location.origin}/api/render/${id}`;
        successMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
        successMessage += `    <span aria-hidden="true">&times;</span>`;
        successMessage += `    </button>`;
        successMessage += `</div>`;
        document.getElementById('alertArea').innerHTML = successMessage + document.getElementById('alertArea').innerHTML;
        // setTimeout(() => {
        //     document.getElementById('shareMessage').remove();
        // }, 4500);
    }
}

//=============================================================================================
// Create modal callbacks
//=============================================================================================

let createApp = () => {
    let data = {
        name: document.getElementById('appName').value,
        description: document.getElementById('appDescription').value,
        privacyLevel: document.getElementById('appPrivacy').value
    }

    if (data.name.length <= 0 || data.name.length >= 20) {
        let warningMessage = '';
        warningMessage += `<div id="createWarn1" class="alert alert-warning alert-dismissible fade show" role="alert">`;
        warningMessage += `    El nombre debe estar entre 1 y 20 caracteres`;
        warningMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
        warningMessage += `    <span aria-hidden="true">&times;</span>`;
        warningMessage += `    </button>`;
        warningMessage += `</div>`;
        document.getElementById('alertArea').innerHTML = warningMessage + document.getElementById('alertArea').innerHTML;
        // setTimeout(() => {
        //     document.getElementById('createWarn1').remove();
        //     document.getElementById('appName').focus();
        // }, 4500);
        return;
    }

    if (data.description.length <= 0 || data.description.length >= 100) {
        let warningMessage = '';
        warningMessage += `<div id="createWarn2" class="alert alert-warning alert-dismissible fade show" role="alert">`;
        warningMessage += `    La descripción debe estar entre 1 y 100 caracteres`;
        warningMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
        warningMessage += `    <span aria-hidden="true">&times;</span>`;
        warningMessage += `    </button>`;
        warningMessage += `</div>`;
        document.getElementById('alertArea').innerHTML = warningMessage + document.getElementById('alertArea').innerHTML;
        // setTimeout(() => {
        //     document.getElementById('createWarn2').remove();
        //     document.getElementById('appDescription').focus();
        // }, 4500);
        return;
    }

    if (data.privacyLevel == '0') {
        let warningMessage = '';
        warningMessage += `<div id="createWarn3" class="alert alert-warning alert-dismissible fade show" role="alert">`;
        warningMessage += `    Debe seleccionar la privacidad`;
        warningMessage += `    <button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
        warningMessage += `    <span aria-hidden="true">&times;</span>`;
        warningMessage += `    </button>`;
        warningMessage += `</div>`;
        document.getElementById('alertArea').innerHTML = warningMessage + document.getElementById('alertArea').innerHTML;
        // setTimeout(() => {
        //     document.getElementById('createWarn3').remove();
        //     document.getElementById('appPrivacy').focus();
        // }, 4500);
        return;
    }

    data.privacyLevel = (data.privacyLevel == '1' ? 'PUBLIC' : 'PRIVATE');


    let session = localStorage.getItem('session') || sessionStorage.getItem('session');
    session = JSON.parse(session);
    let user = session.userID;
    let token = session.session;
    data.userID = user;

    fetch(`/api/user-applications?user=${user}&session=${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(reply => {
            return {
                ok: reply.ok,
                body: reply.json()
            }
        }).then(response => {
            response.body.then(res => {
                if (response.ok) {
                    $('#createAppModal').modal('hide');
                    window.location.reload();
                } else {
                    let errorMessage = '';
                    errorMessage += `<div id="createApplicationError1" class="alert alert-danger alert-dismissible fade show" role="alert">`;
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
                    //     document.getElementById('createApplicationError1').remove();
                    // }, 4500);
                }
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
}


//=============================================================================================
// Show file name modal callback
//=============================================================================================

let showFileNameToBeUploaded = (id) => {
    let fileName = $(`#${id}`).val();
    fileName = fileName.replace('C:\\fakepath\\', '');
    $(`#${id}`).next('.custom-file-label').html(fileName);
}