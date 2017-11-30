export default {

  data () {
    return {
      localMode: this.mode
    }
  },

  // TODO: needed? Hide global Edit button once local edit starts.
  watch: {
    mode () {
      console.log('mode watcher', this.mode, this.object.typeUri, this.object.value)
      this.localMode = this.mode
    }
  }
}
