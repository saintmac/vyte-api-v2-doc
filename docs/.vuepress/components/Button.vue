<template>
  <div>
    <a :href="path" class="action-button">
      <slot>></slot>
    </a>
  </div>
</template>

<script>
export default {
  props: ["path"],
};
</script>

<style lang="stylus" scoped>
.action-button {
  display: inline-block;
  font-size: 1.2rem;
  color: #fff;
  background-color: $accentColor;
  padding: 0.8rem 1.6rem;
  border-radius: 4px;
  transition: background-color 0.1s ease;
  box-sizing: border-box;
  border-bottom: 1px solid darken($accentColor, 10%);

  &:hover {
    background-color: lighten($accentColor, 10%);
    text-decoration: none !important;
  }
}
</style>