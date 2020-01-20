import Vue from 'vue';
import App from './App.vue';
Vue.config.productionTip = false;
import '@fortawesome/fontawesome-free/css/all.min.css';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';
import '@processmaker/vue-form-elements/dist/vue-form-elements.css';
import Vuex from 'vuex';
import ScreenBuilder from '@/components';

// Allow strings to be wrapped in $t(...) for translating
// outside this package. This standalone app just returns
// the English string
Vue.use(VueI18Next);
i18next.init({lng: 'en'});
Vue.mixin({ i18n: new VueI18Next(i18next) });
Vue.use(Vuex);
Vue.use(ScreenBuilder);

const store = new Vuex.Store({ modules: {} });

window.ProcessMaker = {
  apiClient: {
    get(url) {
      return new Promise((resolve) => {
        const exampleScreen = {
          id: 1,
          screen_category_id: 1,
          title: 'Sub screen example',
          description: 'A sub screen example',
          type: 'FORM',
          config: [
            {
              name: 'Sub screen example',
              items: [
                {
                  'label': 'Line Input',
                  'config': {
                    'icon': 'far fa-square',
                    'name': 'amount',
                    'type': 'text',
                    'label': 'Amount (USD)',
                    'helper': null,
                    'dataMask': {
                      'code': 'USD',
                      'name': 'US Dollar',
                      'format': '#,###.##',
                      'symbol': '$',
                    },
                    'dataFormat': 'currency',
                    'validation': null,
                    'placeholder': null,
                  },
                  'component': 'FormInput',
                  'inspector': [],
                  'editor-control': 'FormInput',
                  'editor-component': 'FormInput',
                },
              ],
            },
          ],
          computed: [],
          watchers: [],
          custom_css: null,
          status: 'ACTIVE',
        };
        if (url === 'screens/1') {
          resolve({ data: exampleScreen });
        } else if (url.substr(0, 7) === 'screens') {
          resolve({data:{
            data: [exampleScreen],
          }});
        }
      });
    },
  },
};

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
