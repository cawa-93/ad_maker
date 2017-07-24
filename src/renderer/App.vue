<template>
  <div id="app">
  	<v-app dark standalone>
  		<v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-app>
  </div>
</template>

<script>
  export default {
  	name: 'command-editor',
  }
</script>

<style>
  html {
    overflow-y: auto !important;
  }
</style>