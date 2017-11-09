<template>
  <div v-if="infoMode">{{object[prop]}}</div>
  <el-checkbox v-else v-model="object[prop]"></el-checkbox>
</template>

<script>
export default {
  mixins: [
    require('./mixins/object').default,
    require('./mixins/prop').default,
    require('./mixins/mode').default,
    require('./mixins/infoMode').default
  ]
}
</script>
