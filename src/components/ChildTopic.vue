<template>
  <div class="child-topic">
    <!-- Note: object.assoc is undefined when object is a relating assoc -->
    <object-renderer v-if="showRelatingAssoc" :object="object.assoc" :mode="mode" :assoc-def="assocDef">
    </object-renderer>
    <object-renderer :object="object" :mode="mode" :assoc-def="assocDef">
    </object-renderer>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  beforeCreate () {
    // Note: postponed loading resolves cyclic dependency between <object-renderer> and <child-topics>
    this.$options.components.ObjectRenderer = require('./ObjectRenderer')
  },

  computed: {
    showRelatingAssoc () {
      if (this.object.assoc) {
        // sanity check
        if (this.object.assoc.typeUri !== this.assocDef.instanceLevelAssocTypeUri) {
          throw Error(`Type mismatch`)
        }
        //
        return this.assocDef.getInstanceLevelAssocType().isComposite()
      }
    }
  },

  mixins: [
    require('./mixins/object').default,     // child topic to render
    require('./mixins/mode').default,
    require('./mixins/assocDef').default    // assoc def leading to child topic
  ]
}
</script>

<style>
</style>
