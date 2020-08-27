<template>
  <div class="endpoint">
    <a :href="href" class="attribute-method">
      <span v-if="method === 'get'" class="attribute-method-get">GET</span>
      <span v-if="method === 'post'" class="attribute-method-post">POST</span>
      <span v-if="method === 'put'" class="attribute-method-put">PUT</span>
      <span v-if="method === 'delete'" class="attribute-method-delete"
        >DELETE</span
      >
      <span class="attribute-method-path">{{ path }}</span>
    </a>
  </div>
</template>

<script>
export default {
  props: ["method", "path", "href"],
};
</script>

<style lang="scss" scoped>
.endpoint {
  font-size: 13px;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  margin: 10px 0;

  a.attribute-method {
    &:hover {
      text-decoration: none;

      .attribute-method-get {
        filter: brightness(75%);
      }

      .attribute-method-post {
        filter: brightness(75%);
      }

      .attribute-method-put {
        filter: brightness(75%);
      }

      .attribute-method-delete {
        filter: brightness(75%);
      }

      .attribute-method-path {
        filter: brightness(75%);
      }
    }

    .attribute-method-get {
      color: #3a97d4;
    }

    .attribute-method-post {
      color: #1f9933;
    }

    .attribute-method-put {
      color: #e4d448;
    }

    .attribute-method-delete {
      color: #e56f4a;
    }

    .attribute-method-path {
      color: #697386;
    }
  }
}
</style>
