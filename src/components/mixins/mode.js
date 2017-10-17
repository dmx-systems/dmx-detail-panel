export default {
  props: {
    mode: {
      type: String,
      required: true,
      validator: mode => mode === 'info' || mode === 'form'
    }
  }
}
