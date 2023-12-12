import './assets/css/normal.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'

const getToken = () => {
  const href = window.location.href;
  const token = href.split("=")[1];
  if (token) {
    window.localStorage.setItem("appToken", 'Bearer ' + token);
  }
};
getToken();

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
