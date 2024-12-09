<script>
import dbFetch from '../db/query-provider'
export default {
  props: ['query'],
  data() {
    return {
      book_list: [],
      current_page: -1,
      per_page: -1,
      pages: 0,
    }
  },
  inject: ['onViewMovie'],
  methods: {
    async applyResult() {
      const asyncFetch = await dbFetch('search/movie/' + this.query + '?page=1&per_page=6')
      this.book_list = asyncFetch.items
      this.pages = []
      for (let i = 0; i < asyncFetch.total_page; i++) this.pages.push(i)
    },
  },
  mounted() {
    this.applyResult()
  },
  watch: {
    query(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.applyResult()
      }
    },
  },
}
</script>

<template>
  <div class="search-result">
    <div class="film-grid">
      <div
        class="book-element pb-1 rounded border"
        v-for="(book, index) in book_list"
        :key="index"
        @click="onViewMovie(book.id)"
      >
        <img class="mb-1" :src="book.image" />
        <p class="element-title">{{ book.fullTitle }}</p>
        <p class="element-type">{{ book.genre }}</p>
        <p class="element-type">Rating: {{ book.ratings.imDb }}</p>
        <p class="element-type">{{ book.runtimeStr }}</p>
      </div>
    </div>
    <nav>
      <ul id="nav-list" class="pagination">
        <li
          id="previous"
          class="page-item"
          :class="{
            disabled: current_page <= 0,
          }"
        >
          <a class="page-link" href="#" @click="previous"><i class="bi bi-arrow-left"></i> </a>
        </li>
        <li
          v-for="index in pages"
          :key="index"
          class="page-item"
          :class="{
            active: index === current_page,
          }"
        >
          <a href="#" class="page-link">{{ index + 1 }}</a>
        </li>
        <li
          id="next"
          class="page-item"
          :class="{
            disabled: totalPages <= current_page + 1,
          }"
          @click="next"
        >
          <a class="page-link" href="#"><i class="bi bi-arrow-right"></i></a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style>
#nav-list {
  margin-top: 10px;
}
.search-result {
  flex: 1 0;
}
.film-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.book-element {
  overflow: hidden;
}
.book-element p {
  text-align: center;
  margin: 3px;
}
.book-element img {
  width: 100%;
  cursor: pointer;
}
.element-title {
  font-size: 1.2em;
  font-weight: 600;
}
.element-type {
  font-size: 1em;
  color: grey;
  font-style: italic;
}
</style>
