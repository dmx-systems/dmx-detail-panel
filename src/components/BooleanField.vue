<template>
  <div v-if="infoMode">{{value}}</div>
  <el-checkbox v-else :value="value" @input="updateValue"></el-checkbox>
</template>

<script>
export default {

  props: ['value', 'mode'],

  methods: {
    updateValue (value) {
      console.log('updateValue', value)
      this.$emit("input", value)
    }
  },

  mixins: [
    require('./mixins/infoMode').default
  ]
}
</script>
