<template>
  <div v-if="infoMode">{{value}}</div>
  <div v-else>
    <el-checkbox :value="value" @input="updateValue"></el-checkbox>
  </div>
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
