<template lang="pug">
  div
    v-layout(row, wrap)
      v-flex.md6
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
                      v-select.px-2(style='margin:0 0 0;', label='Seleccione un color:', v-model='formGrupo.clase', :items='colors', item-text='name', item-value='value')
                    v-divider
                    v-card-actions
                      v-spacer
                      v-btn(color='grey darken-1', flat, @click.native='showDialogNewGroup = false') Cancelar
                      v-btn(color='green darken-1', flat, @click='saveGrupo') Guardar

          v-layout(row, wrap, pt-3)
            v-flex.md12
              loader(message="Cargando Usuarios", v-show="loaderGrupos")
              v-data-table.elevation-1(
                v-model="selected", 
                :headers="headers", 
                :items="grupos", 
                :pagination.sync="pagination", 
                no-data-text="Ningun grupo", 
                select-all, item-key="id")
                template(slot="headers", slot-scope="props")
                  tr
                    th(v-for="header in props.headers", :key="header.text", :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']", @click="changeSort(header.value)")
                      v-icon(small) arrow_upward
                      | {{ header.text }}
                template(slot="items", slot-scope="props")
                  tr(:active="props.selected", @click="selectGroup(props.item)")
                    td.text-xs-center
                      v-chip(:color="props.item.clase", text-color="white") {{ props.item.codigo | capitalize }}
                    td.text-xs-center {{ props.item.nombre }}
      v-flex.md6.pl-3
        personas-grupo(:grupo="grupoSelected", v-if="grupoSelected!=null")
</template>

<script>
  import http from '@/http/backend'
  import loader from '../Shared/Loader.vue'
  import imageprofile from '../Shared/Imageprofile.vue'
  import personasGrupo from '../Usuarios/PersonasGrupo.vue'
  export default {
    components: { loader, imageprofile, personasGrupo },
    data () {
      return {
        tituloForm: 'Este es el titulo',
        mensajeForm: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras suscipit pulvinar ante, nec porttitor neque pulvinar vel. Phasellus nec elit eget eros luctus molestie. Donec nulla urna, euismod nec tortor id, ultricies viverra turpis. Integer ac enim vitae nisi congue vestibulum quis id tellus. Nunc id varius metus. Suspendisse a eros elementum, commodo eros sed, feugiat libero. Donec consectetur accumsan risus, et convallis magna. Duis euismod, erat ut laoreet consectetur, purus turpis vestibulum lorem, eu condimentum quam sem eget felis. Ut ac ornare eros. Curabitur purus dolor, vehicula id velit id, facilisis suscipit lorem. Sed vitae tincidunt diam. Suspendisse potenti. Proin dapibus arcu dignissim, scelerisque mauris eget, dapibus quam.',
        imageForm: null,
        showAlive: true,
        grupos: [],
        grupoSelected: null,
        loaderGrupos: false,
        showDialogNewGroup: false,
        pagination: {
          sortBy: 'ci'
        },
        selected: [],
        headers: [
          { text: 'Codigo', align: 'center', value: 'codigo' },
          { text: 'Nombre', align: 'center', value: 'nombre' }
        ],
        formGrupo: {
          codigo: '',
          nombre: '',
          clase: ''
        },
        colors: [
          { name: 'blue 1', value: 'blue darken-1' },
          { name: 'blue 2', value: 'blue darken-2' },
          { name: 'blue 3', value: 'blue darken-3' },
          { name: 'blue 4', value: 'blue darken-4' },
          { name: 'teal 1', value: 'teal darken-1' },
          { name: 'teal 2', value: 'teal darken-2' },
          { name: 'teal 3', value: 'teal darken-3' },
          { name: 'teal 4', value: 'teal darken-4' },
          { name: 'light-blue 1', value: 'light-blue darken-1' },
          { name: 'light-blue 2', value: 'light-blue darken-2' },
          { name: 'light-blue 3', value: 'light-blue darken-3' },
          { name: 'light-blue 4', value: 'light-blue darken-4' },
          { name: 'green 1', value: 'green darken-1' },
          { name: 'green 2', value: 'green darken-2' },
          { name: 'green 3', value: 'green darken-3' },
          { name: 'green 4', value: 'green darken-4' },
          { name: 'orange 1', value: 'orange darken-1' },
          { name: 'orange 2', value: 'orange darken-2' },
          { name: 'orange 3', value: 'orange darken-3' },
          { name: 'orange 4', value: 'orange darken-4' }
        ]
      }
    },
    methods: {
      selectGroup(grupo) {
        grupo.selected = true
        this.grupoSelected = grupo
      },
      clearForm () {
        this.formGrupo.codigo = ''
        this.formGrupo.nombre = ''
        this.formGrupo.clase = ''
      },
      validateFormGroup (grupo) {
        if (grupo.codigo != '' && grupo.nombre != '' && grupo.clase != '') {
          return true
        }
        return false
      },
      getAllGrupos () {
        this.loaderUsuarios = true
        http.getAllGrupos().then(res => {
          this.grupos = res.data.data
          this.loaderGrupos = false
        }, (error) => {
          console.log(error)
        })
      },
      saveGrupo () {
        if (this.validateFormGroup(this.formGrupo)) {
          const grupo = `codigo=${this.formGrupo.codigo}&nombre=${this.formGrupo.nombre}&clase=${this.formGrupo.clase}`
          http.saveGrupo(grupo).then(res => {
            this.getAllGrupos()
            this.clearForm()
            this.showDialogNewGroup = false
          }, (error) => {
            this.showError = true
            console.log(error)
          })
        }
      }
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        return value.toString().toUpperCase()
      }
    },
    created () {
      this.getAllGrupos()
    }
  }
</script>