import dm5 from 'dmx-api'

export default {
  props: {
    // The topic/assoc to display.
    // May be an "empty" object, without ID, with just type set.
    object: {
      type: dm5.DMXObject,
      required: true
    }
  }
}
