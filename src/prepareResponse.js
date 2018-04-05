import { stringToDate } from './worker'

/**
 * prepareResponse: Esto transforma el resultado del woker en
 *                  algo más digerible con la suma de resultados
 *                  Mantiene un tracking de cada resultado para
 *                  observar si es un resultado numérico o error
 * @input  {Object} el objeto de respuesta del worker
 * @return {Object} el resultado preparado para lectura
 */
export const prepareResponse = input => {
  const { results, numberOfCalls, elapsedMs } = input
  const details = results
    .map(item => {
      item.start = stringToDate(item.start)
      item.finish = stringToDate(item.finish)
      return item
    })
    .sort((previous, current) => {
      if (previous.start > current.start) return 1
      if (previous.start < current.start) return -1
      return 0
    })
  const total = details
    .map(({result}) => parseInt(result, 10))
    .filter(count => !isNaN(count))
    .reduce((prev, actual) => prev + actual)
  return {total, numberOfCalls, elapsedMs, details}
}
