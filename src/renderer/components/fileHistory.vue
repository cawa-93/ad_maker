<template>
	<v-list two-line subheader v-if="files.length" class="pb-0">
		<v-divider/>
		<v-subheader inset>{{title}}</v-subheader>
		<v-divider/>
		<v-list-tile @click="emit(file.path)" v-for="file in files" :key="file.path">
			<v-list-tile-avatar>
				<v-icon :class="iconColor">insert_drive_file</v-icon>
			</v-list-tile-avatar>
			<v-list-tile-content>
				<v-list-tile-title>{{ file.base }}</v-list-tile-title>
				<v-list-tile-sub-title>{{ file.dir }}</v-list-tile-sub-title>
			</v-list-tile-content>
			<v-list-tile-action>
				<v-btn icon ripple @click.stop="remove(file.path)">
					<v-icon class="grey--text text--lighten-1">delete</v-icon>
				</v-btn>
			</v-list-tile-action>
		</v-list-tile>
	</v-list>
</template>

<script>
	import path from 'path'
	export default {
		name: 'fileHistory',
		props: {
			title: {
				type: String,
				default: 'Последние файлы',
			},
			type: {
				type: String,
				required: true,
			},
			maxPathLength: {
				type: Number,
				default: 30,
			},
		},
		data () {
			return {}
		},
		computed: {
			files () {
				return this.$store.getters[`RecentFiles/${this.type}`].map(filePath => {
					const fileData = path.parse(filePath)
					return {
						path: filePath,
						base: fileData.base,
						dir: this.getShortPath(fileData.dir)
					}
				})
			},
			iconColor() {
				switch (this.type) {
					case 'direct' : return 'purple'
					case 'keywords' : return 'green'
					case 'fastLinks' : return 'indigo'
				}
			}
		},
		methods: {
			emit (filePath) {
				this.$emit('input', filePath)
			},
			getShortPath (dir) {
				if (dir.length <= this.maxPathLength) return dir
				const cutSymbols = dir.length - this.maxPathLength + 1
				const startPosition = Math.floor((dir.length - cutSymbols) / 2)
				return dir.split('').splice(startPosition, cutSymbols, '…').join('')
			},

			remove(filePath) {
				this.$store.commit('RecentFiles/REMOVE', {type: this.type, filePath})
			}
		},
	}
</script>
