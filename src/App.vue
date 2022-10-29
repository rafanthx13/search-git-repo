<template>
  <div>
    <h1>GitHup Search MyRepo</h1>

    <section id="form-filtering">

      <!-- PRIVATE/PUBLIC REPO -->
      <div class="mb-3">
        <label for="range-1">Filtrar tipo de repositório:</label>
        <b-form-radio-group
          label="Filtrar Tipo de repositório"
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

      <!-- ALPHABETIC/ LAST COMMIT SORT -->
      <div class="mb-3">
        <label for="range-1">Ordenar:</label>
        <b-form-radio-group
          label="Filtrar Tipo de repositório"
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

            <b-card :header="items['name']" v-for="(items, index) in items" :key="index" class="mb-4" footer-tag="footer">
                
                <b-card-body>
                  <p>{{ items['full_name'] }}</p>
                  <b-button :href="items['html_url']" variant="primary">Link para Repositório</b-button>
                </b-card-body>
                <template #footer >
                  <em >Último Commit: {{ items['last_commit'] }} | Arquivado: {{ items['archived'] }}</em>
                </template>
            </b-card>

        </b-row>
      </b-container>
    </section>

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
      text: '',
      sort_repos: '',
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

  async created() {
    try {
      const res = await axios.get(`https://api.github.com/users/rafanthx13/repos?per_page=1000`);
      this.items = res.data.map(x => ({ 
        'full_name': x['full_name'],
        'html_url': x['html_url'],
        'user': x['owner']['login'],
        'last_commit': this.convert_iso_date(x['pushed_at']),
        'public': x['visibility'],
        'archived': x['archived'],
        'name': x['name'],
      }))
      this.original_items = this.items.slice()
    } catch (error) {
      console.log(error);
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

    text(new_text, old_text){
      if(new_text == ''){
        this.items = this.original_items.slice()
      }else {
        this.items = this.original_items.filter(el => el['full_name'].includes(new_text))  
      }
      
    },

    sort_repos(new_sort_repo, old_sort_repo) {
      if(new_sort_repo == 'alphabetic'){
        this.items = this.items.sort( (a,b) => this.compare_by_attr(a, b, 'full_name') )
      } else {
        this.items = this.items.sort( (a,b) => this.compare_by_attr(a, b, 'last_commit') ).reverse()
      }

    },

  },

  methods: {
    convert_iso_date(iso_date_str){
      return iso_date_str.substring(0, 10) + ' ' + iso_date_str.substring(11, 19)
    },
    compare_by_attr(a, b, attr){
      return (a[attr] > b[attr]) ? 1 : (b[attr] > a[attr]) ? -1 : 0
    },
  }

}

</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
