<template>
  <li class="attributes-list-item">
    <h5 class="attributes-list-item-title">
      <span class="attributes-list-item-name">{{name}}</span> <span class="attributes-list-item-type">{{type}}</span> <Badge text="required" type="error" vertical="middle" v-if="required === 'true'"/>
    </h5>
    <div class="attributes-list-item-description">
      <slot></slot>
    </div>
  </li>
</template>

<script>
  export default {
    props: ['name', 'type', 'required']
  }
</script>

<style lang="scss" scoped>

li{
  list-style: none;
  border-bottom: 1px solid #eaecef;
  padding: 10px 0;

  h5{
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
    margin: 5px 0;
    line-height: 16px;

    span.attributes-list-item-type{
      font-size: 12px;
      color: #C9CED4;
    }

    /deep/ .badge{
      font-size: 10px;
      height: 16px;
      line-height: 16px;
    }
  }

  .attributes-list-item-description{
    font-size: 0.83em;
    margin: 5px 0;
  }
}
</style>