<template>
	<div class="root">
		<div class="button-container" v-if="button.isShow">
			<md-button class="md-fab" :disabled="button.isDisabled" @click="sendUpdateCommand">
				<md-icon>{{button.icon}}</md-icon>
			</md-button>
			<md-tooltip md-direction="right">{{button.tooltip}}</md-tooltip>
			<md-spinner :md-size="74" :md-stroke="2.2" :md-progress="progressBar.percent" v-if="progressBar.isShow"></md-spinner>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'updateButton',
		data () {
			return {
				button: {
					isDisabled: true,
					isShow:     false,
					icon:       'cloud_download',
					tooltip:    'Загрузка обновления'
				},
				progressBar: {
					isShow:  false,
					percent: 0
				}
			}
		},
		methods: {
			sendUpdateCommand () {
				this.$electron.ipcRenderer.send('update-install')
			}
		},
		mounted () {
			this.$electron.ipcRenderer.on('update-available', () => {
				this.button.isShow = true
				this.button.isDisabled = true
				this.progressBar.isShow = true
			})

			this.$electron.ipcRenderer.on('update-progress', (event, progress) => {
				this.button.isShow = true
				this.progressBar.isShow = true
				this.progressBar.percent = progress.percent
			})

			this.$electron.ipcRenderer.on('update-downloaded', () => {
				this.button.isShow = true
				this.progressBar.isShow = false
				this.button.isDisabled = false
				this.button.icon = 'cloud_done'
				this.button.tooltip = 'Кликните чтобы установить обновление'
			})

			this.$electron.ipcRenderer.on('update-error', () => {
				this.button.isShow = true
				this.progressBar.isShow = false
				this.button.isDisabled = true
				this.button.icon = 'cloud_off'
				this.button.tooltip = 'При загрузке обновления произошла ошибка'
			})
		}
	}
</script>

<style scoped>
	.button-container {
		width: 56px;
		height: 56px;
		position: absolute;
		bottom: 20px;
		left: 20px;
		z-index: 100;
	}
	.md-fab {
		margin: 0;
	}
	.md-button[disabled].md-fab {
		background-color: #e1e1e1;
	}

	.md-spinner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
