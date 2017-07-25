<template>
  <div id="app">
  	<v-app :dark="darkMode" standalone>
  		<v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import {mapState} from 'vuex'
  export default {
  	name: 'command-editor',
    computed: mapState({
      darkMode: state => state.Theme.darkMode,
    })
  }
</script>

<style>
  html {
    overflow-y: auto !important;
  }
</style>