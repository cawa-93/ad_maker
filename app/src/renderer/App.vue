<template>
	<div id="#app">
		<md-toolbar class="md-accent">
			<router-link tag="md-button" to="/" active-class="md-raised" exact>Обзор</router-link>
			<router-link tag="md-button" to="/keywords" active-class="md-raised">Ключевые слова</router-link>
			<router-link tag="md-button" to="/bs_urls" active-class="md-raised">Быстрые ссылки</router-link>
			<router-link tag="md-button" to="/utm_mark" active-class="md-raised">Пометка ссылок</router-link>

			<md-button href="#/" class="md-icon-button"><md-icon>favorite</md-icon></md-button>
		</md-toolbar>
		<router-view></router-view>
	</div>
</template>

<script>
	import store from 'renderer/vuex/store'

	export default {
		store,
		mounted() {
			this.$electron.ipcRenderer.on('appMenu-onclick', (event, [MenuItem]) => {
				// MenuItem.enabled = false;
				// console.log(MenuItem);
			})
		}
	}
</script>

<style>
	@import url(https://fonts.googleapis.com/css?family=Lato:300);
	
</style>
