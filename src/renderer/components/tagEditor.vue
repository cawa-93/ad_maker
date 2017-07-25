<template><v-container>
<v-layout row>
  <v-flex xs5>
    <div>
    	<!-- <v-subheader>Ссылки для пометки</v-subheader> -->
    	<v-radio class="pa-0" hide-details label="Основные ссылки" v-model="type" value="main"></v-radio>
      <v-radio class="pa-0" hide-details label="Быстрые ссылки" v-model="type" value="fast"></v-radio>
    </div>

    <v-text-field v-model="utm.utm_source" label="Campaign Source"/>
    <v-text-field v-model="utm.utm_medium" label="Campaign Medium"/>
    <v-text-field v-model="utm.utm_campaign" label="Campaign Name"/>
    <v-text-field v-model="utm.utm_term" label="Campaign Term"/>
    <v-text-field v-model="utm.utm_content" label="Campaign Content"/>
    <v-btn class="orange" dark @click="mark">Пометить</v-btn>
  </v-flex>
  <v-flex xs7>
    <v-layout row wrap>
		  <v-flex xs12>
		    <v-list two-line>
		    	<v-list-tile v-for="tag in templateTags" :key="tag.tag" @click="copy(tag.tag)" v-tooltip:top="{ html: 'Скопировать' }">
			    	<v-list-tile-content>
							<v-list-tile-title>{{ tag.tag }}</v-list-tile-title>
							<v-list-tile-sub-title>{{ tag.label }}</v-list-tile-sub-title>
						</v-list-tile-content>
		    	</v-list-tile>
		    </v-list>
		  </v-flex>
		  <v-flex xs12 class="exampleUrlComponent">
		    <div v-for="(str, i) in exampleUrl" :class="{
		    	'pl-2': i>0,
		    	'param': i>1,
		    	'first': i===2,
		    }"  :key="i">{{str}}</div>
		  </v-flex>
		</v-layout>
  </v-flex>
</v-layout>
	</v-container>
</template>

<script>
import URL from 'url'
import cloneDeep from 'lodash.clonedeep'
import { utmMark } from '@/helpers'

export default {
	name: 'tagEditor',
	data () {
		return {
			type: 'main',
			utm: {
				utm_source: 'yandex.com',
				utm_medium: 'cpc',
				utm_campaign: '{campaign_name}',
				utm_term: '',
				utm_content: '{group_name}',
			},
		}
	},
	computed: {
		templateTags () {
			const templateTags = [{
				tag: '{campaign_name}',
				label: 'Название кампании',
			}, {
				tag: '{group_name}',
				label: 'Название групы',
			}]
			if (this.type === 'main') {
				templateTags.push({
					tag: '{ad_title}',
					label: 'Заголовок объявления',
				})
			} else {
				templateTags.push({
					tag: '{fastlink_name}',
					label: 'Заголовок быстрой ссылки',
				})
			}
			return templateTags
		},
		exampleData () {
			const exampleData = {
				campaign_name: null,
				group_name: null,
				ad_title: null,
				fastlink_name: null,
				ad_url: null,
			}

			const directMap = this.$store.getters['Direct/directMap']
			console.log(directMap)
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
			const utm = cloneDeep(this.utm)
			for (let param in utm) {
				for (let key in this.exampleData) {
					if (key === 'ad_url') continue

					const reg = new RegExp(`{${key}}`, 'g')
					utm[param] = utm[param].replace(reg, this.exampleData[key])
				}
			}
			const urlObj = URL.parse(utmMark(this.exampleData.ad_url, utm), true)
			const exampleUrlComponents = [urlObj.host, urlObj.pathname]
			for (let param in urlObj.query) {
				exampleUrlComponents.push(`${param}=${urlObj.query[param]}`)
			}
			return exampleUrlComponents
		},
	},
	methods: {
		mark () {
			this.$store.dispatch('Direct/utmTagging', {
				type: this.type,
				options: {
					params: this.utm,
				},
			})
		},
		copy (str) {
			this.$electron.clipboard.writeText(str)
		},
	},
}
</script>

<style scoped>
.exampleUrlComponent .param.first:before {
	content: '?'
}
.exampleUrlComponent .param:before {
	content: '&'
}
</style>
