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

				<v-list-tile avatar @click="modals.keywords.visible = true">
					<v-list-tile-avatar>
						<v-icon dark class="indigo">vpn_key</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title>Ключевые слова</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<v-list-tile avatar @click="modals.fastLinks.visible = true">
					<v-list-tile-avatar>
						<v-icon dark class="green">link</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title>Быстрые ссылки</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<v-list-tile avatar @click="modals.tagging.visible = true">
					<v-list-tile-avatar>
						<v-icon dark class="orange">local_offer</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title>Пометку ссылок</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>

				<v-divider/>

				<v-subheader inset>Кампании</v-subheader>

				<v-list-tile @click="modals.direct.visible = true">
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

				<v-list-tile action avatar @click.stop>
					<v-list-tile-avatar>
						<v-icon>lightbulb_outline</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title>Темная тема</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action class="text-xs-right">
						<span class="btn btn--icon btn--raised"	>
							<v-switch hide-details v-model="darkMode"></v-switch>
						</span>
					</v-list-tile-action>
				</v-list-tile>

				<v-list-tile @click="modals.help.visible = true">
					<v-list-tile-avatar>
						<v-icon>help</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title>Справка</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</editor>

		<modal v-model="modals.help.visible" title="Горячие клавиши" :width="400">
			<help-center/>
		</modal>

		<modal :value="modals.direct.visible || !isDirectLoaded" title="Выберите файл с кампаниями" color="purple"
			:loader="modals.direct.loader"
			:closable="isDirectLoaded && modals.direct.closable"
			@input="value => { modals.direct.visible = value }"
		>
			<file-loader type="direct" action="Direct/initStack" color="purple"
				@start-load="onStartLoad('direct')"
				@load="onLoad('direct'); type='ads'"
			/>
		</modal>

		<modal v-model="modals.keywords.visible" title="Выберите файл с ключевыми словами" color="indigo"
			:closable="modals.keywords.closable"
			:loader="modals.keywords.loader"
		>
			<file-loader type="keywords" action="Direct/setKeywords" color="indigo"
				@start-load="onStartLoad('keywords')"
				@load="onLoad('keywords'); type='ks'"
			/>
		</modal>

		<modal v-model="modals.fastLinks.visible" title="Выберите файл с быстрыми ссылками" color="green"
			:closable="modals.fastLinks.closable"
			:loader="modals.fastLinks.loader"
		>
			<file-loader type="fastLinks" action="Direct/setFastLinks" color="green"
				@start-load="onStartLoad('fastLinks')"
				@load="onLoad('fastLinks'); type='fs'"
			/>
		</modal>

		<modal v-model="modals.tagging.visible" title="Настройте шаблон пометки" color="orange"
			:closable="modals.tagging.closable"
			:loader="modals.tagging.loader"
		>
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
				modals: {
					direct: {
						visible: false,
						loader: false,
						closable: true,
					},
					keywords: {
						visible: false,
						loader: false,
						closable: true,
					},
					fastLinks: {
						visible: false,
						loader: false,
						closable: true,
					},
					tagging: {
						visible: false,
						loader: false,
						closable: true,
					},
					help: {
						visible: false,
						loader: false,
						closable: true,
					},
				},
			}
		},
		computed: {
			darkMode: {
				get () {
					return this.$store.state.Theme.darkMode
				},
				set (value) {
					return this.$store.commit('Theme/TOGGLE', value)
				},
			},
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
			onStartLoad (type) {
				this.modals[type].closable = false
				this.modals[type].loader = true
			},
			onLoad (type) {
				this.modals[type].visible = false
				this.modals[type].loader = false
				this.modals[type].closable = true
			},
		},
		mounted () {
			window.addEventListener('keyup', (event) => {
				if (event.key === 'F1') {
					this.modals.help.visible = !this.modals.help.visible
				} else if (this.isDirectLoaded && event.ctrlKey) {
					switch (event.key) {
					case 'o' : this.modals.direct.visible = true; break
					case 's' : this.save(); break
					}
				}
			}, true)
		},
	}
</script>