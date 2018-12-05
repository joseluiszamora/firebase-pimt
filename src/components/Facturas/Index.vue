<template lang="pug">
  v-card(color='white')
    v-toolbar(color='amber darken-3', dark)
      v-toolbar-title Todas mis Facturas
      v-spacer
      v-btn(icon, dark, @click.native="getAllFacturas")
        v-icon refresh
      v-tooltip(top)
        v-btn(flat, icon, dark, slot='activator', :href="urlReportExcel" target="_blank")
          v-icon save
        span Reporte Excel
    v-layout(row, wrap, justify-end)
      v-flex.md6
        v-text-field(append-icon="search", label="Buscar...", single-line hide-details, v-model="search")
    v-layout(row, wrap, pt-3)
      v-flex.md12
        loader(message="Cargando Facturas", v-show="loaderFactura")
        v-data-table.elevation-1(
          v-model="selected", 
          :headers="headers", 
          :items="facturas", 
          :search="search", 
           v-show="!loaderFactura" 
           :rows-per-page-items="pag" 
          :pagination.sync="pagination", select-all, item-key="id")
          template(slot="headers", slot-scope="props")
            tr
              th(v-for="header in props.headers", :key="header.text", :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']", @click="changeSort(header.value)")
                v-icon(small) arrow_upward
                | {{ header.text }}
          template(slot="items", slot-scope="props")
            tr(:active="props.selected", @click="props.selected = !props.selected")
              td.text-xs-center {{ props.item.nit }}
              td.text-xs-center {{ props.item.factura }}
              td.text-xs-center {{ props.item.auth }}
              td.text-xs-center {{ props.item.control }}
              td.text-xs-center {{ props.item.fecha }}
              td.text-xs-center {{ props.item.nitci }}
              td.text-xs-center {{ props.item.monto }}
              td.text-xs-center
                v-btn(round, color="error", @click.native="deleteFactura(props.item.id)") Eliminar
</template>

<script>
  import http from '@/http/backend'
  import loader from '../Shared/Loader.vue'
  import imageprofile from '../Shared/Imageprofile.vue'
import { log } from 'util';
  export default {
    components: { loader, imageprofile },
    data () {
      return {
        tituloForm: 'Este es el titulo',
        mensajeForm: 'Lorem ipsum.',
        imageForm: null,
        showAlive: true,
        facturas: [],
        search: '',
        loaderFactura: false,
        urlReportExcel: 'http://pimt.miteleferico.bo/api/factura/excel',
        pagination: {
          sortBy: 'ci'
        },
        selected: [],
        headers: [
          { text: 'Nit', align: 'center', value: 'nit' },
          { text: 'Factura', align: 'center', value: 'factura' },
          { text: 'Autorización', align: 'center', value: 'auth' },
          { text: 'Codigo de Control', align: 'center', value: 'control' },
          { text: 'Fecha', align: 'center', value: 'fecha' },
          { text: 'Nit/Ci', align: 'center', value: 'nitci' },
          { text: 'Monto', align: 'center', value: 'monto' }
        ],
        pag: [10, 20, 50, { text: 'Todos', value: -1 }]
      }
    },
    methods: {
      getAllFacturas () {
        this.loaderFactura = true
        http.getAllFacturas().then(res => {
          this.facturas = res.data.data
          this.loaderFactura = false
        }, (error) => {
          console.log(error)
        })
      },
      deleteFactura (id) {
        http.deleteFactura(id).then(res => {
          this.getAllFacturas()
        }, (error) => {
          console.log(error)
        })
      },
      reportTxt () {
        console.log("Report")
      },
      toggleAll () {
        if (this.selected.length) this.selected = []
        else this.selected = this.facturas.slice()
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
      this.getAllFacturas()
    }
  }
</script>