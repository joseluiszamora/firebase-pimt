<template>
    <v-app>
        <v-navigation-drawer
					width="250"
					class="blue-grey darken-4"
					dark
					persistent
					:mini-variant="miniVariant"
					v-model="drawer"
					fixed
					app >
            <v-toolbar flat class="transparent" dense>
							<v-list class="pa-0" :class="{'list-border-bottom' : miniVariant}">
								<v-list-tile>
									<v-list-tile-action v-if="!miniVariant">
										<v-icon large color="orange">invert_colors</v-icon>
									</v-list-tile-action>
									<v-list-tile-content v-if="!miniVariant">
										<v-list-tile-title><h2>piMT</h2></v-list-tile-title>
									</v-list-tile-content>
									<v-list-tile-action>
										<v-btn icon @click.stop="miniVariant = !miniVariant">
											<v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
										</v-btn>
									</v-list-tile-action>
								</v-list-tile>
							</v-list>
            </v-toolbar>

            <v-divider></v-divider>

            <v-tooltip right :disabled="!miniVariant">
							<v-toolbar flat class="transparent" dense slot="activator">
								<v-list class="pa-0" :class="{'list-border-bottom' : miniVariant}">
									<v-list-tile
										to="/"
										exact >
											<v-list-tile-action>
												<v-icon>home</v-icon>
											</v-list-tile-action>
											<v-list-tile-content>
												<v-list-tile-title>Inicio</v-list-tile-title>
											</v-list-tile-content>
									</v-list-tile>
								</v-list>
							</v-toolbar>
							<span>Inicio</span>
            </v-tooltip>

            <v-divider></v-divider>

            <v-list subheader>
							<v-subheader>USUARIOS</v-subheader>
							<template v-for="item in developItems">
									<v-tooltip right :disabled="!miniVariant">
										<v-list-tile
											:key="item.icon"
											:to="item.link"
											exact
											slot="activator">
												<v-list-tile-action>
													<v-icon v-html="item.icon"></v-icon>
												</v-list-tile-action>
												<v-list-tile-content>
													<v-list-tile-title v-text="item.title"></v-list-tile-title>
												</v-list-tile-content>
										</v-list-tile>
										<span v-text="item.title"></span>
									</v-tooltip>
							</template>
            </v-list>
            
            <v-divider></v-divider>

						<v-list subheader :class="{'list-border-bottom' : miniVariant}">
                <v-subheader>MENSAJES</v-subheader>
                <template v-for="item in messages">
									<v-tooltip right :disabled="!miniVariant">
										<v-list-tile
											:key="item.icon"
											:to="item.link"
											exact
											slot="activator">
												<v-list-tile-action>
													<v-icon v-html="item.icon"></v-icon>
												</v-list-tile-action>
												<v-list-tile-content>
													<v-list-tile-title v-text="item.title"></v-list-tile-title>
												</v-list-tile-content>
										</v-list-tile>
										<span v-text="item.title"></span>
									</v-tooltip>
                </template>
            </v-list>

						<v-divider></v-divider>

						<!--<v-list subheader :class="{'list-border-bottom' : miniVariant}">
							<v-subheader>NOTIFICACIONES</v-subheader>
							<template v-for="item in notificactions">
								<v-tooltip right :disabled="!miniVariant">
									<v-list-tile
										:key="item.icon"
										:to="item.link"
										exact
										slot="activator">
											<v-list-tile-action>
												<v-icon v-html="item.icon"></v-icon>
											</v-list-tile-action>
											<v-list-tile-content>
												<v-list-tile-title v-text="item.title"></v-list-tile-title>
											</v-list-tile-content>
									</v-list-tile>
									<span v-text="item.title"></span>
								</v-tooltip>
							</template>
            </v-list>-->

						<v-list subheader :class="{'list-border-bottom' : miniVariant}">
							<v-subheader>FACTURAS</v-subheader>
							<template v-for="item in facturas">
								<v-tooltip right :disabled="!miniVariant">
									<v-list-tile
										:key="item.icon"
										:to="item.link"
										exact
										slot="activator">
											<v-list-tile-action>
												<v-icon v-html="item.icon"></v-icon>
											</v-list-tile-action>
											<v-list-tile-content>
												<v-list-tile-title v-text="item.title"></v-list-tile-title>
											</v-list-tile-content>
									</v-list-tile>
									<span v-text="item.title"></span>
								</v-tooltip>
							</template>
            </v-list>

        </v-navigation-drawer>

        <v-toolbar
					app
					flat
					dense
					color="amber darken-3"
					dark>
            <v-toolbar-side-icon
							@click.stop="drawer = !drawer"
							class="hidden-lg-and-up"
							:class="searching ? 'hidden-xs-only' : ''"
            />

            <v-spacer></v-spacer>

            <!--<v-btn icon @click.native.stop="searchBegin">
							<v-icon>search</v-icon>
            </v-btn>
            <div :class="{'searching--closed': !searching}" class="searching">
							<v-text-field
								id="search"
								v-model="search"
								append-icon="close"
								:append-icon-cb="searchEnd"
								label="Search"
								hide-details
								single-line
								color="white"
								@blur="onBlur"/>
            </div>

            <v-tooltip bottom>
							<v-btn icon @click.stop="rightDrawer = !rightDrawer" slot="activator">
								<v-badge color="red" overlap>
									<span slot="badge">2</span>
									<v-icon>notifications</v-icon>
								</v-badge>
							</v-btn>
							<span>2 notificationes nuevas</span>
            </v-tooltip>
						-->
            <v-menu bottom left>
							<v-btn icon slot="activator">
								<v-avatar class="white" size="32">
									<image-profile :src="getSession.imagen" :width="40"></image-profile>
								</v-avatar>
							</v-btn>
							<v-list class="pa-0">
								<v-list-tile avatar>
									<v-list-tile-avatar>
										<v-avatar class="primary" size="48px">
											<image-profile :src="getSession.imagen" :width="50"></image-profile>
										</v-avatar>
									</v-list-tile-avatar>
									<v-list-tile-content>
										<v-list-tile-title>{{ getSession.username }}</v-list-tile-title>
										<!--<v-list-tile-sub-title>Administrator</v-list-tile-sub-title>-->
									</v-list-tile-content>
								</v-list-tile>
								<v-divider></v-divider>

								<v-list-tile key="lock_open" @click="logout()">
									<v-list-tile-action>
										<v-icon>lock_open</v-icon>
									</v-list-tile-action>
									<v-list-tile-content>
										<v-list-tile-title>Salir</v-list-tile-title>
									</v-list-tile-content>
								</v-list-tile>
							</v-list>
            </v-menu>
        </v-toolbar>

        <v-content>
            <router-view />
        </v-content>

        <v-navigation-drawer
					temporary
					:right="right"
					v-model="rightDrawer"
					fixed
					app>
            <v-toolbar flat prominent dark class="primary">
							<v-toolbar-title>Notifications</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-btn icon @click.stop="rightDrawer = false">
								<v-icon>close</v-icon>
							</v-btn>
            </v-toolbar>
            <v-list subheader dense>
							<v-subheader>All notifications</v-subheader>
							<v-list-tile>
								<v-list-tile-action>
									<v-icon>person_add</v-icon>
								</v-list-tile-action>
								<v-list-tile-title>
									12 new users registered
								</v-list-tile-title>
							</v-list-tile>
							<v-divider></v-divider>
							<v-list-tile>
								<v-list-tile-action>
									<v-icon>data_usage</v-icon>
								</v-list-tile-action>
								<v-list-tile-title>
									DB overloaded 80%
								</v-list-tile-title>
							</v-list-tile>
            </v-list>
        </v-navigation-drawer>
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import ImageProfile from '@/components/Shared/Imageprofile'

export default {
  name: "VuebaseLayout",
	components: { ImageProfile },
  data() {
    return {
      drawer: true,
      fixed: false,
      developItems: [
        {
          icon: "person",
          title: "Usuarios",
          link: "/usuarios/index"
        },
        {
          icon: "supervisor_account",
          title: "Grupos",
          link: "/usuarios/grupos"
        }
      ],
      analyticsItems: [
        {
          icon: "dashboard",
          title: "Dashboard",
          link: "/dashboard/indicators"
        },
        {
          icon: "event",
          title: "Events",
          link: ""
        },
        {
          icon: "comment",
          title: "Notifications",
          link: ""
        }
      ],
      messages: [
        {
          icon: "comment",
          title: "mensajes",
          link: "/messages/index"
        },
        {
          icon: "playlist_add",
          title: "Nuevo Mensaje",
          link: "/messages/new"
        }
      ],
      notificactions: [
        {
          icon: "notifications",
          title: "Avisos",
          link: ""
        }
      ],
      facturas: [
        {
          icon: "notifications",
          title: "Facturas",
          link: "/facturas/index"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      tabs: null,
      tabsItems: [
        { id: 1, title: "Indicators", link: "indicators" },
        { id: 2, title: "Backup", link: "backup" },
        { id: 3, title: "Logs", link: "logs" }
      ],
      searching: false,
      search: ""
    };
  },
  computed: {
    ...mapGetters(['getSession'])
  },
  methods: {
    onBlur() {
      this.searching = false;
      this.search = "";
    },

    searchBegin() {
      this.searching = true;
      setTimeout(() => document.querySelector("#search").focus(), 50);
    },

    searchEnd() {
      this.searching = false;
      this.search = "";
      document.querySelector("#search").blur();
		},
		
		logout () {
			console.log('logout')
      this.$store.commit('logout')
    }
  }
};
</script>

<style scoped lang="stylus">
	@import '../../node_modules/vuetify/src/stylus/settings/_variables.styl';

	.bottom-menu {
		position: absolute;
		width: 100%;
		bottom: 0;
	}

	.searching {
		overflow: hidden;
		width: 208px;
		padding-left: 8px;
		transition: $primary-transition;
	}

	.searching--closed {
		padding-left: 0;
		width: 0;
	}

	.searching > * {
		right: 8px;
	}

	.searching--closed > * {
		display: none;
	}

	.hidden-searching {
		@media $display-breakpoints.sm-and-down {
			display: none !important;
		}
	}

	.list-border-bottom {
		border-bottom: 1px solid rgba(255, 255, 255, 0.12);
	}
</style>
