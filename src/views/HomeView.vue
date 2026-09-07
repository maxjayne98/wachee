<template>
  <section>
    <div>
      <div>
        <div v-for="(shows, genre) in showsByGenres" :key="genre">
          <div class="card-title">{{ genre }}</div>
          <div>
            <div class="show-card-container">
              <ShowCard v-for="show in shows" :key="show.id" :show="show" :tagline="show.summary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useShowList } from '@/store/showList'
import ShowCard from '@/components/ShowCard.vue'

const INITIAL_PAGES = [1, 2, 3, 4, 5]
const { shows, fetchShows, showsByGenres } = useShowList()

onMounted(async () => {
  await fetchShows(INITIAL_PAGES)
  console.log('shows:: ', shows.value.length)
})
</script>
<style lang="scss">
.show-card-container {
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  justify-content: flex-start;
  overflow-x: auto;
  height: 500px;
}
.card-title {
  text-align: left;
  font-size: 2rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
}
</style>
