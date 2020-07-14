<template>
  <div class="returns">
    <h4 class="returns-title">{{title}}</h4>
    <p v-if="isEmpty" class="returns-isEmpty">No returns.</p>
    <p>
      <slot></slot>
    </p>
  </div>
</template>

<script>
  export default {
    props: ['title', 'isEmpty'],
  }
  
</script>

<style lang="scss" scoped>

.returns{
  margin: 40px 0;

  h4{
    margin: 0;
    padding: 10px 0;
    border-bottom: 1px solid #eaecef;
  }

  p{
    font-size: 13px;

    &.returns-isEmpty{
      color: #8792a2;
    }
  }

}
</style>