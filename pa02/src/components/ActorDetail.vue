<!-- eslint-disable vue/multi-word-component-names -->
<script>
import dbFetch from '../db/query-provider'

export default {
  props: ['info'],
  data() {
    return {
      detail: null,
    }
  },
  methods: {
    async loadDetail() {
      const detailInfo = (await dbFetch('detail/actor/' + this.info.id)).detail
      if (detailInfo.id === this.info.id) {
        this.detail = detailInfo
      }
    },
  },
  mounted() {
    this.loadDetail()
  },
  watch: {
    info(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.detail = null
        this.loadDetail()
      }
    },
  },
}
</script>
<template>
  <div class="actor-container" v-if="info != null">
    <div class="actor-header">
      <img class="actor-poster" :src="info.image" alt="Không thể truy cập link ảnh" />
      <div class="actor-detail">
        <h1>{{ info.name }}</h1>
        <p v-if="detail != null"><strong>Tiểu sử:</strong> {{ detail.summary }}</p>
      </div>
    </div>
    <div class="cast">
      <h4 style="font-weight: 600">Bộ phim</h4>
      <ul v-if="detail != null">
        <li v-for="(movie, index) in detail.movies" :key="index">
          <p>
            <strong>{{ movie.title }}</strong> ({{ movie.year }}),
            <span class="genre-movie">{{ movie.genre }}</span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
span {
  font-style: italic;
  color: coral;
}
.actor-container {
  margin: auto;
  padding: 20px;
}
.actor-header {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
}
.actor-poster {
  width: 300px;
  height: 450px;
  background-color: aqua;
  object-fit: cover;
}
.actor-detail {
  margin-left: 30px;
  flex: 1;
}
.actor-detail h1 {
  margin-top: 0;
  font-weight: 600;
}
.genre {
  color: #888;
}
.cast {
  margin-top: 30px;
}
.cast ul {
  list-style-type: none;
  padding: 0;
}
.cast li {
  margin-bottom: 5px;
}
</style>
