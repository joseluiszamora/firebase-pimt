<template lang="pug">
  div
    v-card(color='white')
      v-toolbar(color='primary', dark)
        v-toolbar-side-icon
        v-toolbar-title Nuevo Mensaje
        v-spacer
        v-btn(icon, @click.native="showAlive = !showAlive")
          v-icon visibility
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
                v-btn(dark, color='green', @click='clear')
                  | Guardar 
                  v-icon save
        v-flex.md6(v-if="showAlive")
          v-slide-y-transition(mode="out-in")
            v-card(color='white')
              v-card-text.display-1(style="text-align:center;") {{ tituloForm }}
              v-card-text {{ mensajeForm }}
              v-card(v-if="imageForm != null")
                v-card-media
                  img(:src="imageForm", height="300")

    //v-flex.md12.pt-4
      v-card(color='white')
        v-card-text Entregar a :

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
        http.sendMessage().then(res => {
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
        this.imageForm = base64
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
