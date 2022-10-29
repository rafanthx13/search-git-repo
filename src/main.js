import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import BootstrapVue3 from "bootstrap-vue-3";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";

import "./assets/main.css";

const app = createApp(App);

app.use(router);
app.use(BootstrapVue3);
app.mount("#app");

/*
<b-card :header="items['name']" v-for="(items, index) in items" :key="index" class="mb-4">
                <p>{{ items['full_name'] }}</p>
                <b-card-body>
                  <b-button :href="items['html_url']" variant="primary">Link para Repositório</b-button>
                </b-card-body>
                <footer class="blockquote-footer">
                  <p>Último Commit: {{ items['last_commit'] }} | Arquivado: {{ items['archived'] }}</p>
                  <p></p>
                </footer>
            </b-card>
*/