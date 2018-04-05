import request from 'request'

const baseUrl = process.env.API_ENDPOINT

/**
 * default: simplemente engloba el módulo de request que usa
 *          callbacks para que regrese una promesa
 * @resource  {string} el tipo del API endpoint
 * @id  {string} cuenta a obtener del endpoint
 * @start  {string} formato YYYY-MM-DD
 * @finish  {string} formato YYYY-MM-DD
 * @return {Promise} regresa el resultado del endpoint o 'null'
 *                   si hay un error de conexion
 */
export const requestPromise = (resource, id, start, finish) => {
  return new Promise((resolve) => {
    request({
      method: 'GET',
      url: `${baseUrl}${resource}`,
      qs: {
        id,
        start,
        finish
      }
    }, (err, response, body) => {
      if (err) {
        resolve('null')
      } else {
        resolve(body)
      }
    })
  })
}
