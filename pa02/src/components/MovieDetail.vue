<!-- eslint-disable vue/multi-word-component-names -->
<script>
import dbFetch from '../db/query-provider'

export default {
  props: ['movieId'],
  data() {
    return {
      info: null,
    }
  },
  inject: ['onViewActor'],
  methods: {
    async loadInfo() {
      this.info = (await dbFetch('detail/movie/' + this.movieId)).detail
    },
  },
  mounted() {
    this.loadInfo()
  },
  watch: {
    movieId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.info = null
        this.loadInfo()
      }
    },
  },
}
</script>
<template>
  <div class="movie-container" v-if="info != null">
    <div class="movie-header">
      <img class="movie-poster" :src="info.image" />
      <div class="movie-detail">
        <h1 class="movie-title display-3">{{ info.title }}</h1>
        <p><strong>Genre:</strong> {{ info.genre }}</p>
        <p><strong>Year:</strong> {{ info.year }}</p>
        <p><strong>Director:</strong> {{ info.director }}</p>
      </div>
      <i class="fa-regular fa-heart fav-button fa-2x m-3" title="thay đổi yêu thích"></i>
    </div>
    <div class="info-brief">
      <h3 style="font-weight: 600">Tóm tắt</h3>
      <p>
        {{ info.plot }}
      </p>
    </div>
    <div class="cast">
      <h3 style="font-weight: 600">Diễn viên</h3>
      <ul>
        <li v-for="(actor, index) in info.actorList" :key="index" @click="onViewActor(actor)">
          <strong>{{ actor.name }}:</strong> {{ actor.asCharacter }}
        </li>
      </ul>
    </div>
    <div class="review">
      <h3 style="font-weight: 600">Reviews</h3>
      <form class="rounded border p-2 mb-2">
        <div class="form-group">
          <textarea
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            placeholder="Hãy ghi đánh giá của bạn"
          ></textarea>
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-primary">Submit</button>
        </div>
      </form>

      <ul class="list-group">
        <li class="list-group-item" v-for="(review, index) in info.reviews" :key="index">
          <strong>{{ review.username }}:</strong> {{ review.content }}
        </li>
      </ul>
    </div>
  </div>
</template>
<style>
.fav-button {
  cursor: pointer;
}
.movie-detail p {
  font-size: 1.3em;
}
.movie-detail strong {
  font-style: italic;
}
.movie-title {
  font-family: 'Times New Roman', Times, serif;
}
.movie-container {
  margin: auto;
  padding: 20px;
}
.movie-header {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
}
.movie-poster {
  width: 350px;
  height: 525px;
  background-color: aqua;
  object-fit: cover;
}
.movie-detail {
  margin-left: 80px;
  flex: 1;
}
.movie-detail h1 {
  margin-top: 0;
  font-weight: 600;
}
.genre {
  color: #888;
}
.info-brief,
.cast,
.review {
  margin-top: 30px;
}
.cast,
.review ul {
  list-style-type: none;
  padding: 0;
}
.cast,
.review li {
  margin-bottom: 5px;
}

.cast li {
  cursor: pointer;
}
.review strong {
  font-style: italic;
  font-size: 1.1em;
}
</style>
