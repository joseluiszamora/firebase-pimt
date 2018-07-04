<template lang="pug">
  v-card(color='white')
    v-toolbar(color='primary', dark)
      v-toolbar-side-icon
      v-toolbar-title Todos los Grupos
      v-spacer
      v-btn(icon, dark, @click.native="showDialogNewGroup = true")
        v-icon add
      v-dialog(v-model='showDialogNewGroup', persistent, scrollable, max-width='400px')
        v-card
          v-card-title Nuevo Grupo
          v-divider
          v-layout(row, wrap, px-3)
            v-flex.md12
              div
                v-text-field(label='Codigo', v-model='formGrupo.codigo')
              v-divider
              div
                v-text-field(label='Nombre', v-model='formGrupo.nombre')
              v-divider
              div
                v-select.px-2(style='margin:0 0 0;', label='Obra', v-model='formGrupo.clase', :items='colors', item-text='name', item-value='value')
              v-divider
              v-card-actions
                v-spacer
                v-btn(color='grey darken-1', flat, @click.native='showDialogNewGroup = false') Cancelar
                v-btn(color='green darken-1', flat, @click='saveGrupo') Guardar

    v-layout(row, wrap, pt-3)
      v-flex.md12
        loader(message="Cargando Usuarios", v-show="loaderGrupos")
        v-data-table.elevation-1(v-model="selected", :headers="headers", :items="grupos", :pagination.sync="pagination", select-all, item-key="id")
          template(slot="headers", slot-scope="props")
            tr
              th(v-for="header in props.headers", :key="header.text", :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']", @click="changeSort(header.value)")
                v-icon(small) arrow_upward
                | {{ header.text }}
          template(slot="items", slot-scope="props")
            tr(:active="props.selected", @click="props.selected = !props.selected")
              td.text-xs-center {{ props.item.codigo }}
              td.text-xs-center {{ props.item.nombre }}
              td.text-xs-center {{ props.item.clase }}
              td.text-xs-center
                v-chip(color="red", text-color="white", v-if="props.item.baja_logica > 0") Inactivo
                v-chip(color="green", text-color="white", v-else) Activo
</template>

<script>
  import http from '@/http/backend'
  import loader from '../Shared/Loader.vue'
  import imageprofile from '../Shared/Imageprofile.vue'
  export default {
    components: { loader, imageprofile },
    data () {
      return {
        tituloForm: 'Este es el titulo',
        mensajeForm: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras suscipit pulvinar ante, nec porttitor neque pulvinar vel. Phasellus nec elit eget eros luctus molestie. Donec nulla urna, euismod nec tortor id, ultricies viverra turpis. Integer ac enim vitae nisi congue vestibulum quis id tellus. Nunc id varius metus. Suspendisse a eros elementum, commodo eros sed, feugiat libero. Donec consectetur accumsan risus, et convallis magna. Duis euismod, erat ut laoreet consectetur, purus turpis vestibulum lorem, eu condimentum quam sem eget felis. Ut ac ornare eros. Curabitur purus dolor, vehicula id velit id, facilisis suscipit lorem. Sed vitae tincidunt diam. Suspendisse potenti. Proin dapibus arcu dignissim, scelerisque mauris eget, dapibus quam.',
        imageForm: null,
        showAlive: true,
        grupos: [],
        loaderGrupos: false,
        showDialogNewGroup: false,
        pagination: {
          sortBy: 'ci'
        },
        selected: [],
        headers: [
          { text: '', value: 'id' },
          { text: 'Codigo', align: 'center', value: 'codigo' },
          { text: 'Nombre', align: 'center', value: 'nombre' },
          { text: 'Clase', align: 'center', value: 'clase' }
        ],
        formGrupo: {
          codigo: '',
          nombre: '',
          clase: ''
        },
        colors: [
          {name: 'azul 1', value: 'blue darken-1'},
          {name: 'azul 2', value: 'blue darken-2'},
          {name: 'azul 3', value: 'blue darken-3'},
          {name: 'azul 4', value: 'blue darken-4'}
        ]
      }
    },
    methods: {
      getAllGrupos () {
        this.loaderUsuarios = true
        http.getAllGrupos().then(res => {
          this.grupos = res.data.data
          this.loaderGrupos = false
          console.log(res.data.data)
        }, (error) => {
          console.log(error)
        })
      },
      saveGrupo () {
        const grupo = `codigo=${this.formGrupo.codigo}&nombre=${this.formGrupo.nombre}&clase=${this.formGrupo.clase}`
        http.saveGrupo(grupo).then(res => {
          console.log(res.data)
          this.getAllGrupos()
        }, (error) => {
          this.showError = true
          console.log(error)
        })
      }
    },
    created () {
      this.getAllGrupos()
    }
  }
</script>