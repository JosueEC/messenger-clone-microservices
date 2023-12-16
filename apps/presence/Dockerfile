FROM node

# Esta ruta es la que por lo comun se usa para bindear los
# proyectos, dentro podemos bindear los archivos que estemos
# definiendo en este Dockerfile
WORKDIR /usr/src/app

# Por ejemplo, aqui solo estamos bindeando los archivos
# package.json y package-lock.json(*.json)
COPY package*.json .

# Y una vez que se crea el contenedor, ejecutamos npm install
# para instalar todas las dependencias del package.json en la
# ruta definida en el WORKDIR
RUN npm install

# Por ultimo, copiamos todos los archivos de codigo de este
# directorio local, en la ruta del WORKDIR
COPY . .

# En si, un Dockerfile define toda la configuracion para
# crear una copia de nuestro proyecto local dentro del
# container y poder ejecutarlo dentro del mismo.