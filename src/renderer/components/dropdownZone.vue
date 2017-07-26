<template>
	<v-container 
		:class="classes"
		@click="openFile"
		@drop.prevent="loadFiles"
		@dragover.prevent="isDrag = true"
		@dragleave.prevent="isDrag = false"
	>
		<div class="dashed">
			<v-icon x-large :dark="isDrag">file_upload</v-icon>
			<p class="dropdown-zone-content">Перетащите файл сюда</p>
		</div>
	</v-container>
</template>

<script>
	export default {
		name: 'dropdownZone',
		props: {
			color: {
				type: String,
				default: 'grey',
			},
		},
		data () {
			return {
				isDrag: false,
			}
		},
		computed: {
			classes () {
				return {
					'dropdown-zone-root': true,
					[this.color]: this.isDrag,
					'white--text': this.isDrag,
				}
			},
		},
		methods: {
			loadFiles (e) {
				this.isDrag = false
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

	//  dropZone.ondragover = function() {
//     this.className = 'upload-drop-zone drop';
//     return false;
// }

// dropZone.ondragleave = function() {
//     this.className = 'upload-drop-zone';
//     return false;
// }
</script>

<style scoped>
	.dropdown-zone-root {
		padding: 10px;
		transition: .3s cubic-bezier(.25,.8,.25,1);
	}
	.dropdown-zone-root, .dashed {
		min-height: 150px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	.dashed {
		border: 3px dashed;
	}
	
	.icon {
		transition: none;
		color: inherit !important;
	}
	.dropdown-zone-content, .icon, .dashed {
		pointer-events: none !important;
		margin: 0;
	}
</style>
