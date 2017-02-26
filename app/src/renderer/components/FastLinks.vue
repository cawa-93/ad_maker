<template>
	<div class="root">
		<md-layout md-gutter md-flex v-if="isDirectLoaded">
			<md-layout md-flex v-if="!template">
				<md-whiteframe>
					<dropdown-zone @drop="onDrop">
						<p class="md-title">Выберите файл сожержащий быстрые ссылки</p>
						<table v-if="type === 'custom'" class="md-caption" cellspacing="0">
							<tr><th>Кампания</th><th>Группа</th><th>Заголовок</th><th>URL</th><th>Описание</th><th>...</th></tr>
							<tr><td>Кампания_1</td><td>Группа_1</td><td>Заголовок</td><td>https://...</td><td>Описание</td><td>...</td></tr>
							<tr><td>Кампания_1</td><td>Группа_2</td><td>Заголовок</td><td>https://...</td><td>Описание</td><td>...</td></tr>
						</table>
					</dropdown-zone>
				</md-whiteframe>
			</md-layout>

			<md-layout md-flex v-else class="scroll">
				<md-whiteframe>
					<md-card v-for="row in template">
						<md-card-header>
							<div class="md-title">{{row.groupName}}</div>
							<div class="md-subhead">{{row.campainName}}</div>
						</md-card-header>

						<md-card-content>
							<!--TEMPLATE -->
						</md-card-content>
					</md-card>
				</md-whiteframe>
			</md-layout>

			<md-layout class="right-sidebar" md-flex>
				<md-whiteframe>
					<md-list v-if="!template">
						<md-subheader>Тип шаблона</md-subheader>
						<md-list-item><md-radio v-model="type" id="type-custom" name="type-custom" md-value="custom">Из Excel</md-radio></md-list-item>
						<md-list-item><md-radio disabled v-model="type" id="type-adwords" name="type-adwords" md-value="adwords">Из AdWords</md-radio></md-list-item>
					</md-list>
					<md-list v-else>
						<md-subheader>Действия</md-subheader>
						<md-list-item @click.native="savefastLinks">Записать в кампании</md-list-item>
						<md-list-item @click.native="clearTemplate">Очистить</md-list-item>
					</md-list>
					<md-list v-if="pathHistory.length">
						<md-subheader>Последние файлы</md-subheader>
						<md-list-item v-for="path_obj in pathHistory" @click.native="setTemplate(path_obj)">{{path_obj.path | basename}}</md-list-item>
					</md-list>
				</md-whiteframe>
			</md-layout>
		</md-layout>
		<div v-else class="direct-first-error">
			<md-icon  class="md-size-4x">error_outline</md-icon>
			<p class="md-title">Сначала нужно загрузить кампании</p>
			<p class="md-caption">Ctrl+O</p>
		</div>
	</div>
</template>

<script>
	import dropdownZone from './dropdownZone'
	import { mapState, mapGetters } from 'vuex'
	import path from 'path'

	export default {
		name:       'fastLinks',
		components: { dropdownZone },
		data () {
			return {
				type:         'custom',
				templateType: null
			}
		},

		computed: {
			...mapGetters(['isDirectLoaded']),
			...mapState({
				pathHistory: state => state.direct.fastLinksPathHistory,
				template:    state => {
					if (!state.direct.fastLinksTemplate || !state.direct.fastLinksTemplate.length) return null
					return state.direct.fastLinksTemplate
				}
			})
		},

		methods: {
			onDrop (fullPath) {
				this.setTemplate({type: this.type, path: fullPath})
			},
			setTemplate (pathObj) {
				if (!pathObj.type) pathObj.type = this.type
				this.$store.dispatch('SET_FASTLINKS_TEMPLATE', pathObj)
				this.templateType = pathObj.type
			},
			savefastLinks () {
				this.$store.dispatch('SET_FASTLINKS', this.template)
			},
			clearTemplate () {
				this.$store.commit('CLEAR_FASTLINKS')
			}
		},
		filters: {
			basename (fullPath) {
				return path.basename(fullPath)
			}
		}
	}
</script>

<style scoped>
	.root {
		height: calc(100vh - 64px);
	}

	.root > .md-layout {
		height: 100%;
	}

	.md-list {
		width: 100%;
	}

	.md-list-item-container span {
		flex: 1;
	}
	.md-list-item-container b {
		flex-basis: 40px;
	}
	.md-whiteframe {
		width: 100%;
	}

	.md-radio, label {
		cursor: pointer;
	}
	.scroll {
		overflow-y: auto
	}
	blockquote {
		border-left: 5px solid;
		align-items: center;
		padding: 5px 5px 5px 1em;
		display: flex;
	}

	blockquote.md-accent {
		border-left-color: rgb(68, 138, 255);
		background-color: rgba(68, 138, 255, 0.25);
		color: rgb(68, 138, 255);
	}
	blockquote.md-warn {
		border-left-color: rgb(230, 74, 25);
		background-color: rgba(230, 74, 25, 0.25);
		color: rgb(230, 74, 25);
		padding: 15px 1em;
	}
	blockquote > span {
		flex: 1;
	}
	.md-caption {
		margin: 0;
	}
	table.md-caption {
		border-collapse: collapse;
		border-spacing: 0px;
		width: 100%;
		max-width: 500px;
		text-align: center;
	}

	table {
		border-left: 1px solid rgba(0, 0, 0, 0.2);;
		border-right: 1px solid rgba(0, 0, 0, 0.2);;
	}

	table.md-caption td, table.md-caption th {
		padding: 5px;
		border-left: 1px solid rgba(0, 0, 0, 0.2);;
		border-right: 1px solid rgba(0, 0, 0, 0.2);;
		border-top: 1px solid rgba(0, 0, 0, 0.2);;
	}	
	table.md-caption th {
		border-top: none;		
	}
</style>
