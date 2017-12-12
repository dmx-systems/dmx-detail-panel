<template>
  <div :class="['child-topic', mode, levelClass]">
    <!-- Note: object.assoc is undefined when object is a relating assoc -->
    <object-renderer v-if="showRelatingAssoc" :object="object.assoc" :mode="mode" :level="level" :assoc-def="assocDef">
    </object-renderer>
    <object-renderer :object="object" :mode="mode" :level="level" :assoc-def="assocDef">
    </object-renderer>
    <!-- Reveal Button -->
    <el-button class="hover-button" v-if="showRevealButton" type="text" @click="reveal">Reveal</el-button>
    <!-- Remove Button -->
    <el-button class="hover-button remove" v-if="showRemoveButton" type="text" @click="remove">Remove</el-button>
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

    showRevealButton () {
      return this.infoMode && this.level === 1
    },

    showRemoveButton () {
      return this.formMode && this.assocDef.isMany()
    }
  },

  methods: {

    reveal () {
      this.$store.dispatch('revealRelatedTopic', {
        relTopic: this.object,
        pos: {x: 100, y: 100}   // TODO
      })
    },

    remove () {
      // TODO
    }
  }
}
</script>

<style>
.child-topic {
  position: relative;
}

/* Hover Button */

.child-topic .hover-button {
  position: absolute;
  top: 0;
  right: 0;
  visibility: hidden;
  font-size: var(--label-font-size) !important;
  padding: 0;
}

.child-topic:hover .hover-button {
  visibility: visible;
}

/* Reveal Button */

.child-topic.info.level-1:hover {
  box-shadow: var(--shadow-hover) var(--highlight-color);
}

/* Remove Button */

.child-topic.form.multi:hover {
  box-shadow: var(--shadow-hover) var(--color-danger);
}

.child-topic .hover-button.remove {
  color: var(--color-danger);
}
</style>
