import paho.mqtt.client as mqtt
from time import sleep
from gpiozero import RGPLED, PWMLED, MCP3008

sensor = MCP3008(channel = 0)
rgb = RGBLED(17, 27, 22, active_high=False)
led = PWMLED(23)

def onConnect ( client, userdata, flags, rc ):
    print ( "Connected" )
    # Subscribirse al los topics del RGB, red, green y blue
    client.subscribe ("iotlabs/rgb/red")
    client.subscribe ("iotlabs/rgb/green")
    client.subscribe ("iotlabs/rgb/blue")
    # Subscribirse al topic del LED con PWM, pwm
    client.subscribe ("iotlabs/pwm")

def onMessage ( client, userdata, message ):
    # Comparar el topic del mensaje recibido con el deseado
    if message.topic == "iotlabs/rgb/red":
        # Decodificar el payload con el encoding UTF-8 para conviertirlo en string
        if message.payload.decode ("utf-8") == "on":
        # Encender el led Rojo del RGB
        rgb.value = (1, rgb.value[1], rgb.value[2] )
        else:
        # Apagar el led Rojo del RGB
        rgb.value = (0, rgb.value[1], rgb.value[2] )
    elif message.topic == "iotlabs/rgb/green":
        if message.payload.decode ("utf-8") == "on":
        # Encender el led Verde del RGB
        rgb.value = (rgb.value[0], 1, rgb.value[2] )
        else:
        # Apagar el led Verde del RGB
        rgb.value = (rgb.value[0], 0, rgb.value[2] )
    elif message.topic == "iotlabs/rgb/blue":
        if message.payload.decode ("utf-8") == "on":
        # Encender el led Azul del RGB
        rgb.value = (rgb.value[0], rgb.value[1], 1 )
        else:
        # Apagar el led Azul del RGB
        rgb.value = (rgb.value[0], rgb.value[1], 0 )
    elif message.topic == "iotlabs/pwm":
        # Modificar el ciclo de trabajo del LED con PWM al valor recibido en el payload
        led.value = float ( message.payload )

# Configurar el cliente
deviceID = "ID del dispositivo"
deviceAPIkey = "API key del dispositivo"
client = mqtt.Client ( deviceID )
client.on_connect = onConnect
client.on_message = onMessage

# Conectarse al Broker
client.connect ( "imt-iotlabs.net" )
# Proporcionar las credenciales al Broker
client.username_pw_set ( deviceID, deviceAPIkey )

# Iniciar el loop de eventos del cliente MQTT
client.loop_start ()

# Publicar las lecturas del sensor analógico LM35 conectado al canal 0 del MCP3008 en grados centígrados con un intervalo de 2 segundos
for i in range ( 100 ):
    client.publish ( "iotlabs/temperature", str ( sensor.value * 3.3 * 100 ) )
    sleep (2)

client.loop_stop ()