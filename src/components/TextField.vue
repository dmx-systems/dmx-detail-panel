<template>
  <div v-if="infoMode">{{value}}</div>
  <el-input v-else :value="value" @input="updateValue" size="small"></el-input>
</template>

<script>
export default {

  props: ['value', 'mode'],

  methods: {
    updateValue (value) {
      this.$emit("input", value)
    }
  },

  mixins: [
    require('./mixins/infoMode').default
  ]
}
</script>
