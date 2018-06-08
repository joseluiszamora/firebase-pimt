<template>
    <div>
        <v-toolbar
					dense
					color="primary"
					dark
					extended
					extension-height="300"
					flat
        >
            <v-toolbar-title class="mx-auto" slot="extension">
                <span>Bienvenido</span>
                <h2>Administrador Aplicación piMT.</h2>
                <v-layout row>
                    <v-flex wrap>
                        <v-btn outline large fab color="white" class="outine-2">
                            <i class="fab fa-android fa-3x"></i>
                        </v-btn>
                    </v-flex>
                    <v-flex wrap>
                        <v-btn outline large fab color="white" class="outine-2">
                            <i class="fab fa-google fa-3x"></i>
                        </v-btn>
                    </v-flex>
                    <v-flex wrap>
                        <v-btn outline large fab color="white" class="outine-2">
                            <i class="fab fa-vuejs fa-2x"></i>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-toolbar-title>
        </v-toolbar>

        <v-container>
            <v-layout row>
                <v-flex xs12 md8 offset-md2>
                    <v-card flat class="card--flex-toolbar" color="transparent">
                        <v-container fluid grid-list-lg>
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <h2 class="white--text">Secciones</h2>
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap>
                                <v-flex xs12 sm6 md6 lg3 v-for="item in links" :key="item.id">
                                    <v-card>
                                        <v-card-media
											src=""
											height="125px"
											:class="item.color"
                                        >
                                        </v-card-media>
                                        <v-card-title primary-title>
                                            <div>
                                                <h3 class="headline mb-0">{{item.title}}</h3>
                                                <div>
                                                    {{item.description}}
                                                </div>
                                            </div>
                                        </v-card-title>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary">ver</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
export default {
  data() {
    return {
      links: [
        {
          id: "1",
          title: "Inicio",
          description:
            "Sección Inicio.",
          color: "orange"
        },
        {
          id: "2",
          title: "Usuarios",
          description:
            "Sección Usuarios.",
          color: "teal"
        },
        {
          id: "3",
          title: "Mensajes",
          description:
            "Sección Mensajes.",
          color: "blue"
        },
        {
          id: "4",
          title: "Avisos",
          description:
            "Sección Avisos.",
          color: "purple"
        }
      ]
    };
  }
};
</script>

<style scoped>
	.outine-2 {
	border: 2px solid white;
	}

	.card--flex-toolbar {
	margin-top: -104px;
	}

	.learn-more-btn {
	text-transform: initial;
	text-decoration: underline;
	}
</style>
