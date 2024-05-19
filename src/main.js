import { createApp } from 'vue';
// import './style.css';
import App from './App.vue';

import {registerPlugins} from "./plugins/index";
import pinia from "./plugins/pinia";
import vuetify from "./plugins/vuetify";

import router from "@/router.js";

const app = createApp(App);
registerPlugins(app);
app.use(vuetify).use(pinia).use(router).mount("#app");
