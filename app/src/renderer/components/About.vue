<template>
	<div class="wrap">
		<div class="md-whiteframe">
			<md-card>
				<md-card-header>
					<md-avatar>
						<img src="./About/assets/512x512.png" alt="People">
					</md-avatar>

					<div class="md-title">Command.Editor</div>
					<div class="md-subhead">v{{appVersion}}</div>
				</md-card-header>

				<md-card-content>
					Быстрый редактор кампаний из Яндекс.Директ Коммандера
				</md-card-content>

				<md-card-actions>
					<md-button class="md-primary md-raised md-dense" @click.native="open('https://www.liqpay.com/ru/checkout/kozack/')">Поддержать проект</md-button>
					<md-button class="md-dense" @click.native="open('https://github.com/cawa-93/command-editor/wiki/')">Справочный центр</md-button>
					<md-button class="md-dense" @click.native="open('https://github.com/cawa-93/command-editor/issues/new/')">Сообщить о проблеме...</md-button>
				</md-card-actions>
			</md-card>

			<md-subheader>История версий</md-subheader>
			<md-progress v-if="!changelog" md-indeterminate></md-progress>

			<md-card v-else v-for="release in changelog" md-with-hover @click.native="open(release.html_url)">
				<md-card-header>
					<div class="md-title">{{release.tag_name}}<span v-if="release.name"> - {{ release.name }}</span><span class="prerelease md-caption" v-if="release.prerelease"> (prerelease)</span></div>
					<div class="md-subhead">{{new Date(release.published_at).toLocaleDateString()}}</div>
				</md-card-header>
				<md-card-content v-if="release.body_html">
					<div v-html="release.body_html"></div>
				</md-card-content>
			</md-card>
			
			<p v-if="changelog">
				<a href="" @click.prevent="open('https://github.com/cawa-93/command-editor/releases')">
					Вся история изменений
				</a>
			</p>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'about',
		data() {
			return {
				changelog: null
			};
		},
		computed: {
			appVersion() {
				return this.$electron.remote.app.getVersion();
			}
		},
		methods: {
			open(...args) {
				this.$electron.shell.openExternal(...args)
			}
		},
		mounted() {
			fetch('https://api.github.com/repos/cawa-93/command-editor/releases?per_page=5', {
				headers: {
					"Accept": "application/vnd.github.v3.html+json"
				}
			})
				.then(r => r.json())
				.then(releases => this.changelog = releases)
		}
	}
</script>

<style scoped>
	.wrap {
		max-height: calc(100vh - 64px);
		overflow: auto;
		padding: 20px 0;
	}
	.md-whiteframe {
		max-width: 800px;
		width: 100%;
		margin: auto;
	}
	.md-button.md-primary {
		flex: 1;
		font-weight: bold;
	}
</style>