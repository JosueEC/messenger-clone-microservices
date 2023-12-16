# Definimos a partir de que imagen de docker se va a construir esta imagen que estamos definiendo.
FROM node

# El WORKDIR es la ruta donde se almacenara la informacion de la aplicacion dentro del container de Docker. Por convencion se suele guardar en la carpeta user y dentro creamos el folder src donde guardamos la carpeta app, la cual contendra todos los archivos de nuestra aplicacion
WORKDIR /usr/src/app

# Ahora definimos que deseeamos copiar el package.json y el package-lock.json(*) en la ruta que definimos en el workdir. Para eso es el puntp despues de .json
COPY package*.json .

# Aqui definimos que comandos queremos que se ejecuten una vez se han completado las acciones anteriores. Aqui requerimos ejecutar npm install para instalar todas las dependencias del package.json
RUN npm install

# Y por ultimo copiamos todos los archivos de nuestra carpeta source en la misma ruta del container que definimos en el WORKDIR. Esto es lo que establce el . .
COPY . .

# Basicamente lo que hacemos es copiar los archivos de nuestro proyecto (package.json, package-lock.json, src/, test/, etc) en la ruta definida en el WORKDIR, la cual apunta al interior del conatiner de Docker que sera levantado.