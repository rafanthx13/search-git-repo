<template>
  <div class="center-page">
    <h1>Github Search Repo</h1>
    <p>Pesquise os repositórios armazenados no github de um usuário</p>

    <!-- PESQUISE UM USUÁRIO DO GITHUB -->
    <div class="mb-3">
      <label for="range-1">Digite o usuário do Github</label>
      <b-form-input v-model="github_user" placeholder="Digite o usuário" class="mb-3"></b-form-input>
      <b-button v-on:click="this.buscar_repositorio(this.github_user)" variant="primary">Pesquisar</b-button>
    </div>

    <template v-if="this.render">
      
      <section id="form-filtering">

        <!-- PRIVATE/PUBLIC REPO -->
        <div class="mb-3">
          <label for="range-1">Filtrar tipo de repositório:</label>
          <b-form-radio-group
            v-model="type_repos"
            :options="options_type_repos"
            value-field="item"
            text-field="name"
          ></b-form-radio-group>
        </div>

        <!-- FILTER TITLE REPO -->
        <div class="mb-3">
          <label for="range-1">Filtrar por palavra:</label>
          <b-form-input v-model="text" placeholder="Digite a palavra"></b-form-input>
        </div>

        <!-- ALPHABETIC / LAST COMMIT SORT -->
        <div class="mb-3">
          <label for="range-1">Ordenar:</label>
          <b-form-radio-group
            v-model="sort_repos"
            :options="options_sort_repos"
            value-field="item"
            text-field="name"
          ></b-form-radio-group>
        </div>

      </section>

      <p>Contagem de Repositórios: {{ items.length }}</p>

      <!-- LISTING REPOS -->
      <section id="repos">
        <b-container class="bv-example-row">
          <b-row>

              <b-card :header="items['name']" v-for="(items, index) in items" :key="index" class="mb-4 card-add" footer-tag="footer">
                  
                  <b-card-body>
                    <p>{{ items['full_name'] }}</p>
                    <b-button :href="items['html_url']" variant="primary">Link para Repositório</b-button>
                  </b-card-body>
                  <template #footer>
                    <em>Último Commit: {{ items['last_commit'] }} | {{ items['archived'] ? "Arquivado" : "Público" }}</em>
                  </template>
              </b-card>

          </b-row>
        </b-container>
      </section>

    </template>

    <!-- ERROR SECTION -->
    <template v-else-if="this.error">
      <div class="error-message">
        <p>Erro ao buscar os dados.</p>
        <p>O nome do usuário não foi encontrado</p>
      </div>
    </template>

  </div>
</template>

<script>
import axios from 'axios'

export default {

  name: "App",
  data() {
    return {
      items: [],
      original_items: [],
      type_repos: '',
      sort_repos: '',
      text: '',
      github_user: '',
      render: false,
      error: false,
      
      options_type_repos: [
          { item: 'public', name: 'Públicos' },
          { item: 'archived', name: 'Arquivados' },
      ],
      options_sort_repos: [
          { item: 'alphabetic', name: 'Alfabético' },
          { item: 'last_commit', name: 'Último Commit' },
      ],
    }
  },

  watch: {

    type_repos(new_type_repo, old_type_repo) {
      if(new_type_repo == 'public'){
        this.items = this.original_items.filter(el => el['archived'] == false)  
      } else {
        this.items = this.original_items.filter(el => el['archived'] == true)  
      }
    },

    sort_repos(new_sort_repo, old_sort_repo) {
      if(new_sort_repo == 'alphabetic'){
        this.items = this.items.sort(
         (a,b) => this.compare_by_attr(a, b, 'full_name') )
      } else {
        this.items = this.items.sort(
         (a,b) => this.compare_by_attr(a, b, 'last_commit') ).reverse()
      }
    },

    text(new_text, old_text) {
      if(new_text == ''){
        this.items = this.original_items.slice()
      }else {
        this.items = this.original_items.filter(
          el => el['full_name'].includes(new_text)
        )
      }
      // Caso reiniciar ou pesquisar algo enquanto as opções estão ativadas
      if(this.sort_repos == 'last_commit') {
        this.items = this.items.sort(
          (a,b) => this.compare_by_attr(a, b, 'last_commit') 
        ).reverse()
      }
      if(this.type_repos == 'archived'){
        this.items = this.original_items.filter(el => el['archived'] == true)  
      }
      if(this.type_repos == 'public'){
        this.items = this.original_items.filter(el => el['archived'] == false)  
      }

    },

  },

  methods: {

    convert_iso_date(iso_date_str){
      return iso_date_str.substring(0, 10) + ' ' + iso_date_str.substring(11, 19)
    },

    compare_by_attr(a, b, attr){
      return ( a[attr].toLowerCase() > b[attr].toLowerCase()) ? 1 : 
             (b[attr].toLowerCase() > a[attr].toLowerCase()) ? -1 : 0
    },

    async buscar_repositorio(usuario_github){
      try {
        this.type_repos = ''
        this.sort_repos = ''
        let url = `https://api.github.com/users/${usuario_github}/repos?per_page=1000`
        const res = await axios.get(url);
        this.items = res.data.map(x => ({ 
          'full_name': x['full_name'],
          'html_url': x['html_url'],
          'user': x['owner']['login'],
          'last_commit': this.convert_iso_date(x['pushed_at']),
          'public': x['visibility'],
          'archived': x['archived'],
          'name': x['name'],
        }))
        this.render = true
        this.error = false
        this.original_items = this.items.slice()
      } catch (error) {
        this.error = true
        this.render = false
        console.log(error);
      }
    },

  }

}

</script>

<style>

.center-page {
  max-width: 500px !important;
  margin: auto !important;
    padding: 20px;
  margin-bottom: 40px !important;
  margin-top: 40px !important;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}

.card-header {
  font-weight: bolder;
  background-color: transparent !important;
}

.card-add {
  background-color: #106dfb1f;
  box-shadow: rgb(14 30 37 / 12%) 0px 2px 4px 0px, rgb(14 30 37 / 32%) 0px 2px 16px 0px;
}

.error-message {
  text-align: center;
    font-size: larger;
    color: red;
}

</style>
