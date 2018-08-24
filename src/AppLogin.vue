<template>
  <component :is="component">
    <slot />
  </component>
</template>

<script>
    import AuthLayout from './layouts/AuthLayout'

    export default {
        name: 'App',

        components: {
          AuthLayout
        },

        computed: {
            component () {
              return AuthLayout
            }
        }
    }
</script>
