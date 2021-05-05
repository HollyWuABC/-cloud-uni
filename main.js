import Vue from 'vue';
import App from './App';
import store from './store';
import PubFuc from './common/js/utils.js';


Vue.config.productionTip = false;

// 挂载全局
Vue.prototype.$store = store;
Vue.prototype.$pubFuc = PubFuc; // this.$PubFuc.formatTime() 进行调用

//挂载
Vue.prototype.$websiteUrl = "http://localhost:3000";
Vue.prototype.$imgSuffix = "?imageView&thumbnail=369x0&quality=75&tostatic=0";

App.mpType = 'app';

const app = new Vue({
    ...App
});
app.$mount();
