<template>
  <div class="attributes" v-bind:class="{ 'attributes-isChild': isChild, 'attributes-isChild-expanded': isExpanded}">
    <h3 
      class="attributes-title" 
      v-bind:class="{ 'attributes-title-isChild': isChild,  'attributes-title-isChild-expanded': isExpanded}" 
      v-if="isChild"
      v-on:click="expandChildAttributes()"
    >
      <span v-if="isExpanded">x Hide child attributes</span>
      <span v-else>+ Show child attributes</span>
    </h3>
    <h3 class="attributes-title" v-else>{{title}}</h3>
    <ul class="attributes-list" v-bind:class="{ 'attributes-list-isChild': isChild, 'attributes-list-isChild-expanded': isExpanded}">
      <slot></slot>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['title', 'isChild'],
    methods: {
      expandChildAttributes() {
        this.isExpanded = !this.isExpanded
      }
    },
    data() {
      return {
        isExpanded: false
      }
    }
  }
  
</script>

<style lang="scss" scoped>

.attributes{
  &:not(.attributes-isChild){
    margin: 20px 0;
  }

  &.attributes-isChild{
    border: 1px solid #eaecef;
    border-radius: 10px;
    margin: 0;
    display: inline-block;

    &.attributes-isChild-expanded{
      width: 100%;
    }
  }

  h3{

    &:not(.attributes-title-isChild){
      margin: 0;
      padding: 10px 0;
      border-bottom: 1px solid #eaecef;
    }

    &.attributes-title-isChild{
      font-size: 13px;
      font-weight: normal;
      display: inline-block;
      margin: 0;
      padding: 5px 10px;

      &:hover{
        color: #080b0f;
        cursor: pointer;
      }

      &.attributes-title-isChild-expanded{
        display: block;
        border-bottom: 1px solid #eaecef;
      }
    }
  }

  ul{
    padding: 0;
    margin: 0;

    &.attributes-list-isChild{
      display:none;


      &.attributes-list-isChild-expanded{
        display: block;
      }
    }
  }

}
</style>