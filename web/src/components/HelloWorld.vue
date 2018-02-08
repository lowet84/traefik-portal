<template>
  <div class='hello'>
    {{data}}
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'HelloWorld',
  data () {
    return {
      data: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      await this.getItem('traefik')
      await this.getItem('public')
    },
    async getItem (value) {
      let data = (await axios.get(`/api/${value}`)).data
      data = data[Object.keys(data)[0]]
      let frontends = data.frontends
      console.log(frontends)
    }
  }
}
</script>

<style scoped>

</style>
