export default {

  inject: ['context'],

  computed: {

    mode () {
      return this.context.mode
    },

    infoMode () {
      return this.mode === 'info'
    },

    formMode () {
      return this.mode === 'form'
    }
  }
}
