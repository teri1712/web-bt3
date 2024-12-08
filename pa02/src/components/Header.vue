<!-- eslint-disable vue/multi-word-component-names -->
<script>
export default {
  data() {
    return {}
  },
  props: {
    modelValue: Boolean,
  },
  methods: {
    updateTheme() {
      this.$emit('update:modelValue', !this.modelValue)
    },
  },
}
</script>
<template>
  <div
    id="header"
    class="rounded border d-flex flex-row px-3 align-items-center"
    :style="{
      backgroundColor: !modelValue ? 'darkred' : 'rgb(241, 188, 188)',
    }"
  >
    <div
      class="flex-grow-0 flex-shrink-0"
      :style="{
        color: !modelValue ? 'rgb(241, 188, 188)' : 'grey',
      }"
    >
      20120220
    </div>
    <h3
      class="flex-grow-1 flex-shrink-0 text-center m-0 p-0"
      :style="{
        color: !modelValue ? 'rgb(241, 188, 188)' : 'black',
      }"
    >
      Movies Info
    </h3>
    <div class="flex-grow-0 flex-shrink-0">
      <div class="custom-control custom-switch switch-inner-container">
        <input
          type="checkbox"
          class="custom-control-input"
          id="switch-button"
          :checked="modelValue"
          @change.prevent="updateTheme"
        />
        <label class="custom-control-label" for="switch-button">
          <i
            :class="!modelValue ? 'fa-solid fa-moon' : 'fa-solid fa-gear'"
            :style="{ color: !modelValue ? '#ffd43b' : 'black', 'vertical-align': 'bottom' }"
          ></i>
        </label>
      </div>
    </div>
  </div>
</template>
<style>
label {
  line-height: 20px;
  vertical-align: bottom;
}
.switch-inner-container {
  vertical-align: middle;
  display: inline-block;
  height: 20px;
}
</style>
