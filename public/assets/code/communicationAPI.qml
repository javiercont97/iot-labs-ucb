import QtQuick 2.12
import QtQuick.Controls 2.12
import IMT.IoTLabsWS 1.0 // Importar el m�dulo de comunicaciones

Item {
    id: root
    IoTLabsWS {
        id: client
        host: "wss://imt-iotlabs.net"
        appID: "tu appID"
        apiKey: "tu api key"

        Component.onCompleted: {
            // Funci�n de JavaScript que se ejecuta cuando el componente termina de cargarse
            connectServer () // Conectarse al servidor
        }

        onConnectionEstablished: {
            // Funci�n de JavaScript que se ejecuta cuando se establece conexi�n
            subscribe ( "topic/to/subscribe" ) // Subscribirse al topic topic/to/subscribe
        }

        onCredentialsRejected: {
            // Funci�n de JavaScript que se ejecuta cuando las credenciales no son validas
        }

        onMessageRecieved: {
            // Funci�n de JavaScript que se ejecuta cuando se recibe un mensaje
            // En esta funci�n se recibe el argumento message
            let parsedMessage = JSON.parse ( message ) // Convertir el mensaje en un objeto de JavaScript

            if ( parsedMessage.topic == "topic/to/subscribe" ) {
            // Procesar el mensaje se debe acceder al mismo con parsedMessage.message
            console.log ( parsedMessage.message ) // Mostrar el mentaje recibido en la consola del navegador
            }
        }
    }

    Switch {
        anchors.centerIn: parent
        text: "Switch me!"
        
        onCheckedChanged: {
            // Funci�n de JavaScript que se ejecuta cuando el switch cambia de estado
            // En esta funci�n se recibe el argumento checked. Tambi�n es posible manipular otros elementos mediante el id
            if (checked) {
                client.publish ( "topic/to/publish", "switch_on") // Publicar el mentaje switch_on al topic topic/to/publish
            } else {
                client.publish ( "topic/to/publish", "switch_off") // Publicar el mentaje switch_off al topic topic/to/publish
            }
        }
    }
}