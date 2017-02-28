<template>
	<div id="#app">
		<md-toolbar class="md-primary main-header">
			<router-link to="/" class="md-button md-dense" :class="`md-theme-${$material.currentTheme}`"  active-class="md-raised" exact>Обзор <md-ink-ripple /></router-link>
			<router-link to="/keywords" class="md-button md-dense" :class="`md-theme-${$material.currentTheme}`"  active-class="md-raised" exact>Ключевые слова <md-ink-ripple /></router-link>
			<router-link to="/fastLinks" class="md-button md-dense" :class="`md-theme-${$material.currentTheme}`"  active-class="md-raised" exact>Быстрые ссылки <md-ink-ripple /></router-link>
			<router-link to="/utm" class="md-button md-dense" :class="`md-theme-${$material.currentTheme}`"  active-class="md-raised" exact>Пометка ссылок <md-ink-ripple /></router-link>

			<md-button @click.native="$electron.shell.openExternal('https://www.liqpay.com/ru/checkout/kozack')" class=" donate">
				<md-icon>favorite</md-icon>
				<md-tooltip md-direction="bottom">Поддержать проект</md-tooltip>
			</md-button>
		</md-toolbar>
		<transition name="fade" mode="out-in">
			<router-view></router-view>
		</transition>

		<update-button></update-button>
	</div>
</template>

<script>
	import store from 'renderer/vuex/store'
	import updateButton from 'components/updateButton'

	export default {
		store,
		components: { updateButton },
		data () {
			return {
				snackbar: {
					text: ''
				}
			}
		},
		mounted () {
			this.$electron.ipcRenderer.on('appMenu-onclick', (event, [MenuItem]) => {
				if (!MenuItem.id) return
				switch (MenuItem.id) {
				case 'open' :
					let openPath = this.$electron.remote.dialog.showOpenDialog()
					if (openPath && openPath[0]) { this.$store.dispatch('INIT_DIRECT', {path: openPath[0]}) }
					return
				case 'save' :
					let savePath = this.$electron.remote.dialog.showSaveDialog()
					if (savePath) { this.$store.dispatch('SAVE_DIRECT', {path: savePath}) }
					return
				case 'clear-direct' :
					this.$store.dispatch('CLEAR_DIRECT')
					return
				case 'clear-keywords' :
					this.$store.dispatch('CLEAR_KEYWORDS')
					return
				case 'clear-fastLinks' :
					this.$store.dispatch('CLEAR_FASTLINKS')
					return
				case 'clear-all' :
					this.$store.dispatch('CLEAR_ALL')
					return
				case 'about' :
					this.$router.push('about')
					return
				case 'next-tab' :
					switch (this.$route.name) {
					case 'View' : this.$router.push({name: 'Keywords'}); return
					case 'Keywords' : this.$router.push({name: 'FastLinks'}); return
					case 'FastLinks': this.$router.push({name: 'UtmMark'}); return
					case 'UtmMark' : this.$router.push({name: 'View'}); return
					default : this.$router.push({name: 'View'})
					}
					return
				case 'before-tab' :
					switch (this.$route.name) {
					case 'View' : this.$router.push({name: 'UtmMark'}); return
					case 'UtmMark' : this.$router.push({name: 'FastLinks'}); return
					case 'FastLinks': this.$router.push({name: 'Keywords'}); return
					case 'Keywords' : this.$router.push({name: 'View'}); return
					default : this.$router.push({name: 'View'})
					}
					return
				case 'goto' :
					this.$router.push({name: MenuItem.to})
					return
				case 'undo' :
					this.$store.dispatch('UNDO')
					return
				case 'redo' :
					this.$store.dispatch('REDO')
					return
				}
			})
		}
	}
</script>

<style scoped>
	.md-button.donate {
		margin-left: auto;
		margin-right: 10px;
	}
</style>

<style>
	body {
		overflow: hidden;
	}
	.fade-enter-active, .fade-leave-active {
		transition: opacity 0.125s ease-out;
	}

	.fade-enter, .fade-leave-to {
		opacity: 0;
	}

	.direct-first-error {
		display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
	}
	.direct-first-error > .md-icon {
		margin: 0;
	}

	.right-sidebar {
		flex-basis: 300px;
		max-width: 300px;
	}
</style>
