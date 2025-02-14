import Motion from './components/Motion.vue'

export { Motion }

export default {
  install: (app) => {
    app.component('Motion', Motion)
  }
}
