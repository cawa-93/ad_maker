import { MAIN_LOCALSTORAGE_KEY } from './direct';
export default [
	store => store.subscribe((mutation, state) => localStorage.setItem(MAIN_LOCALSTORAGE_KEY, JSON.stringify(state)))
]