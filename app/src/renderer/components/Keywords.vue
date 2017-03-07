<template>
	<div class="root">
		<md-layout md-gutter md-flex v-if="isDirectLoaded">
			<md-layout md-flex v-if="!template">
				<md-whiteframe>
					<dropdown-zone @drop="onDrop">
						<p class="md-title">Выберите файл сожержащий ключевые слова</p>
						<table v-if="type === 'custom'" class="md-caption" cellspacing="0">
							<tr><th>Кампания</th><th>Группа</th><th>Фраза</th></tr>
							<tr><td>Кампания_1</td><td>Группа_1</td><td>Фраза 1</td></tr>
							<tr><td>Кампания_1</td><td>Группа_2</td><td>Фраза 2</td></tr>
						</table>
					</dropdown-zone>
				</md-whiteframe>
			</md-layout>

			<md-layout md-flex v-else class="scroll">
				<md-whiteframe>
					<blockquote v-if="templateType === 'adwords'" class="md-warn">
						<span>Загрузка ключевых фраз из шаблона AdWords может работать не корректно. Используйте эту функцию на свой страх и риск.</span>
					</blockquote>
					<!--<md-card v-for="(row, index) in template" :key="index">
						<md-card-header>
							<div class="md-title">{{row.groupName}}</div>
							<div class="md-subhead">{{row.campaignName}}</div>
						</md-card-header>

						<md-card-content>
							<md-chips v-model="row.keywords" md-input-placeholder="Добавить фразу">
								<template scope="chip">{{ chip.value }}</template>
							</md-chips>
						</md-card-content>
					</md-card> -->
				</md-whiteframe>
			</md-layout>

			<md-layout class="right-sidebar" md-flex>
				<md-whiteframe>
					<md-list v-if="!template">
						<md-subheader>Тип шаблона {{type}}</md-subheader>
						<md-list-item><md-radio v-model="type" id="type-custom" name="type-custom" md-value="custom">Из Excel</md-radio></md-list-item>
						<md-list-item><md-radio v-model="type" id="type-adwords" name="type-adwords" md-value="adwords">Из AdWords</md-radio></md-list-item>
					</md-list>
					<md-list v-else>
						<md-subheader>Действия</md-subheader>
						<md-list-item @click.native="saveKeywords">Записать в кампании</md-list-item>
						<md-list-item @click.native="clearTemplate">Очистить</md-list-item>
					</md-list>
					<md-list v-if="pathHistory.length">
						<md-subheader>Последние файлы</md-subheader>
						<md-list-item v-for="path_obj in pathHistory" :key="path_obj.path" @click.native="setTemplate(path_obj)">{{path_obj.path | basename}}</md-list-item>
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
		name:       'keywords',
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
				pathHistory: state => state.direct.keywordsPathHistory,
				template:    state => {
					if (!state.direct.keywordsTemplate || !state.direct.keywordsTemplate.length) return null

					const _map = []
					state.direct.keywordsTemplate.forEach(([campaignName, groupName, keyword]) => {
						let campaign = _map.find(m => m.campaignName === campaignName && m.groupName === groupName)
						if (!campaign) {
							campaign = {campaignName, groupName, keywords: []}
							_map.push(campaign)
						}
						campaign.keywords.push(keyword)
					})
					return _map
				}
			})
		},

		methods: {
			onDrop (fullPath) {
				this.setTemplate({type: this.type, path: fullPath})
			},
			setTemplate (pathObj) {
				if (!pathObj.type) pathObj.type = this.type
				this.$store.dispatch('SET_KEYWORDS_TEMPLATE', pathObj)
				this.templateType = pathObj.type

				this.saveKeywords()
			},
			saveKeywords () {
				this.$store.dispatch('SET_KEYWORDS', this.template)
			},
			clearTemplate () {
				this.$store.dispatch('CLEAR_KEYWORDS')
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
	}

	table {
		border-left: 1px solid rgba(0, 0, 0, 0.2);;
		border-right: 1px solid rgba(0, 0, 0, 0.2);;
	}

	table.md-caption td, table.md-caption th {
		padding: 5px 15px;
		border-left: 1px solid rgba(0, 0, 0, 0.2);;
		border-right: 1px solid rgba(0, 0, 0, 0.2);;
		border-top: 1px solid rgba(0, 0, 0, 0.2);;
	}	
	table.md-caption th {
		border-top: none;		
	}
</style>
