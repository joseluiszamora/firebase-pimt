<template>
    <div>
        <v-toolbar
            dense
            tabs
            color="amber darken-3"
            dark>
            <v-toolbar-title class="pl-2">Facturas</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tabs
                v-model="tabs"
                color="transparent"
                slider-color="white"
                slot="extension">
                <v-tab
                    v-for="tabsItem in tabsItems"
                    :key="tabsItem.id"
                    :to="tabsItem.link">
                    <span class="pl-2 pr-2">{{ tabsItem.title }}</span>
                </v-tab>
            </v-tabs>
        </v-toolbar>

        <v-container>
            <v-layout row justify-center>
                <v-flex xs12 md12>
                    <v-slide-y-transition mode="out-in">
                        <router-view />
                    </v-slide-y-transition>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                tabs: null,
                tabsItems: [
                    {id: 1, title: 'Lista', link: 'index'}
                ]
            }
        }
    }
</script>

<style scoped>

</style>
