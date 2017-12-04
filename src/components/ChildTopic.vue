<template>
  <div :class="['child-topic', mode, levelClass]">
    <!-- Note: object.assoc is undefined when object is a relating assoc -->
    <object-renderer v-if="showRelatingAssoc" :object="object.assoc" :mode="mode" :level="level" :assoc-def="assocDef">
    </object-renderer>
    <object-renderer :object="object" :mode="mode" :level="level" :assoc-def="assocDef">
    </object-renderer>
    <!-- Reveal Button -->
    <el-button class="reveal-button" v-if="revealButtonVisibility" type="text" @click="reveal">
      {{object.typeName}}
    </el-button>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  mixins: [
    require('./mixins/object').default,     // child topic to render
    require('./mixins/mode').default,
    require('./mixins/infoMode').default,
    require('./mixins/level').default,
    require('./mixins/assocDef').default    // assoc def leading to child topic
  ],

  beforeCreate () {
    // Note: postponed loading resolves cyclic dependency between <object-renderer> and <child-topic>
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
    },

    levelClass () {
      return `level-${this.level}`
    },

    revealButtonVisibility () {
      return this.infoMode && this.level === 1
    }
  },

  methods: {
    reveal () {
      this.$store.dispatch('revealRelatedTopic', {
        relTopic: this.object,
        pos: {x: 100, y: 100}   // TODO
      })
    }
  }
}
</script>

<style>
.child-topic {
  position: relative;
}

.child-topic.info.level-1:hover {
  box-shadow: inset 0px 0px 1px var(--highlight-color);
}

.child-topic.info.level-1 > .reveal-button {
  position: absolute;
  top: 0;
  right: 0;
  visibility: hidden;
  font-size: var(--label-font-size) !important;
  padding: 0;
}

.child-topic.info.level-1:hover > .reveal-button {
  visibility: visible;
}
</style>
