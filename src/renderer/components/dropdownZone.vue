<template>
	<div 
		class="dropdown-zone-root"
		@click="openFile"
		@drop.prevent="loadFiles"
		@dragover.prevent="isDragover = true"
		@dragleave.prevent="isDragover = false"
	>
		<div class="dashed">
			<v-icon x-large>file_upload</v-icon>
			<slot class="dropdown-zone-content"></slot>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'dropdownZone',
		data () {
			return {
				isDragover: false,
			}
		},
		methods: {
			loadFiles (e) {
				this.isDragover = false
				this.$emit('input', e.dataTransfer.files[0].path)
			},
			openFile () {
				const path = this.$electron.remote.dialog.showOpenDialog()
				if (path && path[0]) {
					this.$emit('input', path[0])
				}
			},
		},
	}
</script>

<style scoped>
	.dropdown-zone-root {
		padding: 10px;
	}
	.dropdown-zone-root, .dashed {
		width: 100%;
		height:100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		cursor: pointer;
		transition: border-color .2s, background .2s, color .2s;
	}
	.dashed {
		border: 3px dashed transparent;
	}
	.dropdown-zone-root:hover {
		background: #3f51b5;
		color: #fff;
	}
	.dropdown-zone-root:hover .dashed {
		border-color: #fff;
	}
	
	.icon {
    padding: 19px;
    box-sizing: content-box;
    border-radius: 5px;
		margin: 0;
	}
	.dropdown-zone-content {
		pointer-events: none !important;
	}
</style>
