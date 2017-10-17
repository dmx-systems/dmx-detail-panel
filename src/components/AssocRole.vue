<template>
  <div>
    <div v-if="player">{{player.typeName}}: "{{player.value}}"</div>
    <div class="field-label">Role Type</div>
    <div>{{role.typeName}}</div>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  data () {
    return {
      player: undefined
    }
  },

  props: {
    // the assoc role to render
    role: {
      type: dm5.AssocRole,
      required: true
    }
  },

  // for component instantiation
  created () {
    this.fetchPlayer()
  },

  // for component reuse
  watch: {
    role () {
      this.fetchPlayer()
    }
  },

  methods: {
    fetchPlayer () {
      this.role.getPlayer().then(player => {
        this.player = player
      })
    }
  }
}
</script>

<style>
</style>
