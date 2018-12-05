<template lang="pug">
  div
    v-dialog(v-model='dialogSendNow', persistent='', max-width='290')
      v-card
        v-card-title.headline Enviar mensaje ahora?
        v-card-text
          | Puede enviar este mensaje ahora mismo o elegir enviarlo posteriormente.
        v-card-actions
          v-spacer
          v-btn(color='primary darken-1', flat='', @click='sendMessageLater') Enviar Luego
          v-btn(color='green darken-1', flat='', @click='sendMessageNow') Enviar Ahora
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
                #drop(@drop='handleDrop', @click='handleDrop', @dragover='handleDragover', @dragenter='handleDragover') {{ messageImageLoader }}
                  input(type='file', @change='onFileChange', multiple)
            v-layout(row, justify-center)
              v-flex.xs12
                v-btn(dark, color='deep-orange', @click='closeForm')
                  | Cancelar 
                  v-icon clear
                v-btn(dark, color='orange', @click='clear')
                  v-icon refresh
                v-btn(dark, color='green', @click='submit')
                  |
                  Guardar 
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
              v-card-title.title Agregar Personas
              v-divider
              v-layout(row, wrap, px-3)
                v-flex.md12(style='overflow:hidden;')
                  v-card-text
                    v-text-field(append-icon="search", label="Buscar...", single-line hide-details, v-model="searchPersona")
                  v-divider
                  div(style='height: 600px;overflow:auto;')
                    div(v-for='usuario in usuariosImportar', v-bind:key='usuario.id', v-if="usuario.visible", style='height:30px;')
                      v-checkbox(:label='usuario.nombre', v-model='usuario.select', light)
                  v-divider
                  v-card-actions
                    v-spacer
                    v-btn(color='grey darken-1', flat, @click.native='showDialogAddPersona = false') Cancelar
                    v-btn(color='green darken-1', flat, @click='agregarUsuarios', v-if="countUsuariosParaImportar() > 0") Agregar ({{ countUsuariosParaImportar() }})
        
        v-tooltip(top)
          v-btn(icon, @click.native="showDialogAddGrupo = true", slot='activator')
            v-icon group
          span Agregar Grupo
          v-dialog(v-model='showDialogAddGrupo', persistent, scrollable, max-width='400px')
            v-card
              v-card-title.title Agregar Grupos
              v-divider
              v-layout(row, wrap, px-3)
                v-flex.md12
                  v-card-text(style='overflow:hidden;')
                    v-text-field(append-icon="search", label="Buscar...", single-line hide-details, v-model="searchGrupo")
                    div(style='overflow:auto;max-height: 300px;')
                      div(v-for='grupo in gruposImportar', v-bind:key='grupo.id', v-if="grupo.visible", style='height:30px;')
                        v-checkbox(:label='grupo.nombre', v-model='grupo.select', light)
                  v-divider
                  v-card-actions
                    v-spacer
                    v-btn(color='grey darken-1', flat, @click.native='showDialogAddGrupo = false') Cancelar
                    v-btn(color='green darken-1', flat, @click='agregarGrupos', v-if="countGruposParaImportar() > 0") Agregar ({{ countGruposParaImportar() }})
        
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
        tituloForm: '',
        mensajeForm: '',
        imageForm: null,
        showAlive: false,
        showDialogAddPersona: false,
        showDialogAddGrupo: false,
        search: '',
        searchPersona: '',
        searchGrupo: '',
        usuarios: [],
        usuariosImportar: [],
        gruposImportar: [],
        loaderUsuarios: false,
        dialogSendNow: false,
        idMensaje: 0,
        pagination: {
          sortBy: 'ci'
        },
        selected: [],
        headers: [
          { text: '', value: '' },
          { text: 'Documento', align: 'center', value: 'ci' },
          { text: 'Nombre', align: 'center', value: 'nombre' },
          { text: 'Grupo', value: 'nombre' }
        ],
        messageImageLoader: 'Click o Arrastre Aqui (jpg, png, jpeg)'
      }
    },
    methods: {
      sendMessageLater () {
        this.dialogSendNow = false
        this.clear()
      },
      sendMessageNow () {
        this.sendMessage()
        this.dialogSendNow = false
        this.clear()
      },
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
            this.showDialogAddPersona = false

            if (!this.checkIfExist(element.id)) {
              this.usuarios.push(element)
            }
          }
        }, this)
      },
      agregarGrupos () {
        this.gruposImportar.forEach(function (element) {
          if (element.select) {
            console.log(element)
            element.select = false
            //this.usuarios.push(element)
            this.showDialogAddGrupo = false

            http.getUsuariosGrupo(element.id).then(res => {
              res.data.data.forEach(function (element) {
                var bloqueado = true
                let temp = { select: !bloqueado, id: element.id, nombre: element.nombre, ci: element.ci, bloqueado: bloqueado, visible: true }
                
                if (!this.checkIfExist(element.id)) {
                  this.usuarios.push(temp) 
                }
              }, this)
            }, (error) => {
              console.log(error)
            })


          }
        }, this)
      },
      checkIfExist (idSend) {
        console.log(idSend)
        let response = false
        this.usuarios.forEach(function (element) {
          if (element.id === idSend) {
            console.log('EXiist')
            response = true
          }
        }, this)
        return response
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
      countGruposParaImportar () {
        let counter = 0
        this.gruposImportar.forEach(function (element) {
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
            var bloqueado = true
            /* this.usuarios.forEach(function (usuario) {
              if (usuario.id === element.id) {
                bloqueado = true
              }
            }, this) */

            let temp = { select: !bloqueado, id: element.id, nombre: element.nombre, ci: element.ci, bloqueado: bloqueado, visible: true }
            this.usuariosImportar.push(temp) 
          }, this)
        }, (error) => {
          console.log(error)
        })
        console.log(this.usuariosImportar)
      },
      getGruposImportar () {
        this.gruposImportar = []
        http.getAllGrupos().then(res => {
          res.data.data.forEach(function (element) {
            var bloqueado = true
            let temp = { select: !bloqueado, id: element.id, nombre: element.nombre, codigo: element.codigo, bloqueado: bloqueado, visible: true }
            this.gruposImportar.push(temp)
            console.log(element)
          }, this)
        }, (error) => {
          console.log(error)
        })
        console.log(this.gruposImportar)
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
      submit () {
        if(this.tituloForm != '' && this.mensajeForm != '' && usuarios != ''){
          var usuarios = ''
          this.usuarios.forEach(function (element) {
            usuarios += element.id + '-' + element.ci + '|'
          }, this)
          const mensaje = `titulo=${this.tituloForm}&mensaje=${this.mensajeForm}&imagen=${this.imageForm}&usuarios=${usuarios}`
          http.saveMensaje(mensaje).then(res => {
            this.idMensaje = res.data.id_mensaje
            console.log(res.data.id_mensaje)
            this.dialogSendNow = true
          }, (error) => {
            this.showError = true
            console.log(error)
          })
        } else {
          alert('Datos incompletos.')
        }
      },
      sendMessage () {
        const mensaje = `id_mensaje=${this.idMensaje}`
        http.sendMessage(mensaje).then(res => {
          console.log(res.data)
        }, (error) => {
          console.log(error)
        })
      },
      handleDrop (e) { // arrastrar una imagen
        if (e.dataTransfer) {
          this.loading = true
          let _this = this
          e.stopPropagation()
          e.preventDefault()
          var files = e.dataTransfer.files
          for (var i = 0; i < files.length; i++) {
            var f = files[i]
            if (_this.validateFile(f)) {
              var reader = new FileReader()
              reader.onload = function (e) {
                var data = e.target.result
                _this.sendToList(data)
              }
              reader.readAsDataURL(f)
            }
          }
        }
      },
      onFileChange (e) { // seleccionar una imagen
        this.loading = true
        let _this = this
        var files = e.target.files || e.dataTransfer.files
        for (var i = 0; i < files.length; i++) {
          var f = files[i]
          if (_this.validateFile(f)) {
            var reader = new FileReader()
            reader.onload = function (e) {
              var data = e.target.result
              _this.sendToList(data)
            }
            reader.readAsDataURL(f)
          }
        }
      },
      handleDragover (e) {
        e.stopPropagation()
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
      },
      validateFile (f) { // Check if is a valid file
        let extension = f.name.split('.').pop()
        if (['png', 'jpg', 'jpeg'].includes(extension)) {
          this.messageImageLoader = f.name
          return true
        } else {
          this.messageImageLoader = 'Debe cargar un archivo con una extensión valida.', 'Archivo invalido'
          // this.cancelFile()
          this.imageForm = null
          return false
        }
      },
      cancelFile () {
        this.messageImageLoader = 'Click o Arrastre Aqui (xls, xlsx, csv, ods)'
        this.imageForm = null
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
        this.messageImageLoader = 'Click o Arrastre Aqui (jpg, png, jpeg)'
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
      this.getGruposImportar()
    },
    watch: {
      searchPersona (newVal, oldVal) {
        if(newVal.length > 1) {
          this.usuariosImportar.forEach(function (element) {
            element.visible = false
            if (element.nombre.includes(newVal)) {
              element.visible = true
            }
          }, this)
        } else { // clear search
          this.usuariosImportar.forEach(function (element) {
            element.visible = true
          }, this)
        }
      },
      searchGrupo (newVal, oldVal) {
        if(newVal.length > 1) {
          this.gruposImportar.forEach(function (element) {
            // console.log(element.nombre)
            element.visible = false
            if (element.nombre.includes(newVal)) {
              console.log(element.nombre)
              element.visible = true
            }
          }, this)
        } else { // clear search
          this.gruposImportar.forEach(function (element) {
            element.visible = true
          }, this)
        }
      }
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
