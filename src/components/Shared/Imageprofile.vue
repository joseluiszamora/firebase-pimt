<template lang="pug">
  v-avatar
    img(:src="src", @error="imageLoadOnError", v-if="visible", :width="width")
</template>

<script>
export default {
  props: {
    src: { type: String, required: true },
    width: { type: Number, required: false }
  },
  name: 'image-profile',
  data () {
    return {
      visible: true
    }
  },
  methods: {
    imageLoadOnError () {
      this.visible = false
    }
  },
  created () {
    if (this.documento === null || this.documento === '' || this.documento === 'null') {
      this.visible = false
    }
  }
}
</script>