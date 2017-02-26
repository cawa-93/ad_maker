<template>
	<div id="#app">
		<md-toolbar class="md-primary main-header">
			<router-link tag="md-button" to="/" class="md-dense" active-class="md-raised" exact>Обзор</router-link>
			<router-link tag="md-button" to="/keywords" class="md-dense" active-class="md-raised">Ключевые слова</router-link>
			<router-link tag="md-button" to="/fastLinks" class="md-dense" active-class="md-raised">Быстрые ссылки</router-link>
			<router-link tag="md-button" to="/utm" class="md-dense" active-class="md-raised">Пометка ссылок</router-link>

			<md-button @click.native="$electron.shell.openExternal('https://www.liqpay.com/ru/checkout/kozack')" class=" donate">
				<md-icon>favorite</md-icon>
				<md-tooltip md-direction="bottom">Поддержать проект</md-tooltip>
			</md-button>
		</md-toolbar>
		<transition name="fade" mode="out-in">
			<keep-alive>
			<router-view></router-view>
			</keep-alive>
		</transition>

		<md-snackbar md-position="bottom center" ref="snackbar" :md-duration="4000">
			<span>{{snackbar.text}}</span>
			<md-button class="md-accent" @click.native="$refs.snackbar.close()">
				<md-icon>close</md-icon>
			</md-button>
		</md-snackbar>
	</div>
</template>

<script>
	import store from 'renderer/vuex/store'
	import * as types from 'renderer/vuex/mutation-types'

	export default {
		store,
		data() {
			return {
				snackbar: {
					text: ''
				}
			}
		},
		mounted() {
			this.$electron.ipcRenderer.on('appMenu-onclick', (event, [MenuItem]) => {
				if (!MenuItem.id) return;
				switch (MenuItem.id) {
					case 'open' :
						const path = this.$electron.remote.dialog.showOpenDialog();
						if (path && path[0])
							this.$store.dispatch('INIT_DIRECT', {path: path[0]})
					break;
					case 'clear-direct' :
						this.$store.commit('CLEAR_DIRECT')
					break;
					case 'clear-keywords' :
						this.$store.commit('CLEAR_KEYWORDS')
					break;
					case 'clear-all' :
						this.$store.dispatch('CLEAR_ALL')
					break;
					case 'about' :
						this.$router.push('about')
					break;
					case 'next-tab' :
						switch (this.$route.name) {
							case 'View'     : this.$router.push({name: 'Keywords'}) ; break;
							case 'Keywords' : this.$router.push({name: 'FastLinks'}); break;
							case 'FastLinks': this.$router.push({name: 'UtmMark'})  ; break;
							case 'UtmMark'  : this.$router.push({name: 'View'})     ; break;
							default : this.$router.push({name: 'View'});
						}
					break;
					case 'before-tab' :
						switch (this.$route.name) {
							case 'View'     : this.$router.push({name: 'UtmMark'})  ; break;
							case 'UtmMark'  : this.$router.push({name: 'FastLinks'}); break;
							case 'FastLinks': this.$router.push({name: 'Keywords'}) ; break;
							case 'Keywords' : this.$router.push({name: 'View'})     ; break;
							default : this.$router.push({name: 'View'});
						}
					break;
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