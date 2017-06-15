<template>
  <div class="dm5-detail-panel">
    <el-tabs v-if="object">
      <el-tab-pane :label="object.typeName">
        <h3>{{object.value}}</h3>
        <field-renderer :object="object" :mode="mode"></field-renderer>
        <el-button class="button" size="small" @click="buttonAction">{{buttonLabel}}</el-button>
      </el-tab-pane>
      <el-tab-pane label="Related">
        <el-table :data="relatedTopics" :default-sort="{prop: 'typeName'}" @row-click="revealTopic">
          <el-table-column prop="value"    label="Topic" sortable></el-table-column>
          <el-table-column prop="typeName" label="Type"  sortable></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Meta">
      </el-tab-pane>
      <el-tab-pane label="Config">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  props: [
    'object',   // the Topic/Association to display; if undefined an empty detail panel is rendered
    'mode'      // 'info' or 'form'
  ],

  data () {
    return {
      relatedTopics: undefined
    }
  },

  computed: {
    buttonLabel () {
      return this.infoMode ? 'Edit' : 'OK'
    }
  },

  watch: {
    object: function () {
      // TODO: retrieve lazy
      console.log('Retrieving related topics of topic', this.object.id)
      dm5.restClient.getTopicRelatedTopics(this.object.id).then(topics => {
        this.relatedTopics = topics
      })
    }
  },

  methods: {

    buttonAction () {
      var action = this.infoMode ? 'edit' : 'submit'
      this.$store.dispatch(action)
    },

    revealTopic (topic) {
      console.log('Revealing topic', topic.id)
      // TODO
    }
  },

  mixins: [
    require('./mixins/infoMode').default
  ],

  components: {
    'field-renderer': require('./FieldRenderer')
  }
}
</script>

<style>
.dm5-detail-panel .button {
  margin-top: 1em;
}

.dm5-detail-panel .el-tabs__item {
  font-size: var(--label-font-size);  /* was 14px */
  height: 40px;                       /* was 42px */
  padding: 0 14px;                    /* was 16px */
}
</style>
