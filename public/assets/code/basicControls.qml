import QtQuick 2.12
import QtQuick.Controls 2.12

Item {
    id: root
    Column {
        anchors.centerIn: parent // Colocar la columna en el centro del elemento padre
        spacing: 50
        Label {
            text: "Hello world"
            font.pointSize: 25 // Cambiar el tama�o de la fuente a 25pt
        }

        Button {
            text: "Click me!"
            onClicked: {
            // Funci�n de JavaScript que se ejecuta cuando el bot�n es clickeado
            // En esta funci�n no se reciben argumentos. Sin embargo, es posible manipular otros elementos mediante el id
            }
        }

        Switch {
            text: "Switch me!"
            onCheckedChanged: {
                // Funci�n de JavaScript que se ejecuta cuando el switch cambia de estado
                // En esta funci�n se recibe el argumento checked. Tambi�n es posible manipular otros elementos mediante el id
                if (checked) {
                    // El switch esta encendido
                } else {
                    // El switch esta apagado
                }
            }
        }


        Slider {
            from: 0 // Valor minimo. El valor por omisi�n es 0
            to: 100 // Valor m�ximo. El valor por omisi�n es 1
            stepSize: 2 // Valor de los incrementos
            orientation: Qt.Vertical // El valor por omisi�n es Qt.Horizontal. Los valores posibles son Qt.Vertical y Qt.Horizontal
            
            onValueChanged: {
                // Funci�n de JavaScript que se ejecuta cuando el valor del Slider cambia
                // Esta funcion recibe el argumento value
                console.log ( value ); // Mostrar el valor del Slider en la consola del navegador
            }
        }
    }
}