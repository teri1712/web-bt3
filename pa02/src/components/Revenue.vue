<!-- eslint-disable vue/multi-word-component-names -->
<script>
import dbFetch from '../db/query-provider'

export default {
  data() {
    this.dummy_book_interval = null
    this.top5_books = []
    return {
      current_index: -1,
      dummy_index: -1,
      dummy_book_opacity: 0,
      main_book_opacity: 1,
    }
  },
  mounted() {
    this.fetchItems()
  },
  inject: ['onViewMovie'],

  methods: {
    async fetchItems() {
      this.top5_books = (await dbFetch('get/top5revenue')).items
      if (this.top5_books.length === 0) {
        return
      }
      console.log(this.top5_books)
      this.current_index = 0
      this.dummy_index = 0
    },
    performSwitchBook(index) {
      this.dummy_index = this.current_index
      this.current_index = index

      this.dummy_book_opacity = 1
      this.main_book_opacity = 0.2
      if (this.dummy_book_interval != null) {
        clearInterval(this.dummy_book_interval)
      }
      let current_time = 0
      this.dummy_book_interval = setInterval(() => {
        current_time += 20
        if (current_time >= 500) {
          clearInterval(this.dummy_book_interval)
          this.dummy_book_interval = null
        }
        this.main_book_opacity = Math.min(1, current_time / 500)
        this.dummy_book_opacity = Math.max(0, 1 - current_time / 500)
      }, 20)
    },
    switchNextBook() {
      let index = this.current_index + 1
      if (index === 5) {
        index = 0
      }
      this.performSwitchBook(index)
    },
    switchPrevBook() {
      let index = this.current_index - 1
      if (index === -1) {
        index = 4
      }
      this.performSwitchBook(index)
    },
  },
}
</script>
<template>
  <div
    class="d-flex align-items-center mb-1 px-5 flex-grow-1 flex-shrink-1 flex-basis-400px justify-content-between"
  >
    <div id="back" @click="switchPrevBook">
      <i class="fa-solid fa-angle-left"></i>
    </div>
    <div
      id="show-book"
      class="flex-grow-0 flex-shrink-1"
      v-if="current_index != -1"
      @click="onViewMovie(top5_books[current_index].id)"
    >
      <div>
        <img
          class="rounded border"
          id="main-book"
          :src="top5_books[current_index].image"
          :style="{
            opacity: main_book_opacity,
          }"
        />
        <img
          id="dummy-book"
          :src="top5_books[dummy_index].image"
          :style="{
            opacity: dummy_book_opacity,
          }"
        />
        <p class="book-info book-info-title">{{ top5_books[current_index].fullTitle }}</p>
        <p class="book-info book-info-genre">{{ top5_books[current_index].genre }}</p>
        <p class="book-info book-info-rating">
          Rating: {{ top5_books[current_index].ratings.imDb }}
        </p>
        <p class="book-info book-info-runtime">
          Length: {{ top5_books[current_index].runtimeStr }}
        </p>
      </div>
    </div>
    <div id="next" @click="switchNextBook">
      <i class="fa-solid fa-angle-right"></i>
    </div>
  </div>
</template>
<style>
.book-info {
  margin-bottom: 40px;
  bottom: 0;
  position: absolute;
  text-align: center;
  width: 100%;
  left: 0;
  color: yellow;
}
.book-info-title {
  font-size: 1.5em;
  font-weight: 600;
  bottom: 60px;
}
.book-info-genre {
  font-size: 1em;
  bottom: 40px;
}
.book-info-rating {
  font-size: 1.1em;
  font-style: italic;
  bottom: 20px;
}
.book-info-runtime {
  font-size: 1em;
  font-style: italic;
}
#show-book {
  cursor: pointer;
  flex-basis: 220px;
}
#show-book img {
  position: absolute;
  z-index: 0;
  height: 100%;
  width: 100%;
}
#show-book div {
  position: relative;
  height: 300px;
  margin: 0 auto;
}
#main-book {
  z-index: 1;
}
#dummy-book {
  z-index: 2;
}
#back,
#next {
  color: grey;
  flex: 0 0;
  cursor: pointer;
}
</style>
