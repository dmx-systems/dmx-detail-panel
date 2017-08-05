<template>
  <div v-if="infoMode">{{value}}</div>
  <div v-else>
    <el-input :value="value" @input="updateValue" type="number"></el-input>
  </div>
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
