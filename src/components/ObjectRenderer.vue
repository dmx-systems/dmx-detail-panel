<template>
  <div class="object-renderer">
    <!-- simple -->
    <div v-if="isSimple" class="field">
      <div class="field-label">{{label}}</div>
      <component :is="simpleComp" v-model="object.value" :mode="mode"></component>
    </div>
    <!-- composite -->
    <template v-else v-for="assocDef in assocDefs">
      <!-- one -->
      <template v-if="isOne(assocDef)">
        <object-renderer v-if="childs(assocDef)" :object="childs(assocDef)" :mode="mode">
        </object-renderer>
      </template>
      <!-- many -->
      <object-renderer v-else v-for="object in childs(assocDef)" :object="object" :mode="mode" :key="object.id">
      </object-renderer>
    </template>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  name: 'object-renderer',

  props: {
    // the Topic/Assoc to render; is never undefined;
    // may be an "empty" topic/assoc, without ID, with just type set
    object: {
      type: dm5.DeepaMehtaObject,
      required: true
    },
    // 'info' or 'form'
    mode: {
      type: String,
      required: true,
      validator: mode => mode === 'info' || mode === 'form'
    }
  },

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
      return this.type.dataTypeUri.substr('dm4.core.'.length) + '-field'
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
