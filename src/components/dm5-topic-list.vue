<template>
  <div class="dm5-topic-list">
    <div class="field-label info">{{count}} Topics, sorted by</div>
    <el-select v-model="sort">
      <el-option label="Topic" value="topic"></el-option>
      <el-option label="Topic Type" value="type"></el-option>
      <el-option label="Association Type" value="assoc"></el-option>
    </el-select>
    <div class="groups">
      <div v-for="group in groups">
        <h4 v-if="sort !== 'topic'">{{group.title}} ({{group.topics.length}})</h4>
        <dm5-topic v-for="topic in group.topics" :topic="topic" :key="topic.id"></dm5-topic>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  props: ['topics'],    // undefined at creation

  data () {
    return {
      sort: 'type'
    }
  },

  computed: {

    groups () {
      const groups = []
      if (this.topics) {
        this.topics.sort(this.compareFn())
        if (this.sort === 'topic') {
          groups.push({topics: this.topics})
        } else {
          const select = selectFn[this.sort]
          let title   // current title
          let group   // current group
          this.topics.forEach(topic => {
            const _title = startGroup()
            if (_title) {
              title = _title
              group = {title, topics: [topic]}
              groups.push(group)
            } else {
              group.topics.push(topic)
            }

            function startGroup () {
              const _title = select(topic)
              return _title !== title && _title
            }
          })
        }
      }
      return groups
    },

    count () {
      return this.topics && this.topics.length
    }
  },

  methods: {
    compareFn () {
      const select = selectFn[this.sort]
      return (t1, t2) => {
        return select(t1).localeCompare(select(t2))
      }
    }
  },

  components: {
    'dm5-topic': require('./dm5-topic')
  }
}

const selectFn = {
  topic: (topic) => topic.value,
  type:  (topic) => topic.typeName,
  assoc: (topic) => topic.assoc.typeName
}
</script>

<style>
.dm5-topic-list .info {
  margin-top: 1em;
}

.dm5-topic-list .groups {
  margin-top: 2em;
}

.dm5-topic-list .dm5-topic {
  border-bottom: 1px solid var(--border-color);
  background-color: white;
  transition: background-color 0.25s;
  padding: 12px;
}

.dm5-topic-list .dm5-topic:nth-of-type(1) {
  border-top: 1px solid var(--border-color);
}

.dm5-topic-list .dm5-topic:hover {
  background-color: var(--border-color);
}
</style>
