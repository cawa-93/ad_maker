<template>
	<div @keyup.esc="keyup">
		<editor v-if="isDirectLoaded" :type.sync="type">
			<v-list slot="menu" class="pa-0">

				<v-list-tile @click="loadState('prev')" :disabled="disableUndo">
					<v-list-tile-avatar>
						<v-icon>undo</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title>Отменить</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<v-list-tile @click="loadState('next')" :disabled="disableRedo">
					<v-list-tile-avatar>
						<v-icon>redo</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title>Повторить</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<v-divider/>

				<v-subheader inset>Добавить</v-subheader>

				<v-list-tile avatar @click="modals.keywords = true">
					<v-list-tile-avatar>
						<v-icon dark class="indigo">attach_file</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title>Ключевые слова</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<v-list-tile avatar @click="modals.fastLinks = true">
					<v-list-tile-avatar>
						<v-icon dark class="green">attach_file</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title>Быстрые ссылки</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<v-list-tile avatar @click="modals.tagging = true">
					<v-list-tile-avatar>
						<v-icon dark class="orange">local_offer</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title>Пометку ссылок</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<v-divider/>

				<v-subheader inset>Кампании</v-subheader>

				<v-list-tile @click="modals.direct = true">
					<v-list-tile-avatar>
						<v-icon>file_upload</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title>Загрузить</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<v-list-tile @click="save()">
					<v-list-tile-avatar>
						<v-icon>save</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title>Сохранить</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<v-divider/>

				<v-list-tile @click="modals.help = true">
					<v-list-tile-avatar>
						<v-icon>help</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title>Справка</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</editor>

		<!-- <v-speed-dial v-if="isDirectLoaded" v-model="speedDeal" fixed bottom right hover >
			<v-btn slot="activator" v-model="speedDeal" class="blue darken-2" fab hover v-tooltip:left="{ html: 'Добавить' }">
				<v-icon>add</v-icon>
				<v-icon>close</v-icon>
			</v-btn>
			<v-btn @click="modals.direct = true" fab small class="purple" v-tooltip:left="{ html: 'Кампании' }">
				<v-icon>attach_file</v-icon>
			</v-btn>
			<v-btn @click="modals.keywords = true" fab small class="green" v-tooltip:left="{ html: 'Ключевые слова' }">
				<v-icon>attach_file</v-icon>
			</v-btn>
			<v-btn @click="modals.fastLinks = true" fab small class="indigo" v-tooltip:left="{ html: 'Быстрые ссылки' }">
				<v-icon>attach_file</v-icon>
			</v-btn>			
			<v-btn @click="modals.tagging = true" fab small class="red" v-tooltip:left="{ html: 'Пометка ссылок' }">
				<v-icon>local_offer</v-icon>
			</v-btn>
		</v-speed-dial> -->

		<modal v-model="modals.help" title="Горячие клавиши" :width="400">
			<help-center/>
		</modal>

		<modal :value="modals.direct || !isDirectLoaded" @input="value => { modals.direct = value }" title="Выберите файл с кампаниями" :closable="isDirectLoaded" color="purple">
			<file-loader type="direct" action="Direct/initStack" @load="modals.direct = false; type='ads'" color="purple"/>
		</modal>

		<modal v-model="modals.keywords" title="Выберите файл с ключевыми словами" color="indigo">
			<file-loader type="keywords" action="Direct/setKeywords" @load="modals.keywords = false; type='ks'" color="indigo"/>
		</modal>

		<modal v-model="modals.fastLinks" title="Выберите файл с быстрыми ссылками" color="green">
			<file-loader type="fastLinks" action="Direct/setFastLinks" @load="modals.fastLinks = false; type='fs'" color="green"/>
		</modal>

		<modal v-model="modals.tagging" title="Настройте шаблон пометки" color="orange">
			<tag-editor @mark="t => {type = t === 'main' ? 'ads' : 'fs'; modals.tagging = false}"/>
		</modal>

	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
	import modal from '@/components/modal'
	import fileLoader from '@/components/fileLoader'
	import editor from '@/components/editor'
	import tagEditor from '@/components/tagEditor'
	import helpCenter from '@/components/helpCenter'
// Direct/setKeywords
	export default {
		name: 'Home',
		components: { modal, fileLoader, editor, tagEditor, helpCenter },
		data () {
			return {
				type: 'ads',
				speedDeal: false,
				modals: {
					direct: false,
					keywords: false,
					fastLinks: false,
					tagging: false,
					help: false,
				},
			}
		},
		computed: {
			...mapGetters({
				isDirectLoaded: 'Direct/isLoaded',
			}),
			disableUndo () {
				return !this.$store.state.Direct.prevStateId
			},
			disableRedo () {
				return !this.$store.state.Direct.nextStateId
			},
		},
		methods: {
			loadState (direction) {
				this.$store.dispatch('Direct/loadState', direction)
			},
			save () {
				this.$electron.remote.dialog.showSaveDialog(filePath => {
					if (filePath) {
						this.$store.dispatch('Direct/write', filePath)
					}
				})
			},
		},
		mounted () {
			window.addEventListener('keyup', (event) => {
				if (event.key === 'F1') {
					this.modals.help = !this.modals.help
				} else if (this.isDirectLoaded && event.ctrlKey) {
					switch (event.key) {
					case 'o' : this.modals.direct = true; break
					case 's' : this.save(); break
					}
				}
			}, true)
		},
	}
</script>