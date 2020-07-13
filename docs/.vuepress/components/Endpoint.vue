<template>
  <div class="endpoint">
    <a :href="href" class="attribute-method">
      <span v-if="method === 'get'" class="attribute-method-get">GET</span>
      <span v-if="method === 'post'" class="attribute-method-post">POST</span>
      <span v-if="method === 'put'" class="attribute-method-put">PUT</span>
      <span v-if="method === 'delete'" class="attribute-method-delete">DELETE</span> <span class="attribute-method-path">{{path}}</span>
    </a>
  </div>
</template>

<script>
  export default {
    props: ['method', 'path', 'href']
  }
</script>

<style lang="scss" scoped>
.endpoint{
  font-size: 13px;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  margin: 10px 0;

  a.attribute-method{
    &:hover{
      text-decoration: none;

      .attribute-method-get{
        color: #2b71a0;
      }

      .attribute-method-post{
        color: #064d37;
      }

      .attribute-method-put{
        color: #dac50e;
      }

      .attribute-method-delete{
        color: #e4592f;
      }

      .attribute-method-path{
        color: #373c46;
      }
    }

    .attribute-method-get{
      color: #3a97d4;
    }

    .attribute-method-post{
      color: #09825d;
    }

    .attribute-method-put{
        color: #e4d448;
      }


    .attribute-method-delete{
      color: #e56f4a;
    }

    .attribute-method-path{
      color: #697386;
    }
  }
}
</style>