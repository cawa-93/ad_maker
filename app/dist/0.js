webpackJsonp([0],{145:function(t,e,a){a(180);var o=a(29)(a(156),a(175),"data-v-ece656f6",null);t.exports=o.exports},149:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"dropdownZone",data:function(){return{isDragover:!1}},methods:{loadFiles:function(t){this.isDragover=!1,this.$emit("drop",t.dataTransfer.files[0].path)},openFile:function(){var t=this.$electron.remote.dialog.showOpenDialog();t&&t[0]&&this.$emit("drop",t[0])}}}},150:function(t,e,a){e=t.exports=a(15)(),e.push([t.i,".dropdown-zone-root[data-v-7617c4b6]{padding:10px}.dashed[data-v-7617c4b6],.dropdown-zone-root[data-v-7617c4b6]{width:100%;height:100%;display:flex;justify-content:center;align-items:center;flex-direction:column;cursor:pointer}.dashed[data-v-7617c4b6]{border:5px dashed transparent}.dropdown-zone-root.md-accent[data-v-7617c4b6]{background:#3f51b5;color:#fff}.dropdown-zone-root.md-accent .dashed[data-v-7617c4b6]{border-color:#fff}.md-icon[data-v-7617c4b6]{border:5px dashed;padding:19px;box-sizing:content-box;border-radius:5px;margin:0}.dropdown-zone-content[data-v-7617c4b6]{pointer-events:none!important}",""])},151:function(t,e,a){a(153);var o=a(29)(a(149),a(152),"data-v-7617c4b6",null);t.exports=o.exports},152:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"dropdown-zone dropdown-zone-root",class:{"md-accent":t.isDragover},on:{click:t.openFile,drop:function(e){e.preventDefault(),t.loadFiles(e)},dragover:function(e){e.preventDefault(),t.isDragover=!0},dragleave:function(e){e.preventDefault(),t.isDragover=!1}}},[a("div",{staticClass:"dashed"},[a("md-icon",{staticClass:"md-size-4x"},[t._v("file_upload")]),t._v(" "),t._t("default")],2)])},staticRenderFns:[]}},153:function(t,e,a){var o=a(150);"string"==typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals),a(16)("5cc78d1c",o,!0)},156:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=a(161),r=a.n(o),n=a(30),i=a.n(n),d=a(151),s=a.n(d),c=a(57),l=(a.n(c),a(154)),p=a.n(l);e.default={name:"fastLinks",components:{dropdownZone:s.a},data:function(){return{type:"custom",templateType:null}},computed:i()({},a.i(c.mapGetters)(["isDirectLoaded"]),a.i(c.mapState)({pathHistory:function(t){return t.direct.fastLinksPathHistory},template:function(t){if(!t.direct.fastLinksTemplate||!t.direct.fastLinksTemplate.length)return null;var e=[];return t.direct.fastLinksTemplate.forEach(function(t,a){var o=r()(t),n=o[0],i=o[1],d=o.slice(2);if(0!==a){var s=e.find(function(t){return t.campaignName===n&&t.groupName===i});s||(s={campaignName:n,groupName:i,links:[]},e.push(s));for(var c=1;c<=4;c++){var l=3*c-2;d[l-1]&&d[l]&&d[l+1]&&s.links.push({title:d[l-1],url:d[l],desc:d[l+1]})}}}),e}})),methods:{onDrop:function(t){this.setTemplate({type:this.type,path:t})},setTemplate:function(t){var e=this;t.type||(t.type=this.type),this.$store.dispatch("SET_FASTLINKS_TEMPLATE",t).then(function(){e.savefastLinks()}),this.templateType=t.type},savefastLinks:function(){this.$store.dispatch("SET_FASTLINKS",this.template)},clearTemplate:function(){this.$store.dispatch("CLEAR_FASTLINKS")}},filters:{basename:function(t){return p.a.basename(t)}}}},160:function(t,e,a){t.exports={default:a(162),__esModule:!0}},161:function(t,e,a){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var r=a(160),n=o(r);e.default=function(t){return Array.isArray(t)?t:(0,n.default)(t)}},162:function(t,e,a){a(17),a(164),t.exports=a(2).Array.from},163:function(t,e,a){"use strict";var o=a(7),r=a(31);t.exports=function(t,e,a){e in t?o.f(t,e,r(0,a)):t[e]=a}},164:function(t,e,a){"use strict";var o=a(9),r=a(10),n=a(33),i=a(60),d=a(59),s=a(32),c=a(163),l=a(34);r(r.S+r.F*!a(61)(function(t){Array.from(t)}),"Array",{from:function(t){var e,a,r,p,f=n(t),u="function"==typeof this?this:Array,v=arguments.length,m=v>1?arguments[1]:void 0,h=void 0!==m,_=0,b=l(f);if(h&&(m=o(m,v>2?arguments[2]:void 0,2)),void 0==b||u==Array&&d(b))for(e=s(f.length),a=new u(e);e>_;_++)c(a,_,h?m(f[_],_):f[_]);else for(p=b.call(f),a=new u;!(r=p.next()).done;_++)c(a,_,h?i(p,m,[r.value,_],!0):r.value);return a.length=_,a}})},169:function(t,e,a){e=t.exports=a(15)(),e.push([t.i,".root[data-v-ece656f6]{height:calc(100vh - 64px)}.root>.md-layout[data-v-ece656f6]{height:100%}.md-list[data-v-ece656f6]{width:100%}.md-list-item-container span[data-v-ece656f6]{flex:1}.md-list-item-container b[data-v-ece656f6]{flex-basis:40px}.md-whiteframe[data-v-ece656f6]{width:100%}.md-radio[data-v-ece656f6],label[data-v-ece656f6]{cursor:pointer}.scroll[data-v-ece656f6]{overflow-y:auto}blockquote[data-v-ece656f6]{border-left:5px solid;align-items:center;padding:5px 5px 5px 1em;display:flex}blockquote.md-accent[data-v-ece656f6]{border-left-color:#448aff;background-color:rgba(68,138,255,.25);color:#448aff}blockquote.md-warn[data-v-ece656f6]{border-left-color:#e64a19;background-color:rgba(230,74,25,.25);color:#e64a19;padding:15px 1em}blockquote>span[data-v-ece656f6]{flex:1}.md-caption[data-v-ece656f6]{margin:0}table.md-caption[data-v-ece656f6]{border-collapse:collapse;border-spacing:0;width:100%;max-width:500px;text-align:center}table.md-caption td[data-v-ece656f6],table.md-caption th[data-v-ece656f6],table[data-v-ece656f6]{border-left:1px solid rgba(0,0,0,.2);border-right:1px solid rgba(0,0,0,.2)}table.md-caption td[data-v-ece656f6],table.md-caption th[data-v-ece656f6]{padding:5px;border-top:1px solid rgba(0,0,0,.2)}table.md-caption th[data-v-ece656f6]{border-top:none}",""])},175:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"root"},[t.isDirectLoaded?a("md-layout",{attrs:{"md-gutter":"","md-flex":""}},[t.template?a("md-layout",{staticClass:"scroll",attrs:{"md-flex":""}},[a("md-whiteframe")],1):a("md-layout",{attrs:{"md-flex":""}},[a("md-whiteframe",[a("dropdown-zone",{on:{drop:t.onDrop}},[a("p",{staticClass:"md-title"},[t._v("Выберите файл сожержащий быстрые ссылки")]),t._v(" "),"custom"===t.type?a("table",{staticClass:"md-caption",attrs:{cellspacing:"0"}},[a("tr",[a("th",[t._v("Кампания")]),a("th",[t._v("Группа")]),a("th",[t._v("Заголовок")]),a("th",[t._v("URL")]),a("th",[t._v("Описание")]),a("th",[t._v("...")])]),t._v(" "),a("tr",[a("td",[t._v("Кампания_1")]),a("td",[t._v("Группа_1")]),a("td",[t._v("Заголовок")]),a("td",[t._v("https://...")]),a("td",[t._v("Описание")]),a("td",[t._v("...")])]),t._v(" "),a("tr",[a("td",[t._v("Кампания_1")]),a("td",[t._v("Группа_2")]),a("td",[t._v("Заголовок")]),a("td",[t._v("https://...")]),a("td",[t._v("Описание")]),a("td",[t._v("...")])])]):t._e()])],1)],1),t._v(" "),a("md-layout",{staticClass:"right-sidebar",attrs:{"md-flex":""}},[a("md-whiteframe",[t.template?a("md-list",[a("md-subheader",[t._v("Действия")]),t._v(" "),a("md-list-item",{nativeOn:{click:function(e){t.savefastLinks(e)}}},[t._v("Записать в кампании")]),t._v(" "),a("md-list-item",{nativeOn:{click:function(e){t.clearTemplate(e)}}},[t._v("Очистить")])],1):a("md-list",[a("md-subheader",[t._v("Тип шаблона")]),t._v(" "),a("md-list-item",[a("md-radio",{attrs:{id:"type-custom",name:"type-custom","md-value":"custom"},model:{value:t.type,callback:function(e){t.type=e},expression:"type"}},[t._v("Из Excel")])],1),t._v(" "),a("md-list-item",[a("md-radio",{attrs:{disabled:"",id:"type-adwords",name:"type-adwords","md-value":"adwords"},model:{value:t.type,callback:function(e){t.type=e},expression:"type"}},[t._v("Из AdWords")])],1)],1),t._v(" "),t.pathHistory.length?a("md-list",[a("md-subheader",[t._v("Последние файлы")]),t._v(" "),t._l(t.pathHistory,function(e){return a("md-list-item",{key:e.path,nativeOn:{click:function(a){t.setTemplate(e)}}},[t._v(t._s(t._f("basename")(e.path)))])})],2):t._e()],1)],1)],1):a("div",{staticClass:"direct-first-error"},[a("md-icon",{staticClass:"md-size-4x"},[t._v("error_outline")]),t._v(" "),a("p",{staticClass:"md-title"},[t._v("Сначала нужно загрузить кампании")]),t._v(" "),a("p",{staticClass:"md-caption"},[t._v("Ctrl+O")])],1)],1)},staticRenderFns:[]}},180:function(t,e,a){var o=a(169);"string"==typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals),a(16)("5f5f3884",o,!0)}});