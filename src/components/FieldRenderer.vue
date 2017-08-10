<template>
  <div class="field-renderer" v-if="object">
    <!-- simple -->
    <div v-if="isSimple" class="field">
      <div class="field-label">{{label}}</div>
      <component :is="simpleComp" v-model="object.value" :mode="mode"></component>
    </div>
    <!-- composite -->
    <div v-else v-for="assocDef in assocDefs" :key="assocDef.id">
      <!-- one -->
      <field-renderer v-if="isOne(assocDef)" :object="childs(assocDef)" :mode="mode">
      </field-renderer>
      <!-- many -->
      <field-renderer v-else v-for="object in childs(assocDef)" :object="object" :mode="mode" :key="object.id">
      </field-renderer>
    </div>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  name: 'field-renderer',

  props: [
    'object',   // the Topic/Assoc to render; is never undefined;
                // may be an "empty" topic/assoc, without ID, with just type set
    'mode'      // 'info' or 'form'
  ],

  computed: {

    type () {
      return this.object.getType()
    },

    label () {
      return this.type.value
    },

    isSimple () {
      return this.type.isSimple()
    },

    assocDefs () {
      return this.type.assocDefs
    },

    simpleComp () {
      return this.type.dataType.substr('dm4.core.'.length) + '-field'
    }
  },

  methods: {

    isOne (assocDef) {
      return assocDef.isOne()
    },

    childs (assocDef) {
      return this.object.childs[assocDef.assocDefUri]
    }
  },

  components: {
    'text-field':    require('./TextField'),
    'number-field':  require('./NumberField'),
    'boolean-field': require('./BooleanField'),
    'html-field':    require('./HtmlField')
  }
}
</script>

<style>
.field-renderer .field {
  margin-top: 1.2em;
}
</style>
