<template>
  <div class="dm5-topic-list">
    <dm5-topic v-for="topic in topics" :topic="topic" :key="topic.id"></dm5-topic>
  </div>
</template>

<script>
export default {

  props: ['topics'],

  components: {
    'dm5-topic': require('./dm5-topic')
  }
}
</script>

<style>
.dm5-topic-list .dm5-topic {
  background-color: white;
  border-bottom: 1px solid var(--border-color-lighter);
  padding: 12px;
  transition: background-color 0.25s;
}

.dm5-topic-list .dm5-topic:hover {
  background-color: var(--background-color);
}
</style>
