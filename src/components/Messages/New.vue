<template>
    <v-card color="white">
        <v-card-text>Nuevo</v-card-text>

        <form>
          <v-layout row wrap>
            <v-text-field
              label="Nombre de la Actividad"
              v-model="nombreDeActividad"
              :error-messages="nombreDeActividadErrors"
              @input="$v.nombreDeActividad.$touch()"
              @blur="$v.nombreDeActividad.$touch()"
              required
            ></v-text-field>
          </v-layout>

          <v-layout row justify-space-between>
            <v-flex class="md5">
              <v-layout row>
                <v-flex class="md10">
                  <v-text-field
                    slot="activator"
                    label="Inicio de Actividad (2018-01-31)"
                    v-model="fechaDeInicio"
                    :error-messages="fechaDeInicioErrors"
                    @input="$v.fechaDeInicio.$touch()"
                    @blur="$v.fechaDeInicio.$touch()"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex class="md2">
                  <v-menu
                    lazy
                    :close-on-content-click="false"
                    v-model="menu"
                    transition="scale-transition"
                    offset-y
                    full-width
                  >
                    <v-btn fab dark right small 
                    slot="activator"
                    readonly
                    color="primary">
                      <v-icon dark>event</v-icon>
                    </v-btn>
                    <v-date-picker v-model="fechaDeInicio" no-title scrollable actions :first-day-of-week="1" locale="es-sp">
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                        </v-card-actions>
                      </template>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-flex>
            
            <v-flex class="md5">
              <v-layout row>
                <v-flex class="md10">
                  <v-text-field
                    slot="activator"
                    label="Conclusión de la Actividad (2018-01-31)"
                    v-model="fechaDeConclusion"
                    :error-messages="fechaDeConclusionErrors"
                    @input="$v.fechaDeConclusion.$touch()"
                    @blur="$v.fechaDeConclusion.$touch()"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex class="md2">
                  <v-menu
                    lazy
                    :close-on-content-click="false"
                    v-model="menu2"
                    transition="scale-transition"
                    offset-y
                    full-width
                  >
                    <v-btn fab dark right small 
                    slot="activator"
                    readonly
                    color="primary">
                      <v-icon dark>event</v-icon>
                    </v-btn>
                    <v-date-picker v-model="fechaDeConclusion" no-title scrollable actions :first-day-of-week="1" locale="es-sp">
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                        </v-card-actions>
                      </template>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-text-field
              label="Descripción"
              v-model="descripcionDeObra"
            ></v-text-field>
          </v-layout>
          
          <v-layout row justify-center>
            <v-flex class="xs6">
              <v-btn dark color="deep-orange" @click="closeForm">Cancelar <v-icon>clear</v-icon></v-btn>
              <v-btn dark color="orange" @click="clear"><v-icon>refresh</v-icon></v-btn>
            </v-flex>
            <v-flex class="xs2" v-show="this.action === 'create'">
              <v-btn dark color="green" @click="submit">Guardar <v-icon>save</v-icon></v-btn>
            </v-flex>
            <v-flex class="xs2" v-show="this.action === 'edit' && this.actividadSelected != null">
              <v-btn dark color="green" @click="submitEdit">Editar <v-icon>edit</v-icon></v-btn>
            </v-flex>
          </v-layout>
        </form>
        
    </v-card>
</template>

<script>
    export default {
        
    }
</script>
