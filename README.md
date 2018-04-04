EXAMEN PARA CANDIDATOS  
======================

## Modo de uso



## Requerimientos

Una de las funciones más importantes de la plataforma Enconta, es que se des- carguen las facturas emitidas a y por nuestros clientes. Esto lo hacemos con un servicio que hace crawling de la página de hacienda y descarga por periodos de tiempo las facturas.  

El problema con el que nos encontramos es que cuando le pides las facturas entre dos fechas, si hay más de 500 resultados, te da un error que sólo dice “hay más de 500 resultados”. Esto hace muy complicado sacar una cuenta real de cuántas facturas tiene nuestro cliente en un periodo determinado.  

Tú debes resolver el mismo problema. Tienes que conectarte a un pequeño ser- vicio web y decirme cuántas facturas hay en el 2017 para un cierto id.  

Los parámetros de conexión son:

 - URL: http://34.209.24.195/facturas

Parámetros:

 - id 4e25ce61-e6e2-457a-89f7-116404990967 - start una fecha en formato YYYY-MM-DD
 - finish una fecha en formato YYYY-MM-DD

Por ejemplo:

```
  $ curl http://34.209.24.195/facturas\?id\=4e25ce61-e6e2-457a-89f7-116404990967\&start\=2017-01-01\&finish\=2017-01-11
  > 36
  $ curl http://34.209.24.195/facturas\?id\=4e25ce61-e6e2-457a-89f7-116404990967\&start\=2017-01-01\&finish\=2017-03-30
  > "Hay más de 100 resultados"
```

La respuesta va a ser en formato JSON, una de 3 cosas:

 - “Te faltan parámetros” si te falta algún dato.  
 - “Hay más de 100 resultados” si hay más de 100 resultados.  
 - el número de resultados caso de que sean menos de 100.  

Levanta un repo nuevo en tu GitHub, en el lenguaje que quieras, y haz un programa que se conecte a ese endpoint y saque, en el menor número de llamadas posibles, cúantas facturas tiene ese id.

Necesito que en el README de tu repo me des instrucciones de cómo correr tu aplicación y necesito que ésta me devuelva, el número de llamadas que hizo y el número de facturas que cree que hay.

QUÉ VAMOS A EVALUAR?  

- Qué tan eficiente es tu algoritmo.  
- Qué tan limpio y documentado está tu código.  
- Tu uso de git.  
- Puntos extra si haces TDD.  