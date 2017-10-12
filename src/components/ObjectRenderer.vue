<template>
  <div class="object-renderer" v-if="object">
    <!-- simple -->
    <div v-if="isSimple" class="field">
      <div class="field-label">{{label}}</div>
      <component :is="simpleComp" v-model="object.value" :mode="mode"></component>
    </div>
    <!-- composite -->
    <div v-else v-for="assocDef in assocDefs" :key="assocDef.id">
      <!-- one -->
      <object-renderer v-if="isOne(assocDef)" :object="childs(assocDef)" :mode="mode">
      </object-renderer>
      <!-- many -->
      <object-renderer v-else v-for="object in childs(assocDef)" :object="object" :mode="mode" :key="object.id">
      </object-renderer>
    </div>
  </div>
</template>

<script>
export default {

  name: 'object-renderer',

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
.object-renderer .field {
  margin-top: 1.2em;
}
</style>
