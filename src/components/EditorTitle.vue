<template>
  <h1 class="app-form-header">{{title}}</h1>
</template>

<script>
export default {
  name: 'edit-title',

  computed: {
    title() {
      const breadcrumb = this.$route.meta.breadcrumb
      const last = breadcrumb.length - 1
      return breadcrumb[last].name
    },
  },
}
</script>

<style>

</style>
