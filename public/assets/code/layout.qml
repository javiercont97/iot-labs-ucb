import QtQuick 2.12
import QtQuick.Controls 2.12

Item {
    id: root
    Column {
        id: col
        spacing: 5 // spacing determina la separaci?n entre componentes
        width: 300 // width determina el ancho de la columna, para esto es posible utilizar anchors.
        height: 300 // height determina el alto de la columna, para esto es posible utilizar anchors.

        Label {
            // Propiedades de Label
            text: 'This is a label (1)'
        }
        Button {
            // Propiedades de Button
            text: 'Button 1'
        }
        Row {
            // Es posible insertar elementos de layout dentro de otros
            Label {
                text: 'Row element 1'
            }
            Label {
                text: 'Row element 2'
            }
        }
    }

    Row {
        spacing: 5 // spacing determina la separaci?n entre componentes
        width: 300 // width determina el ancho de la fila, para esto es posible utilizar anchors.
        height: 300 // height determina el alto de la fila, para esto es posible utilizar anchors.

        anchors.top: col.bottom

        Label {
            // Propiedades de Label
            text: 'This is a label (2)'
        }
        Button {
            // Propiedades de Button
            text: 'This is a label (3)'
        }
        Column {
            // Es posible insertar elementos de layout dentro de otros
            Label {
                text: 'Column element 1'
            }
            Label {
                text: 'Column element 2'
            }
        }
    }

    Row {
        anchors.fill: parent // es posible utilizar anchors para algunas propiedades. En este caso la fila ocupar? todo el espacio (fill) de su elemento padre, id: root
        
    }
}