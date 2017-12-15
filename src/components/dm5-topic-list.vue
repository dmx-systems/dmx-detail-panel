<template>
  <div class="dm5-topic-list">
    <div class="info label">{{relCount}} Topics, sorted by
      <el-select v-model="sort">
        <el-option label="Topic" value="topic"></el-option>
        <el-option label="Topic Type" value="type"></el-option>
        <el-option label="Association Type" value="assoc"></el-option>
      </el-select>
    </div>
    <dm5-topic v-for="topic in sortedTopics" :topic="topic" :key="topic.id"></dm5-topic>
  </div>
</template>

<script>
const sortFn = {
  topic (t1, t2) {
    return t1.value.localeCompare(t2.value)
  },
  type (t1, t2) {
    return t1.typeName.localeCompare(t2.typeName)
  },
  assoc (t1, t2) {
    return t1.assoc.typeName.localeCompare(t2.assoc.typeName)
  },
}

export default {

  props: ['topics'],    // undefined at creation

  data () {
    return {
      sort: 'type'
    }
  },

  computed: {

    sortedTopics () {
      console.log(this.sort, this.topics)
      return this.topics && this.topics.sort(sortFn[this.sort])
    },

    relCount () {
      return this.topics && this.topics.length
    }
  },

  components: {
    'dm5-topic': require('./dm5-topic')
  }
}
</script>

<style>
.dm5-topic-list .info {
  margin-top: 1em;
  margin-bottom: 2em;
}

.dm5-topic-list .dm5-topic {
  background-color: white;
  padding: 12px;
  transition: background-color 0.25s;
  border-bottom: 1px solid var(--border-color-lighter);
}

.dm5-topic-list .dm5-topic:nth-child(2) {
  border-top: 1px solid var(--border-color-lighter);
}

.dm5-topic-list .dm5-topic:hover {
  background-color: var(--background-color);
}
</style>
