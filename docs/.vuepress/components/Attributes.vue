<template>
  <div class="attributes">
    <h3>{{title}}</h3>
    <ul class="attributes-list">
      <slot></slot>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['title']
  }
</script>

<style lang="scss" scoped>

.attributes{  
  margin: 20px 0;

  h3{
    margin: 0;
    padding: 10px 0;
    border-bottom: 1px solid #eaecef;
  }

  ul{
    padding: 0;
    margin: 0;
  }
}
</style>