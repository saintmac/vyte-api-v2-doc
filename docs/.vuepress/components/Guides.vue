<template>
  <div v-if="data.guides && data.guides.length" class="guides">
    <div v-for="(guide, index) in data.guides" :key="index" class="guide">
      <img
        :src="$withBase(`/assets/img/${guide.image}.svg`)"
        alt="Vyte API - Webhooks"
      />
      <h2>{{ guide.title }}</h2>
      <p>{{ guide.details }}</p>
      <p v-if="guide.path">
        <a :href="`/guides/${guide.path}`">See the guide →</a>
      </p>
      <p v-else>Coming soon</p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    data() {
      return this.$page.frontmatter;
    },
  },
};
</script>

<style lang="stylus" scoped>
.guides {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: stretch;
  justify-content: space-between;
}

.guide {
  flex-grow: 1;
  flex-basis: 350px;
  width: 350px;
  border: 1px solid $borderColor;
  border-radius: 10px;
  text-align: center;
  padding: 1.2rem 0.5rem;
  margin: 1.2rem 1.2rem;
  min-height: 400px;

  img {
    border: 0;
    max-width: 100%;
    vertical-align: middle;
    display: inline-block;
  }

  h2 {
    font-size: 1rem;
    font-weight: 500;
    border-bottom: none;
    padding-bottom: 0;
    color: lighten($textColor, 10%);
    height: 2.5rem;
  }

  p {
    color: lighten($textColor, 25%);
    font-size: 0.8rem;
    height: 2.5rem;
  }
}

@media (max-width: 848px){
  .guide {
    width: 100%;
    border: 1px solid $borderColor;
    border-radius: 10px;
    text-align: center;
    padding: 1.2rem 0.5rem;
    margin: 1.2rem 0;
    min-height: 400px;
  }
}
</style>
