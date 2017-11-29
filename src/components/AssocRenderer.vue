<template>
  <div class="assoc-renderer">
    <!-- Association Type -->
    <div class="field">
      <div class="field-label">Association Type</div>
      <div v-if="infoMode">{{assoc.typeName}}</div>
      <el-select v-else v-model="assoc.typeUri">
        <el-option v-for="assocType in assocTypes" :label="assocType.value" :value="assocType.uri" :key="assocType.uri">
        </el-option>
      </el-select>
    </div>
    <!-- Generic Object -->
    <object-renderer :object="assoc" :mode="mode"></object-renderer>
    <!-- Roles -->
    <assoc-role :role="assoc.role1" :mode="mode"></assoc-role>
    <assoc-role :role="assoc.role2" :mode="mode"></assoc-role>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  props: {
    // the Assoc to render
    assoc: {
      type: dm5.Assoc,
      required: true
    }
  },

  computed: {
    assocTypes () {
      return this.$store.state.typeCache.assocTypes
    }
  },

  mixins: [
    require('./mixins/mode').default,
    require('./mixins/infoMode').default
  ],

  components: {
    'assoc-role': require('./AssocRole'),
    'object-renderer': require('./ObjectRenderer')
  }
}
</script>

<style>
</style>
