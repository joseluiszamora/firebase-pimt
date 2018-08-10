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
            tr(@click="openData(props)")
              td.text-xs-center
                v-icon(v-html="props.expanded ? 'expand_less' : 'expand_more'", color="primary")
              td.text-xs-center {{ props.item.id }}
              td.text-xs-center {{ props.item.titulo }}
              td.text-xs-center {{ limitText(props.item.mensaje) }}
              td.text-xs-center
                img(:src="imagePath(props.item.imagen)", width="100", v-if="props.item.imagen != 'null'")
              td.text-xs-center {{ props.item.fecha_creacion }}
              td.text-xs-center
                v-chip(color='light-blue', text-color='white', v-if="checkResult(props.item.enviado)")
                  | {{ props.item.fecha_envio }}
                  v-icon(right) check
                v-btn(color='green', class='white--text', round, @click="sendMessage(props.item.id)", v-else)
                  | Enviar
                  v-icon(right) send
          template(slot='expand', slot-scope='props')
            v-card(flat, color="primary")
              v-layout(row, wrap)
                v-flex.md12.px-2.py-2
                  v-data-table.elevation-1(
                    :headers="userheaders", 
                    :items="usuariosMensaje", 
                    rows-per-page-text="items por pagina", no-data-text="Ningun usuario", 
                    :rows-per-page-items="pag" 
                    :pagination.sync="pagination", select-all, item-key="id", :search="search")
                    template(slot="userheaders", slot-scope="propeds")
                      tr
                        th(v-for="header in propeds.headers", :key="header.text", :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']", @click="changeSort(header.value)")
                          v-icon(small) arrow_upward
                          | {{ header.text }}
                    template(slot="items", slot-scope="propeds")
                      tr
                        td.text-xs-center {{ propeds.item.ci }}
                        td.text-xs-center {{ propeds.item.nombre }}
                        td.text-xs-center
                          v-chip(color='light-blue', text-color='white', v-if="checkResult(propeds.item.entregado)")
                            | {{ propeds.item.fecha_entregado }}
                            v-icon(right) check
                          v-chip(color='orange', text-color='white', v-else)
                            | Pendiente
                            v-icon(right) query_builder
                        td.text-xs-center
                          v-chip(color='light-blue', text-color='white', v-if="checkResult(propeds.item.leido)")
                            | {{ propeds.item.fecha_leido }}
                            v-icon(right) check
                          v-chip(color='orange', text-color='white', v-else)
                            | Pendiente
                            v-icon(right) query_builder
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
        usuariosMensaje: [],
        loaderMain: false,
        search: '',
        pagination: { sortBy: 'fecha_creacion', 'descending': true },
        pag: [10, 20, 50, { text: 'Todos', value: -1 }],
        headers: [
          { text: '', align: 'center' },
          { text: 'Codigo', align: 'center', value: 'id' },
          { text: 'Titulo', align: 'center', value: 'titulo' },
          { text: 'Mensaje', align: 'center', value: 'mensaje' },
          { text: 'Imagen', align: 'center', value: 'imagen' },
          { text: 'Creación', align: 'center', value: 'fecha_creacion' },
          { text: 'Enviado', align: 'center', value: 'enviado' }
        ],
        userheaders: [
          { text: 'Usuario', align: 'center', value: 'id' },
          { text: 'Entregado', align: 'center', value: 'titulo' },
          { text: 'Leido', align: 'center', value: 'mensaje' }
        ]
      }
    },
    methods: {
      checkResult(value) {
        if (value === '1') {
          return true
        }
        return false
      },
      openData (props) {
        props.expanded = !props.expanded
        this.getUsuariosMensajes(props.item.id)
      },
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
      getUsuariosMensajes (idMensaje) {
        this.usuariosMensaje = []
        http.getUsuariosMensaje(idMensaje).then(res => {
          this.usuariosMensaje = res.data
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
