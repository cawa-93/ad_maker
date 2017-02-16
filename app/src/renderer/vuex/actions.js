import * as types from './mutation-types'
import libs from '../libs'

// export const decrementMain = ({ commit }) => {
//   commit(types.DECREMENT_MAIN_COUNTER)
// }

// export const incrementMain = ({ commit }) => {
//   commit(types.INCREMENT_MAIN_COUNTER)
// }

export const INIT_DIRECT = ({commit, state}, path) => {

  libs.parseCSV(libs.openFile(path), {
    // headers:true,
    delimiter: '\t',
    // quote: null,
    // escape: '"'
  })
  .then(fileContent => {
    if (!fileContent || !fileContent[0] || !fileContent[0][0] || fileContent[0][0] !== 'Предложение текстовых блоков для рекламной кампании') {
      throw 'Данный файл имеет не извесную структуру'
    }
    commit(types.CLEAR_DIRECT);
    commit(types.SET_DIRECT, fileContent);
    commit(types.SET_DIRECT_INDEX);
  })
  .catch(console.error)

}
