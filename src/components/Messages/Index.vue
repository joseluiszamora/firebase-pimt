<template lang="pug">
  v-card(color="white")
    v-toolbar(color='primary', dark)
      v-toolbar-title Mensajes
      v-spacer
      v-btn(icon, dark, @click.native="")
        v-icon add
      v-btn(icon, dark, @click.native="getMensajes")
        v-icon refresh
    v-layout(row, wrap, justify-end)
      v-flex.md8
        v-text-field(append-icon="search", label="Buscar...", single-line hide-details, v-model="search")
    v-layout(row, wrap, pt-3)
      loader(message="Cargando Mensajes", v-show="loaderMain")
      v-flex.md12
        v-data-table.elevation-1(
          v-show="!loaderMain" 
          :headers="headers", 
          :items="mensajes", 
          rows-per-page-text="items por pagina", no-data-text="Ningun mensaje", 
          :rows-per-page-items="pag" 
          :pagination.sync="pagination", select-all, item-key="id", :search="search")
          template(slot="headers", slot-scope="props")
            tr
              th(v-for="header in props.headers", :key="header.text", :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']", @click="changeSort(header.value)")
                v-icon(small) arrow_upward
                | {{ header.text }}
          template(slot="items", slot-scope="props")
            tr
              td.text-xs-center {{ props.item.id }}
              td.text-xs-center {{ props.item.titulo }}
              td.text-xs-center {{ limitText(props.item.mensaje) }}
              td.text-xs-center
                img(:src="imagePath(props.item.imagen)", width="100", v-if="props.item.imagen != 'null'")
              td.text-xs-center
                v-chip(color='light-blue', text-color='white', v-if="props.item.enviado != 0")
                  | {{ props.item.fecha_envio }}
                  v-icon(right) check
                v-btn(color='green', class='white--text', round, @click="sendMessage(props.item.id)", v-else)
                  | Enviar
                  v-icon(right) send
</template>

<script>
  import http from '../../http/backend'
  import loader from '../Shared/Loader.vue'
  import imageprofile from '../Shared/Imageprofile.vue'
  import config from '../../config'
  export default {
    components: { loader, imageprofile },
    data () {
      return {
        mensajes: [],
        loaderMain: false,
        search: '',
        pagination: { sortBy: 'nombre' },
        pag: [10, 20, 50, { text: 'Todos', value: -1 }],
        headers: [
          { text: 'Codigo', align: 'center', value: 'id' },
          { text: 'Titulo', align: 'center', value: 'titulo' },
          { text: 'Mensaje', align: 'center', value: 'mensaje' },
          { text: 'Imagen', align: 'center', value: 'imagen' },
          { text: 'Enviado', align: 'center', value: 'enviado' }
        ]
      }
    },
    methods: {
      imagePath (image) {
        return config.publicUrl + image
      },
      limitText(text) {
        return text.substring(0, 200) + '...'
      },
      getMensajes () {
        this.loaderMain = true
        http.getAllMensajes().then(res => {
          this.mensajes = res.data.data
          this.loaderMain = false
        }, (error) => {
          console.log(error)
        })
      },
      sendMessage (idMensaje) {
        const mensaje = `id_mensaje=${idMensaje}`
        http.sendMessage(mensaje).then(res => {
          console.log(res.data)
          this.getMensajes()
        }, (error) => {
          console.log(error)
        })
      }
    },
    created () {
      this.getMensajes()
    }
  }
</script>
