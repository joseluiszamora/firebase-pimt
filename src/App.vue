<template>
    <component :is="component">
        <slot />
    </component>
</template>

<script>
    import VuebaseLayout from './layouts/VuebaseLayout'
    import AuthLayout from './layouts/AuthLayout'

    export default {
        name: 'App',

        components: {
            VuebaseLayout,
            AuthLayout
        },

        computed: {
            component () {
                return VuebaseLayout
            },
            componentAuth () {
                return AuthLayout
            }
        }
    }
</script>
