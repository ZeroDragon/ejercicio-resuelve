# EXAMEN PARA CANDIDATOS

![CircleCi](http://magmalada.io/CircleCi/github/ZeroDragon/ejercicio-resuelve.svg "CircleCi") ![CodeCov](http://magmalada.io/CodeCov/github/ZeroDragon/ejercicio-resuelve.svg "CodeCov")

## Como levantar el servidor

- Copiar el archivo `env.example` a `.env`
- Cambiar el parámetro `API_ENDPOINT` en el `.env` a la url del endpoint de prueba (sin el path **facturas**, ej: `http://192.168.1.1/`)
- Crear la imagen de docker `$ docker build -t ejercicio .`
- Levantr el docker `$ docker run -p 8080:8080 ejercicio`
- En un navegador, ir a `http://localhost:8080/`

## Como correr las pruebas

- `$ yarn install`
- `$ yarn test`