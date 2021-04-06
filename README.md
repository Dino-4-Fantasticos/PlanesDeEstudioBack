# Planes De Estudio - Back-end

Repositorio para el back-end de la página de Planes de Estudio ITESM

## Guía de contribución

```
## Descripción

Pequeña descripción de la tarea

## Checklist

* [ ] La branch que se está mergeando está actualizada con la branch objetivo
* [ ] Agregaron pruebas unitarias
* [ ] Todas las pruebas pasaron localmente

## Checado por:

* [ ] Adrián
* [ ] Ale
* [ ] Diego
* [ ] Luisito
```

## Instrucciones

### Instalación

Se corre el comando `npm i` para instalar todos los módulos especificados en package.json

### Variables de ambiente

Para el funcionamiento correcto de la aplicación localmente, se deberá crear un archivo `.env` en la carpeta base, en esta se agregarán las siguientes variables de ambiente que posteriormente el proyecto leerá:

```
ATLAS_URI=mongodb+srv://dino4fantasticos:dino4fantasticos@cluster0.lxfmw.mongodb.net/development?retryWrites=true&w=majority
```

### Correr proyecto localmente

Se puede utilizar el comando `npm start` como en todo proyecto de node, pero se recomienda correr `npm run dev` para correr el proyecto con nodemon, el cual actualizará los cambios necesarios cada que el archivo presente cambios.
