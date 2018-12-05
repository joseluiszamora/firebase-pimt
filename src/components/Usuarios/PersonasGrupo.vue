<template lang="pug">
  v-card(color='white')
    v-toolbar(color='amber darken-3', dark)
      v-toolbar-title Grupo: {{ grupo.nombre }}
      v-spacer
      v-btn(icon, dark, @click.native="launchDialogGroup")
        v-icon add
      v-btn(icon, dark, @click.native="reloadUsuariosGrupo")
        v-icon refresh
      v-dialog(v-model='showDialogNewGroup', persistent, scrollable, max-width='400px')
        v-card
          v-card-title.title Agregar personas al grupo
          v-divider
          v-layout(row, wrap, px-3)
            v-flex.md12
              div
                v-text-field(append-icon="search", label="Buscar...", single-line hide-details, v-model="searchAdd")
              v-divider
              v-card-text(style='max-height: 300px;')
                v-subheader Personas
                loader(message="Cargando Usuarios", v-show="loaderUsuariosImportar")
                div(v-for='usuario in usuariosImportar', v-bind:key='usuario.id', style='height:30px;', v-show="!loaderUsuariosImportar", v-if="!usuario.bloqueado")
                  v-checkbox(:label='usuario.nombre', v-model='usuario.select', light)
              v-divider
              v-card-actions
                v-spacer
                v-btn(color='grey darken-1', flat, @click.native='showDialogNewGroup = false') Cancelar
                v-btn(color='green darken-1', flat, @click='saveGrupo', v-if="countUsuariosParaImportar() > 0") Agregar ({{ countUsuariosParaImportar() }})

    v-layout(row, wrap, justify-end)
      v-flex.md8
        v-text-field(append-icon="search", label="Buscar...", single-line hide-details, v-model="search")
    v-layout(row, wrap, pt-3)
      loader(message="Cargando Usuarios", v-show="loaderUsuarios")
      v-flex.md12
        v-data-table.elevation-1(
          v-show="!loaderUsuarios" 
          v-model="selected", 
          :headers="headers", 
          :items="usuarios", 
          rows-per-page-text="items por pagina", no-data-text="Ninguna persona", 
          :rows-per-page-items="pag" 
          :pagination.sync="pagination", select-all, item-key="id", :search="search")
          template(slot="headers", slot-scope="props")
            tr
              th
                v-checkbox(:input-value="props.all", :indeterminate="props.indeterminate", primary, hide-details, @click.native="toggleAll")
              th(v-for="header in props.headers", :key="header.text", :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']", @click="changeSort(header.value)")
                v-icon(small) arrow_upward
                | {{ header.text }}
          template(slot="items", slot-scope="props")
            tr(:active="props.selected", @click="props.selected = !props.selected")
              td
                v-checkbox(:input-value="props.selected", primary, hide-details)
              td
                imageprofile(:documento="props.item.ci || 'null'", :width="100", slot='activator')
              td.text-xs-center {{ props.item.ci }}
              td.text-xs-center {{ props.item.nombre }}
</template>

<script>
  import http from '@/http/backend'
  import loader from '../Shared/Loader.vue'
  import imageprofile from '../Shared/Imagerrhh.vue'
  export default {
    components: { loader, imageprofile },
    props: {
      grupo: { type: Object, required: true }
    },
    data () {
      return {
        usuarios: [],
        usuariosImportar: [],
        loaderUsuarios: false,
        loaderUsuariosImportar: false,
        showDialogNewGroup: false,
        search: '',
        searchAdd: '',
        pagination: {
          sortBy: 'nombre'
        },
        pag: [10, 20, 50, { text: 'Todos', value: -1 }],
        selected: [],
        headers: [
          { text: '', align: 'center', value: 'codigo' },
          { text: 'Ci', align: 'center', value: 'ci' },
          { text: 'Nombre', align: 'center', value: 'nombre' }
        ],
        formGrupo: {
          codigo: '',
          nombre: '',
          clase: ''
        },
        colors: []
      }
    },
    methods: {
      launchDialogGroup () {
        this.getUsuariosImportar(this.grupo.id)
        this.showDialogNewGroup = true
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
      reloadUsuariosGrupo () {
        this.getUsuariosImportar(this.grupo.id)
        this.getUsuariosGrupo(this.grupo.id)
      },
      getUsuariosGrupo (idGrupo) {
        this.loaderUsuarios = true
        http.getUsuariosGrupo(idGrupo).then(res => {
          this.usuarios = res.data.data
          this.loaderUsuarios = false
        }, (error) => {
          console.log(error)
        })
      },
      getUsuariosImportar (idGrupo) {
        this.loaderUsuariosImportar = true
        this.usuariosImportar = []
        http.getAllUsuarios().then(res => {
          res.data.data.forEach(function (element) {
            var bloqueado = false
            this.usuarios.forEach(function (usuario) {
              if (usuario.id === element.id) {
                bloqueado = true
              }
            }, this)

            let temp = { select: !bloqueado, id: element.id, nombre: element.nombre, ci: element.ci, bloqueado: bloqueado }
            this.usuariosImportar.push(temp) 

            //let temp = { select: true, id: element.id, nombre: element.nombre, ci: element.ci }
            //this.usuariosImportar.push(temp)

          }, this)
          this.loaderUsuariosImportar = false
        }, (error) => {
          console.log(error)
        })
      },
      countUsuariosParaImportar () {
        let counter = 0
        this.usuariosImportar.forEach(function (element) {
          if (element.select) {
            counter++
          }
        }, this)
        return counter
      },
      saveGrupo () {
        let usuarios = ''
        this.usuariosImportar.forEach(function (element) {
          if (element.select) {
            usuarios += element.id+'|'
          }
        }, this)

        const agrupacion = `id_grupo=${this.grupo.id}&id_usuarios=${usuarios}`
        http.saveAgrupacion(agrupacion).then(res => {
          this.showDialogNewGroup = false
          this.reloadUsuariosGrupo()
        }, (error) => {
          console.log(error)
        })
      },
      toggleAll () {
        if (this.selected.length) this.selected = []
        else this.selected = this.usuarios.slice()
      }
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        return value.toString().toUpperCase()
      }
    },
    watch: {
      grupo (newVal, oldVal) {
        this.getUsuariosGrupo(newVal.id)
      }
    },
    created () {
      this.reloadUsuariosGrupo()
    }
  }
</script>