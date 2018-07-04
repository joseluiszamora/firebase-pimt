<template lang="pug">
  v-card(color='white')
    v-toolbar(color='primary', dark)
      v-toolbar-side-icon
      v-toolbar-title Enviar a :
      v-spacer
      v-btn(icon)
        v-icon visibility
    v-layout(row, wrap, pt-3)
      loader(message="Cargando Usuarios", v-show="loaderUsuarios")
      v-data-table.elevation-1(v-model="selected", :headers="headers", :items="usuarios", :pagination.sync="pagination", select-all, item-key="id")
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
            td {{ props.item.ci }}
            td.text-xs-right {{ props.item.nombre_usuario }}
            td.text-xs-right {{ props.item.nombre }}
            td.text-xs-right {{ props.item.tipo }}
</template>

<script>
  import http from '@/http/backend'
  import loader from '../Shared/Loader.vue'
  export default {
    components: { loader },
    data () {
      return {
        tituloForm: 'Este es el titulo',
        mensajeForm: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras suscipit pulvinar ante, nec porttitor neque pulvinar vel. Phasellus nec elit eget eros luctus molestie. Donec nulla urna, euismod nec tortor id, ultricies viverra turpis. Integer ac enim vitae nisi congue vestibulum quis id tellus. Nunc id varius metus. Suspendisse a eros elementum, commodo eros sed, feugiat libero. Donec consectetur accumsan risus, et convallis magna. Duis euismod, erat ut laoreet consectetur, purus turpis vestibulum lorem, eu condimentum quam sem eget felis. Ut ac ornare eros. Curabitur purus dolor, vehicula id velit id, facilisis suscipit lorem. Sed vitae tincidunt diam. Suspendisse potenti. Proin dapibus arcu dignissim, scelerisque mauris eget, dapibus quam.',
        imageForm: null,
        showAlive: true,
        usuarios: [],
        loaderUsuarios: false,
        pagination: {
          sortBy: 'ci'
        },
        selected: [],
        headers: [
          { text: 'Documento', value: 'ci' },
          { text: 'Usuario', align: 'left', value: 'nombre_usuario' },
          { text: 'Nombre', value: 'nombre' }
        ]
      }
    },
    methods: {
      getAllUsuarios () {
        this.loaderUsuarios = true
        http.getAllUsuarios().then(res => {
          this.usuarios = res.data.data
          this.loaderUsuarios = false
          console.log(res.data.data)
        }, (error) => {
          console.log(error)
        })
      }
    },
    created () {
      this.getAllUsuarios()
    }
  }
</script>