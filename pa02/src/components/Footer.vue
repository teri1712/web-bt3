<!-- eslint-disable vue/multi-word-component-names -->
<script>
export default {
  props: {
    light_mode: Boolean,
  },
  data() {
    return {}
  },
}
</script>
<template>
  <div
    id="footer"
    class="my-2 rounded border px-2 py-1"
    :style="{
      color: light_mode ? 'black' : 'white',
    }"
  >
    &lt;footer&gt;
  </div>
</template>
<style></style>
