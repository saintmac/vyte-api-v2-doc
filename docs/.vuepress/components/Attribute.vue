<template>
  <li class="attributes-list-item" v-bind:class="{ 'attributes-list-item-isChild': isChild, 'attributes-list-item-isLast': isLast }">
    <h5 class="attributes-list-item-title">
      <span class="attributes-list-item-parent-name" v-if="parentNames">{{parentNameFormatted}}</span><span class="attributes-list-item-name">{{name}}</span> <span class="attributes-list-item-type">{{type}}</span> <Badge text="required" type="error" vertical="middle" v-if="required"/>
    </h5>
    <div class="attributes-list-item-description">
      <slot></slot>
    </div>
  </li>
</template>

<script>
  export default {
    props: ['name', 'type', 'required', 'isChild', 'isLast', 'parentNames', 'isParentArray'],
    computed: {
      parentNameFormatted() {
        return this.parentNames.reduce((acc, cur, index) => acc + cur + ".", "") + ((this.isParentArray) ? "[0]." : "")
      }
    }
  }
</script>

<style lang="scss" scoped>

.attributes-list-item{
  list-style: none;
  padding: 10px 0;

  &:not(.attributes-list-item-isLast){
    border-bottom: 1px solid #eaecef;
  }

  .attributes-list-item-isChild{
    padding-left: 10px;
    padding-right: 10px;
  }

  .attributes-list-item-title{
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
    margin: 5px 0;
    line-height: 16px;
    font-size: 13px;

    span.attributes-list-item-parent-name{
      color: #C9CED4;
    }

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
    font-size: 13px;
    margin: 5px 0;
  }
}
</style>