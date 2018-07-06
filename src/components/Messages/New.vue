<template lang="pug">
  div
    v-card(color='white')
      v-toolbar(color='primary', dark)
        v-toolbar-side-icon
        v-toolbar-title Nuevo Mensaje
        v-spacer
        v-tooltip(top)
          v-btn(icon, @click.native="showAlive = !showAlive", slot='activator')
            v-icon(v-html="showAlive ? 'visibility_off' : 'visibility'")
          span(v-html="showAlive ? 'Ocultar mensaje compuesto' : 'Ver mensaje compuesto'")
      v-layout(row, wrap, pt-3)
        v-flex(:class='liveClass()')
          form.px-2
            v-layout(row, justify-center)
              v-flex.xs12
                v-text-field(label='Titulo', v-model='tituloForm', required)
            v-layout(row, justify-center)
              v-flex.xs12
                v-text-field(label='Mensaje', v-model='mensajeForm', multi-line)
            v-layout(row, wrap)
              v-flex(xs12)
                #drop(@drop='handleDrop', @click='handleDrop', @dragover='handleDragover', @dragenter='handleDragover') Click o Arrastre Aqui (jpg, png, jpeg)
                  input(type='file', @change='onFileChange', multiple)
            v-layout(row, justify-center)
              v-flex.xs12
                v-btn(dark, color='deep-orange', @click='closeForm')
                  | Cancelar 
                  v-icon clear
                v-btn(dark, color='orange', @click='clear')
                  v-icon refresh
                v-btn(dark, color='green', @click='submit')
                  | Guardar 
                  v-icon save
        v-flex.md6(v-if="showAlive")
          v-slide-y-transition(mode="out-in")
            v-card(color='white')
              v-card-text.display-1(style="text-align:center;") {{ tituloForm }}
              v-card-text {{ mensajeForm }}
              v-card(v-if="imageForm != null")
                v-card-media
                  img(:src="makeImage()", height="300")

    v-card(color='white')
      v-toolbar(color='primary', dark)
        v-toolbar-title Enviar a :
        v-spacer
        v-tooltip(top)
          v-btn(icon, @click.native="showDialogAddPersona = true", slot='activator')
            v-icon person_add
          span Agregar Persona
          v-dialog(v-model='showDialogAddPersona', persistent, scrollable, max-width='400px')
            v-card
              v-card-title.title Agregar personas al grupo
              v-divider
              v-layout(row, wrap, px-3)
                v-flex.md12
                  v-card-text(style='max-height: 300px;')
                    v-subheader Personas
                    div(v-for='usuario in usuariosImportar', v-bind:key='usuario.id', style='height:30px;')
                      v-checkbox(:label='usuario.nombre', v-model='usuario.select', light)
                  v-divider
                  v-card-actions
                    v-spacer
                    v-btn(color='grey darken-1', flat, @click.native='showDialogAddPersona = false') Cancelar
                    v-btn(color='green darken-1', flat, @click='agregarUsuarios', v-if="countUsuariosParaImportar() > 0") Agregar ({{ countUsuariosParaImportar() }})
        v-tooltip(top)
          v-btn(icon, @click.native="", slot='activator')
            v-icon group
          span Agregar Grupo
        v-tooltip(top)
          v-btn(icon, @click.native="", slot='activator')
            v-icon refresh
          span Eliminar Todo
      v-layout(row, wrap, justify-space-between)
        v-flex.md2
          v-btn.white--text(color='teal', round, @click="quitarUsuarios", v-show="selected.length > 0")
            | Eliminar ({{ selected.length }})

        v-flex.md6
          v-text-field(append-icon="search", label="Buscar...", single-line hide-details, v-model="search")
      v-layout(row, wrap, pt-3)
        loader(message="Cargando Usuarios", v-show="loaderUsuarios")
        v-flex.md12
          v-data-table.elevation-1(v-model="selected", :headers="headers", :items="usuarios", :pagination.sync="pagination", select-all, item-key="id", :search="search", no-data-text="Ninguna persona")
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
                  v-tooltip(top)
                    imageprofile(:documento="props.item.ci || 'null'", :width="100", slot='activator')
                    span {{ props.item.nombre }}
                td.text-xs-center {{ props.item.ci }}
                td.text-xs-center {{ props.item.nombre }}
                td.text-xs-center {{ props.item.id }}
</template>

<script>
  import http from '@/http/backend'
  import loader from '../Shared/Loader.vue'
  import imageprofile from '../Shared/Imageprofile.vue'
  import config from '../../config'
  export default {
    components: { loader, imageprofile },
    data () {
      return {
        tituloForm: 'Este es el titulo',
        mensajeForm: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras suscipit pulvinar ante, nec porttitor neque pulvinar vel. Phasellus nec elit eget eros luctus molestie. Donec nulla urna, euismod nec tortor id, ultricies viverra turpis. Integer ac enim vitae nisi congue vestibulum quis id tellus. Nunc id varius metus. Suspendisse a eros elementum, commodo eros sed, feugiat libero. Donec consectetur accumsan risus, et convallis magna. Duis euismod, erat ut laoreet consectetur, purus turpis vestibulum lorem, eu condimentum quam sem eget felis. Ut ac ornare eros. Curabitur purus dolor, vehicula id velit id, facilisis suscipit lorem. Sed vitae tincidunt diam. Suspendisse potenti. Proin dapibus arcu dignissim, scelerisque mauris eget, dapibus quam.',
        imageForm: null,
        showAlive: true,
        showDialogAddPersona: false,
        search: '',
        usuarios: [],
        usuariosImportar: [],
        loaderUsuarios: false,
        pagination: {
          sortBy: 'ci'
        },
        selected: [],
        headers: [
          { text: '', value: '' },
          { text: 'Documento', align: 'center', value: 'ci' },
          { text: 'Nombre', align: 'center', value: 'nombre' },
          { text: 'Grupo', value: 'nombre' }
        ]
      }
    },
    methods: {
      quitarUsuarios () {
        this.selected.forEach(function (element) {
          var index = this.usuarios.indexOf(element)
          this.usuarios.splice(index, 1)
        }, this)
      },
      agregarUsuarios () {
        this.usuariosImportar.forEach(function (element) {
          if (element.select) {
            console.log(element)
            element.select = false
            this.usuarios.push(element)
            this.showDialogAddPersona = false
          }
        }, this)
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
      getUsuariosImportar () {
        this.usuariosImportar = []
        http.getAllUsuarios().then(res => {
          res.data.data.forEach(function (element) {
            var bloqueado = false
            /* this.usuarios.forEach(function (usuario) {
              if (usuario.id === element.id) {
                bloqueado = true
              }
            }, this) */

            let temp = { select: !bloqueado, id: element.id, nombre: element.nombre, ci: element.ci, bloqueado: bloqueado }
            this.usuariosImportar.push(temp) 
          }, this)
        }, (error) => {
          console.log(error)
        })
        console.log(this.usuariosImportar)
      },
      makeImage () {
        return config.publicUrl + this.imageForm
      },
      liveClass () {
        if (this.showAlive) {
          return 'md6'
        }
        return 'md12'
      },
      closeForm () {
      },
      clear () {
      }, 
      submit () {
        var usuarios = ''
        this.usuarios.forEach(function (element) {
          usuarios += element.id + '-' + element.ci + '|'
        }, this)
        const mensaje = `titulo=${this.tituloForm}&mensaje=${this.mensajeForm}&imagen=${this.imageForm}&usuarios=${usuarios}`
        http.saveMensaje(mensaje).then(res => {
          console.log(res)
        }, (error) => {
          this.showError = true
          console.log(error)
        })
      },
      handleDrop (e) { // arrastrar una imagen
        if (e.dataTransfer) {
          this.loading = true
          e.stopPropagation()
          e.preventDefault()
          var files = e.dataTransfer.files
          for (var i = 0; i < files.length; i++) {
            var f = files[i]
            var reader = new FileReader()
            let _this = this
            reader.onload = function (e) {
              var data = e.target.result
              _this.sendToList(data)
            }
            reader.readAsDataURL(f)
          }
        }
      },
      onFileChange (e) { // seleccionar una imagen
        this.loading = true
        var files = e.target.files || e.dataTransfer.files
        for (var i = 0; i < files.length; i++) {
          var f = files[i]
          var reader = new FileReader()
          let _this = this
          reader.onload = function (e) {
            var data = e.target.result
            _this.sendToList(data)
          }
          reader.readAsDataURL(f)
        }
      },
      handleDragover (e) {
        e.stopPropagation()
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
      },
      sendToList (base64) { // agregar un elemento a la lista
        //this.imageForm = base64
        this.saveImagen(base64)
      },
      removeElement (key) { // remover imagen de la lista
        let tempArray = []
        this.imagesRevision.forEach(function (element, index) {
          if (element.id !== key) { tempArray.push(element) }
        }, this)
        this.imagesRevision = tempArray
      },
      clear () {
        this.tituloForm = null
        this.mensajeForm = null
        this.imageForm = null
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
      },
      saveImagen (element) {
        const image = `base64=${element}&folder=mensajes&descripcion=firebase`
        http.saveImage(image).then(res => {
          this.imageForm = res.data.archivo
        }, (error) => {
          this.showError = true
          console.log(error)
        })
      }
    },
    created () {
      this.getUsuariosImportar()
    }
  }
</script>
<style scoped>
  #drop {
    border: 2px dashed #bbb;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    padding: 25px;
    text-align: center;
    font: 20pt bold, "Vollkorn";
    color: #bbb;
    position: relative;
  }
  #drop input {
    position: absolute;
    cursor: pointer;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
</style>
