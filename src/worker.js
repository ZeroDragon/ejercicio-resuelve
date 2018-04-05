import { queue } from 'async'
import { requestPromise } from './requestPromise'

// 8640000 es la cantidad de milisegundos en 1 día
const msInDay = 86400000

export const stringToDate = string => {
  const [year, month, day] = string.split('-').map(section => parseInt(section, 10))
  return new Date(year, month - 1, day)
}
export const addZ = i => `00${i}`.slice(-2)
export const dateToString = date => {
  return `${date.getFullYear()}-${addZ(date.getMonth() + 1)}-${addZ(date.getDate())}`
}
export const daysBetween = (init, end) => {
  return (end.getTime() - init.getTime()) / msInDay + 1
}

/**
 * getRanges: Determina la cantidad de dias a buscar entre dos fechas
 *            la cantidad de días proporcionada determina si se regresa
 *            uno o varios rangos de fechas
 * @start  {Date} la fecha inicial
 * @finish  {Date} la fecha final
 * @days  {int} la cantidad de días por rango
 * @return {Array} un arreglo de arreglos con rangos de fechas
 */
export const getRanges = (start, finish, days) => {
  const nextRange = days * msInDay
  const [msStart, msFinish] = [start.getTime(), finish.getTime()]
  let newMax = new Date(msStart + nextRange)
  if (days === 1) newMax = new Date(msStart)
  if (newMax.getTime() < msFinish) {
    const newStartNoOverlap = new Date(newMax.getTime() + msInDay)
    return [[dateToString(start), dateToString(newMax)]]
      .concat(getRanges(newStartNoOverlap, finish, days))
  } else {
    return [[dateToString(start), dateToString(finish)]]
  }
}

/**
 * prepareCalls: determina los rangos de fechas a regresar dependiendo
 *               de cuantos días haya entre las dos fechas ingresadas
 * @start  {string} formato YYYY-MM-DD
 * @finish  {string} formato YYYY-MM-DD
 * @return {Array} un arreglo de arreglos con rangos de fechas
 */
export const prepareCalls = (start, finish) => {
  const [init, end] = [stringToDate(start), stringToDate(finish)]
  const days = daysBetween(init, end)
  if (days > 30) return getRanges(init, end, 29)
  if (days > 15) return getRanges(init, end, 14)
  if (days > 7) return getRanges(init, end, 6)
  return getRanges(init, end, 1)
}

/**
 * worker: Regresa los resultados de las búsquedas y la cantidad de llamadas
 *          realizadas para obtener los resultados.
 * @resource  {string} el tipo del API endpoint
 * @id  {string} cuenta a obtener del endpoint
 * @start  {string} formato YYYY-MM-DD
 * @finish  {string} formato YYYY-MM-DD
 * @return {Object} Un objeto de respuesta con resultados y contador de llamadas
 */
export const worker = async (resource, id, start, finish) => {
  const results = []
  let numberOfCalls = 0
  const que = queue(async (params, cb) => {
    const result = await requestPromise(resource, id, params.start, params.finish)
    numberOfCalls += 1
    if (!isNaN(result)) {
      results.push({start: params.start, finish: params.finish, result})
    } else {
      const [init, end] = [stringToDate(params.start), stringToDate(params.finish)]
      const days = daysBetween(init, end)
      if (days === 1) {
        results.push({start: params.start, finish: params.finish, result})
      } else {
        const calls = prepareCalls(params.start, params.finish)
          .map(range => {
            return {start: range[0], finish: range[1]}
          })
        que.push(calls)
      }
    }
    cb()
  }, 10)
  que.push({start, finish})
  const retval = await new Promise(resolve => {
    que.drain = () => {
      if (que.running() + que.length() === 0) {
        resolve({results, numberOfCalls})
      }
    }
  })
  return retval
}
