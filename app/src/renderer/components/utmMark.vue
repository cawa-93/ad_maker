<template>
	<div class="root">
		<md-layout md-row md-flex v-if="isDirectLoaded">
			<md-layout md-column class="scroll">

				<md-layout md-flex="60">
					<md-card>
						<md-card-header>
							<div class="md-title">Параметры пометки</div>
						</md-card-header>

						<md-card-content>
							<md-layout>
								<md-layout md-flex-xsmall="100" md-flex-medium="50" md-flex-large="33">
										<md-input-container>
											<label>Campaign Source</label>
											<md-input v-model="utm.utm_source"></md-input>
										</md-input-container>
								</md-layout>
								<md-layout md-flex-xsmall="100" md-flex-medium="50" md-flex-large="33">
										<md-input-container>
											<label>Campaign Medium</label>
											<md-input v-model="utm.utm_medium"></md-input>
										</md-input-container>
								</md-layout>
								<md-layout md-flex-xsmall="100" md-flex-medium="50" md-flex-large="33">
										<md-input-container>
											<label>Campaign Name</label>
											<md-input v-model="utm.utm_campaign"></md-input>
										</md-input-container>
								</md-layout>
								<md-layout md-flex-xsmall="100" md-flex-medium="50" md-flex-large="33">
										<md-input-container>
											<label>Campaign Term</label>
											<md-input v-model="utm.utm_term"></md-input>
										</md-input-container>
								</md-layout>
								<md-layout md-flex-xsmall="100" md-flex-medium="50" md-flex-large="33">
										<md-input-container>
											<label>Campaign Content</label>
											<md-input v-model="utm.utm_content"></md-input>
										</md-input-container>
								</md-layout>
								<md-layout md-flex="100">
									<md-checkbox class="md-caption" v-model="markAsAnchor">Set the campaign parameters in the fragment portion of the URL (not recommended).</md-checkbox>
								</md-layout>
							</md-layout>
						</md-card-content>
					</md-card>
				</md-layout>

				<md-layout md-flex="40">
					<md-card>
						<md-card-header>
							<div class="md-title">Пример результата</div>
						</md-card-header>

						<md-card-content>
							<p class="wrap md-subheading">
								{{exampleUrl}}
							</p>
						</md-card-content>
					</md-card>
				</md-layout>
			</md-layout>

			<md-layout class="right-sidebar" md-flex>
				<md-whiteframe>
					<md-list>
						<md-subheader>Ссылки для пометки</md-subheader>
						<md-list-item><md-radio v-model="type" id="type-main" name="type-main" md-value="main">Основные</md-radio></md-list-item>
						<md-list-item><md-radio v-model="type" id="type-fast" name="type-fast" md-value="fast">Быстрые</md-radio></md-list-item>
					</md-list>
					<md-list>
						<md-subheader>Действия</md-subheader>
						<md-list-item @click.native="mark">Пометить ссылки</md-list-item>
					</md-list>
					<md-list>
						<md-subheader>Теги для замены</md-subheader>
						<md-list-item v-for="item in templateTags" v-if="!(item.tag === '${fastlink_name}' && type === 'main')" @click.native="copy(item.tag)">
							<div class="md-list-text-container">
								<span>{{item.tag}}</span>
								<span>{{item.label}}</span>
								<md-tooltip md-direction="left">Нажмите чтобы скопировать</md-tooltip>
							</div>
						</md-list-item>
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
	import { mapGetters } from 'vuex'
	import libs from 'libs'
	import { clone } from 'lodash'

	/* eslint-disable no-template-curly-in-string */
	export default {
		name: 'utmMark',
		data () {
			return {
				type:         'main',
				markAsAnchor: false,
				utm:          {
					utm_source:   'yandex.com',
					utm_medium:   'cpc',
					utm_campaign: '{campaign_name}',
					utm_term:     '',
					utm_content:  '{group_name}'
				},
				templateTags: [{
					tag:   '{campaign_name}',
					label: 'Название кампании'
				}, {
					tag:   '{group_name}',
					label: 'Название групы'
				}, {
					tag:   '{ad_title}',
					label: 'Заголовок объявления'
				}, {
					tag:   '{fastlink_name}',
					label: 'Заголовок быстрой ссылки'
				}]
			}
		},
		computed: {
			...mapGetters(['isDirectLoaded']),
			exampleData () {
				const exampleData = {
					campaign_name: null,
					group_name:    null,
					ad_title:      null,
					fastlink_name: null,
					ad_url:        null
				}

				const directMap = this.$store.getters.directMap
				let isFastLinkFound = false
				let isAdFound = false

				for	(let c in directMap) {
					if (isFastLinkFound && isAdFound) break

					for	(let g in directMap[c].groups) {
						if (!isFastLinkFound && directMap[c].groups[g].fastLinks.length) {
							exampleData.fastlink_name = directMap[c].groups[g].fastLinks[0].title
							exampleData.fastlink_url = directMap[c].groups[g].fastLinks[0].url
							isFastLinkFound = true
						}
						if (!isAdFound && directMap[c].groups[g].ads.length) {
							exampleData.campaign_name = directMap[c].name
							exampleData.group_name = directMap[c].groups[g].name
							exampleData.ad_title = directMap[c].groups[g].ads[0].title
							exampleData.ad_url = directMap[c].groups[g].ads[0].url
							isAdFound = true
						}
					}
				}

				return exampleData
			},
			exampleUrl () {
				const utm = clone(this.utm)
				for (let param in utm) {
					for (let key in this.exampleData) {
						if (key === 'ad_url') continue

						const reg = new RegExp(`{${key}}`, 'g')
						utm[param] = utm[param].replace(reg, this.exampleData[key])
					}
				}
				return libs.utmMark(this.exampleData.ad_url, utm, this.markAsAnchor)
			}
		},
		methods: {
			mark (pathObj) {

			},
			copy (str) {
				this.$electron.clipboard.writeText(str)
			},
			clearTemplate () {
				this.$store.commit('CLEAR_KEYWORDS')
			}
		}
	}
	/* eslint-enable no-template-curly-in-string */
</script>

<style scoped>
	.root {
		height: calc(100vh - 64px);
	}

	.root > .md-layout {
		height: 100%;
	}

	.md-list, .md-card, .md-whiteframe {
		width: 100%;
	}

	.md-list-item-container span {
		flex: 1;
	}
	.md-list-item-container b {
		flex-basis: 40px;
	}

	.md-radio, label {
		cursor: pointer;
	}
	.scroll {
		overflow-y: auto
	}

	.md-caption {
		margin: 0;
	}

	.wrap {
		word-wrap: break-word;
	}
</style>
