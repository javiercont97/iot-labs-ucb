import QtQuick 2.12
import QtQuick.Controls 2.12
import Controls 1.0 // Importar controles avanzados

Item {
    id: root
    Column {
        anchors.centerIn: parent // Colocar la columna en el centro del elemento padre
        spacing: 50
        Dial {
            id: dial // Asignar el id dial
            from: 0 // Valor minimo. El valor por omisi�n es 0
            to: 100 // Valor m�ximo. El valor por omisi�n es 1
            stepSize: 2 // Valor de los incrementos
            onValueChanged: {
                // Funci�n de JavaScript que se ejecuta cuando el valor del Dial cambia
                // Esta funcion recibe el argumento value
                console.log ( value ); // Mostrar el valor del Dial en la consola del navegador
                gauge.value = value; // Cambiar el valor de gauge con el valor del Dial
            }
        }

        Gauge {
            id: gauge // Asignar el id gauge
            width: 200 // Determinar el ancho del gauge
            height: 200 // Determinar el alto del gauge
            min: 0 // Valor minimo. El valor por omisi�n es 0
            max: 100 // Valor m�ximo. El valor por omisi�n es 100
        }

        Gauge {
            width: 200 // Determinar el ancho del gauge
            height: 200 // Determinar el alto del gauge
            min: 0 // Valor minimo. El valor por omisi�n es 0
            max: 100 // Valor m�ximo. El valor por omisi�n es 100
            value: dial.value // Utilizar propery binding para asociar el valor del gauge con el de dial
        }
    }
}