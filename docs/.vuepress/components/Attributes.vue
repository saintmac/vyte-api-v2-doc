<template>
  <div class="attributes" v-bind:class="{ 'attributes-isChild': isChild }">
    <h3 v-if="!isChild">{{title}}</h3>
    <ul class="attributes-list" v-bind:class="{ 'attributes-list-isChild': isChild }">
      <slot></slot>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['title', 'isChild']
  }
  
</script>

<style lang="scss" scoped>

.attributes{  
  

  h3{
    margin: 0;
    padding: 10px 0;
    border-bottom: 1px solid #eaecef;
  }

  ul{
    padding: 0;
    margin: 0;
  }

  &:not(.attributes-isChild){
    margin: 20px 0;
  }

  &.attributes-isChild{
    border: 1px solid #eaecef;
    border-radius: 10px;
    margin: 10px 0;
  }
}
</style>