<template>
  <div id="app">
  	<v-app :dark="darkMode" standalone>
  		<v-container fluid>
        <home/>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Home from '@/pages/Home'
export default {
	name: 'command-editor',
	components: { Home },
	computed: mapState({
		darkMode: state => state.Theme.darkMode,
	}),
}
</script>

<style>
  html {
    overflow-y: auto !important;
  }
</style>