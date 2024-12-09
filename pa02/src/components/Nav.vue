<!-- eslint-disable vue/multi-word-component-names -->
<script>
export default {
  props: {
    light_mode: Boolean,
  },
  data() {
    return {
      currentQuery: '',
    }
  },
  methods: {
    submitQuery(query) {
      console.log(document.getElementById('op-search').value)
      this.$emit('searchAction', query)
    },
  },
}
</script>
<template>
  <div
    id="nav"
    class="rounded border d-flex flex-row px-3 align-items-center d-flex justify-content-between"
    :style="{
      backgroundColor: !light_mode ? 'darkblue' : 'lightblue',
    }"
  >
    <div
      id="home"
      class="flex-grow-0 flex-shrink-0"
      :style="{
        color: !light_mode ? 'white' : 'black',
      }"
    >
      <i class="fa-solid fa-house" @click="$emit('onHomePressed')" title="Trang chính"></i>
      <i
        class="fa-solid fa-heart fav-button m-3"
        style="color: #cc3d5c"
        title="Trang yêu thích"
      ></i>
    </div>
    <div class="flex-grow-0 flex-shrink-0">
      <form class="form-inline" @submit.prevent="submitQuery(currentQuery)">
        <select id="op-search" class="form-control mr-2">
          <option>Theo Phim</option>
          <option>Theo Diễn viên</option>
        </select>
        <input
          class="form-control"
          type="search"
          placeholder="Search"
          aria-label="Search"
          v-model="currentQuery"
          :style="{
            backgroundColor: light_mode ? 'white' : '#2D2E31',
            color: light_mode ? 'grey' : 'white',
          }"
        />
        <button class="btn btn-outline-success my-2 my-sm-0 ml-1" type="submit">Search</button>
      </form>
    </div>
  </div>
</template>
<style>
#home {
  cursor: pointer;
}
</style>
