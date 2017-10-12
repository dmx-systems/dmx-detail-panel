<template>
  <div>
    <div class="field-label">Association Type</div>
    <div v-if="infoMode">{{assoc.typeName}}</div>
    <el-select v-else v-model="assoc.typeUri" size="small">
      <el-option v-for="assocType in assocTypes" :label="assocType.value" :value="assocType.uri" :key="assocType.uri">
      </el-option>
    </el-select>
    <object-renderer :object="assoc" :mode="mode"></object-renderer>
  </div>
</template>

<script>
export default {

  props: [
    'assoc',    // the Assoc to render
    'mode'      // 'info' or 'form'
  ],

  computed: {
    assocTypes () {
      return this.$store.state.typeCache.assocTypes
    }
  },

  mixins: [
    require('./mixins/infoMode').default
  ],

  components: {
    'object-renderer': require('./ObjectRenderer')
  }
}
</script>

<style>
</style>
