import mailjet = require('node-mailjet');
import { appLogger, HOST_URL } from '../../config/constants';

class Mailer {
    private static mailjet = mailjet.connect('a4c82f01ae8c4af028920c52363065fa', '1544ce6fff38e5aff2888f9c12444e3b');

    /**
     * 
     * @param id User ID
     * @param mail User's e-mail
     * @param name User's name
     */
    public static sendActivationEmail(id: string, mail: string, name: string): void {
        let request = this.mailjet.post('send', { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": "kelmorian.labs@gmail.com",
                            "Name": "Kelmorian Labs"
                        },
                        "To": [
                            {
                                "Email": mail,
                                "Name": name
                            }
                        ],
                        "Subject": "Activar cuenta",
                        "TextPart": "",
                        "HTMLPart": `<link href="https://bootstrapbuildspace.sfo2.cdn.digitaloceanspaces.com//FaMTgWDWqBvS/bQGzymUKfyyK/bootstrap.css" rel="stylesheet">
                                    <div class="container">
                                        <div class="row align-items-center justify-content-center">
                                            <div class="col-md4">
                                                <h3>Bienvenido a <a href='${HOST_URL}'>Kelmorian Labs</a>!</h3><br/>
                                            </div>
                                        </div>
                                        <div class="row align-items-center justify-content-center">
                                            <p>
                                                Para empezar a utilizar Kelmorian Labs activa tu cuenta haciendo click en el boton.
                                            </p><br/>
                                        </div>
                                        <div class="row align-items-center justify-content-center">
                                            <p>
                                                Si no creaste una cuenta ignora este mensage
                                            </p>
                                        </div>
                                        <div class="row align-items center justify-content-center">
                                            <a class="btn btn-primary" href='${HOST_URL}/api/activate-user?id=${id}'>Activar cuenta</a>
                                        </div>
                                    </div>`,
                        "CustomID": "AppGettingStartedTest"
                    }
                ]
            });

        request.then((res) => {
            appLogger.info('Mailer', JSON.stringify(res.body));
        }).catch(err => {
            appLogger.error('Mailer', JSON.stringify(err));
        });
    }
}

export default Mailer;