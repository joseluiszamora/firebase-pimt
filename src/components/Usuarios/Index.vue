<template lang="pug">
  v-card(color='white')
    v-toolbar(color='amber darken-3', dark)
      v-toolbar-title Todos los Usuarios
      v-spacer
      v-btn(icon, dark, @click.native="getAllUsuarios")
        v-icon refresh
    v-layout(row, wrap, justify-end)
      v-flex.md6
        v-text-field(append-icon="search", label="Buscar...", single-line hide-details, v-model="search")
    v-layout(row, wrap, pt-3)
      v-flex.md12
        loader(message="Cargando Usuarios", v-show="loaderUsuarios")
        v-data-table.elevation-1(
          v-model="selected", 
          :headers="headers", 
          :items="usuarios", 
          :search="search", 
           v-show="!loaderUsuarios" 
           :rows-per-page-items="pag" 
          :pagination.sync="pagination", select-all, item-key="id")
          template(slot="headers", slot-scope="props")
            tr
              th(v-for="header in props.headers", :key="header.text", :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']", @click="changeSort(header.value)")
                v-icon(small) arrow_upward
                | {{ header.text }}
          template(slot="items", slot-scope="props")
            tr(:active="props.selected", @click="props.selected = !props.selected")
              td
                v-tooltip(top)
                  imageprofile(:documento="props.item.ci || 'null'", :width="100", slot='activator')
                  span {{ props.item.nombre }}
              td.text-xs-center {{ props.item.ci }}
              // td.text-xs-center {{ props.item.nombre_usuario }}
              td.text-xs-center {{ props.item.nombre }}
              td.text-xs-center {{ props.item.ultimo_ingreso }}
              td.text-xs-center
                v-chip(color="red", text-color="white", v-if="props.item.baja_logica > 0") Inactivo
                v-chip(color="green", text-color="white", v-else) Activo
</template>

<script>
  import http from '@/http/backend'
  import loader from '../Shared/Loader.vue'
  import imageprofile from '../Shared/Imagerrhh.vue'
  export default {
    components: { loader, imageprofile },
    data () {
      return {
        tituloForm: 'Este es el titulo',
        mensajeForm: 'Lorem ipsum dolor sit amet.',
        imageForm: null,
        showAlive: true,
        usuarios: [],
        search: '',
        loaderUsuarios: false,
        pagination: {
          sortBy: 'ultimo_ingreso',
          descending: true
        },
        selected: [],
        headers: [
          { text: '', value: 'id' },
          { text: 'Documento', align: 'center', value: 'ci' },
          //{ text: 'Usuario', align: 'center', value: 'nombre_usuario' },
          { text: 'Nombre', align: 'center', value: 'nombre' },
          { text: 'Ultimo Ingreso', align: 'center', value: 'ultimo_ingreso' },
          { text: 'Estado', align: 'center', value: 'baja_logica' }
        ],
        pag: [10, 20, 50, { text: 'Todos', value: -1 }]
      }
    },
    methods: {
      getAllUsuarios () {
        this.loaderUsuarios = true
        http.getAllUsuarios().then(res => {
          this.usuarios = res.data.data
          this.loaderUsuarios = false
        }, (error) => {
          console.log(error)
        })
      },
      toggleAll () {
        if (this.selected.length) this.selected = []
        else this.selected = this.usuarios.slice()
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      }
    },
    created () {
      this.getAllUsuarios()
    }
  }
</script>