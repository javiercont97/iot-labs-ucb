let container = document.getElementById('container');


let credentials = localStorage.getItem('session') || sessionStorage.getItem('session');
if (credentials == null) {
    window.location = '/';
} else {
    credentials = JSON.parse(credentials);

    fetch(`/api/devices?user=${credentials.userID}&session=${credentials.session}`, {
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
                    let devices = [];
                    devices = res.devices;

                    let devicesCards = [];
                    let addDeviceCard = '';
                    
                    addDeviceCard += '<div class="col-md-4 col-12 mt-2">'
                    addDeviceCard += `    <div class="card" style="width: 20rem;">`;
                    addDeviceCard += `        <div class="card-body">`;
                    addDeviceCard += `            <div class="row d-flex justify-content-center">`;
                    addDeviceCard += `                <button id="createDeviceButton" class="btn" data-toggle="modal" data-target="#createDeviceModal">`;
                    addDeviceCard += `                    <img height="200em" src="../../assets/img/icons/plus.black.svg" title="Crear Dispositivo"/>`;
                    addDeviceCard += `                </button>`;
                    addDeviceCard += `            </div>`;
                    addDeviceCard += `        </div>`;
                    addDeviceCard += `    </div>`;
                    addDeviceCard += `</div>`;

                    devicesCards.push(addDeviceCard);
                    devices.forEach(device => {
                        let currentDeviceCard = '';
                        currentDeviceCard += '<div class="col-md-4 col-12 mt-2">';
                        currentDeviceCard += `    <div class="card" style="width: 20rem;">`;
                        currentDeviceCard += `        <h3 class="card-header">`;
                        currentDeviceCard += `            ${device.name}`;
                        currentDeviceCard += `        </h3>`;
                        currentDeviceCard += `        <div class="card-body">`;
                        currentDeviceCard += `            <h6 class="card-title">`;
                        currentDeviceCard += `                Descripción`;
                        currentDeviceCard += `            </h6>`;
                        currentDeviceCard += `            <p class="card-text">`;
                        currentDeviceCard += `                ${device.description}`;
                        currentDeviceCard += `            </p>`;
                        currentDeviceCard += `            <div class="row d-flex justify-content-center">`;
                        currentDeviceCard += `                <button class="btn btn-primary")" data-toggle="modal" data-target="#updateDeviceModal-${device._id}">`;
                        currentDeviceCard += `                    <span>`;
                        currentDeviceCard += `                        <img src="../../assets/img/icons/pencil.white.svg" title="Editar"/>`;
                        currentDeviceCard += `                    </span>`;
                        currentDeviceCard += `                </button>`;
                        currentDeviceCard += `                <button class="btn btn-danger ml-1" data-toggle="modal" data-target="#deleteDeviceConfirmModal-${device._id}">`;
                        currentDeviceCard += `                    <span>`;
                        currentDeviceCard += `                        <img src="../../assets/img/icons/trash.white.svg" title="Eliminar"/>`;
                        currentDeviceCard += `                    </span>`;
                        currentDeviceCard += `                </button>`;
                        currentDeviceCard += `                <button class="btn btn-primary ml-1" onclick="copyApiKey('${device._id}','${device.apiKey}')">`;
                        currentDeviceCard += `                    <span>`;
                        currentDeviceCard += `                        <img src="../../assets/img/icons/copyApiKey.white.svg" title="Copiar API Key"/>`;
                        currentDeviceCard += `                    </span>`;
                        currentDeviceCard += `                </button>`;
                        currentDeviceCard += `            </div>`;
                        currentDeviceCard += `        </div>`;
                        currentDeviceCard += `    </div>`;
                        currentDeviceCard += `</div>`;

                        // ============= edit modal ===============
                        currentDeviceCard += `<div id="updateDeviceModal-${device._id}" class="modal fade" tabindex="-1">`;
                        currentDeviceCard += `    <div class="modal-dialog">`;
                        currentDeviceCard += `        <div class="modal-content">`;
                        currentDeviceCard += `            <div class="modal-header">`;
                        currentDeviceCard += `                <h5 class="modal-title">Editar dispositivo</h5>`;
                        currentDeviceCard += `                <button type="button" class="close" data-dismiss="modal" aria-label="Close">`;
                        currentDeviceCard += `                    <span aria-hidden="true">&times;</span>`;
                        currentDeviceCard += `                </button>`;
                        currentDeviceCard += `            </div>`;
                        currentDeviceCard += `            <div class="modal-body">`;
                        currentDeviceCard += `                <div class="form-group">`;
                        currentDeviceCard += `                    <label for="deviceName-${device._id}">Nombre</label>`;
                        currentDeviceCard += `                    <input type="text" class="form-control" id="deviceName-${device._id}" aria-describedby="deviceName-${device._id}" value="${device.name}">`;
                        currentDeviceCard += `                </div>`;
                        currentDeviceCard += `                <div class="form-group">`;
                        currentDeviceCard += `                    <label for="deviceDescription-${device._id}">Descripción</label>`;
                        currentDeviceCard += `                    <input type="text" class="form-control" id="deviceDescription-${device._id}" value="${device.description}">`;
                        currentDeviceCard += `                </div>`;
                        currentDeviceCard += `            </div>`;
                        currentDeviceCard += `            <div class="modal-footer">`;
                        currentDeviceCard += `                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>`;
                        currentDeviceCard += `                <button type="button" class="btn btn-primary" onclick="editDevice('${device._id}')">Actualizar</button>`;
                        currentDeviceCard += `            </div>`;
                        currentDeviceCard += `        </div>`;
                        currentDeviceCard += `    </div>`;
                        currentDeviceCard += `</div>`;

                        // ============= delete confirmation modal ===============
                        currentDeviceCard += `<div id="deleteDeviceConfirmModal-${device._id}" class="modal fade" tabindex="-1">`;
                        currentDeviceCard += `    <div class="modal-dialog">`;
                        currentDeviceCard += `        <div class="modal-content">`;
                        currentDeviceCard += `            <div class="modal-header">`;
                        currentDeviceCard += `                <h5 class="modal-title">Eliminar dispositivo</h5>`;
                        currentDeviceCard += `                <button type="button" class="close" data-dismiss="modal" aria-label="Close">`;
                        currentDeviceCard += `                    <span aria-hidden="true">&times;</span>`;
                        currentDeviceCard += `                </button>`;
                        currentDeviceCard += `            </div>`;
                        currentDeviceCard += `            ¿Esta seguro de que desea eliminar el dispositivo con ID "${device._id}"?`;
                        currentDeviceCard += `            <div class="modal-footer">`;
                        currentDeviceCard += `                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>`;
                        currentDeviceCard += `                <button type="button" class="btn btn-danger" onclick="deleteDevice('${device._id}')">Eliminar</button>`;
                        currentDeviceCard += `            </div>`;
                        currentDeviceCard += `        </div>`;
                        currentDeviceCard += `    </div>`;
                        currentDeviceCard += `</div>`;

                        devicesCards.push(currentDeviceCard);
                    });

                    container.innerHTML = devicesCards.join('\n');
                } else {
                    alert(res.err.message);
                    window.location = '/';
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
    navigator.clipboard.writeText(`deviceID: "${id}"\napiKey: "${apiKey}"`);
    alert('API key copiada');
}


let editDevice = (id) => {
    let data = {
        name: document.getElementById(`deviceName-${id}`).value,
        description: document.getElementById(`deviceDescription-${id}`).value
    }

    if (data.name.length <= 0 || data.name.length >= 20) {
        alert('El nombre debe estar entre 1 y 20 caracteres');
        document.getElementById(`appName-${id}`).focus();
        return;
    }

    if (data.description.length <= 0 || data.description.length >= 100) {
        alert('La descripción debe estar entre 1 y 100 caracteres');
        document.getElementById(`appDescription-${id}`).focus();
        return;
    }

    let session = localStorage.getItem('session') || sessionStorage.getItem('session');
    session = JSON.parse(session);
    let user = session.userID;
    let token = session.session;

    fetch(`/api/devices/${id}?user=${user}&session=${token}`, {
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
                    $(`#updateDeviceModal-${id}`).modal('hide');
                    window.location.reload();
                } else {
                    alert(res.err.message);
                }
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
}

let deleteDevice = (id) => {
    console.log(id);
    console.log('Delete app');


    let session = localStorage.getItem('session') || sessionStorage.getItem('session');
    session = JSON.parse(session);
    let user = session.userID;
    let token = session.session;


    fetch(`/api/devices/${id}?user=${user}&session=${token}`, {
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
                    alert(res.err.message);
                }
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
}

//=============================================================================================
// Create modal callbacks
//=============================================================================================

let createDevice = () => {
    let data = {
        name: document.getElementById('deviceName').value,
        description: document.getElementById('deviceDescription').value
    }

    if (data.name.length <= 0 || data.name.length >= 20) {
        alert('El nombre debe estar entre 1 y 20 caracteres');
        document.getElementById('appName').focus();
        return;
    }

    if (data.description.length <= 0 || data.description.length >= 100) {
        alert('La descripción debe estar entre 1 y 100 caracteres');
        document.getElementById('appDescription').focus();
        return;
    }

    let session = localStorage.getItem('session') || sessionStorage.getItem('session');
    session = JSON.parse(session);
    let user = session.userID;
    let token = session.session;

    data.userID = user;

    fetch(`/api/devices?user=${user}&session=${token}`, {
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
                    $('#createDeviceModal').modal('hide');
                    window.location.reload();
                } else {
                    alert(res.err.message);
                }
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
}