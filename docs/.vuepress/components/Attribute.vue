<template>
  <li class="attributes-list-item" v-bind:class="{ 'attributes-list-item-isChild': isChild, 'attributes-list-item-isLast': isLast }">
    <h5 class="attributes-list-item-title">
      <span class="attributes-list-item-parent-name" v-if="parentNames">{{parentNameFormatted}}</span><span class="attributes-list-item-name">{{name}}</span><span class="attributes-list-item-type">{{type}}</span> <Badge text="required" type="error" vertical="middle" v-if="required"/>
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
        if(this.isParentArray){
          return this.parentNames.reduce((acc, cur, index) => (index === this.parentNames.length - 1) ?  acc + cur : acc + cur + ".", "") + ((this.isParentArray) ? "[0]." : "")
        }else{
          return this.parentNames.reduce((acc, cur) => acc + cur + ".", "")
        }
        
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
    margin: 5px 0;
    line-height: 16px;
    font-size: 13px;
    color: #3c4257;

    span{
      margin-right: 4px;
    }

    span.attributes-list-item-name{
      font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
    }

    span.attributes-list-item-parent-name{
      font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
      color: #8792a2;
      margin:0;
    }

    span.attributes-list-item-type{
      font-size: 12px;
      color:#8792a2;
      margin-right: 4px;
      font-weight: 500;
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