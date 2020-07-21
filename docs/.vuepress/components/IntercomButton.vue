<template>
  <span><a href="#" @click.prevent="showIntercom">Intercom</a></span>
</template>

<script>
  export default {
    methods: {
      showIntercom() {
        this.$intercom.showMessages()
      }
    }
  }
</script>
