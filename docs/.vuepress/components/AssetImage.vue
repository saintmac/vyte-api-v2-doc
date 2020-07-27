<template>
  <p>
    <img :src="$withBase(`/assets/${srcHtml}`)" :alt="altHtml" :title="titleHtml">
  </p>
</template>

<script>
  export default {
    props: ['srcHtml', 'altHtml', 'titleHtml']
  }
</script>