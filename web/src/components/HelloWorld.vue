<template>
  <div class='hello'>
    <div draggable="true" v-for="service in services" :key=service.name class="box" :id="`service_${service.name}`">
      <a class="link" :href="`https://${service.url}`">
        <img class="image" :alt="service.name" :src="service.image">
        <div class="text">
          {{service.name}}
          <a :href="`https://www.google.se/search?q=${service.name}+logo&tbm=isch`"><img class="search" src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-search-strong-128.png"></a>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'HelloWorld',
  data () {
    return {
      services: [],
      traefiks: ['traefik', 'public']
    }
  },
  created () {
    this.init()
    document.ondrop = async function (event) {
      event.preventDefault()
      var imageUrl = event.dataTransfer.getData('text/uri-list')
      var box = event.path.find(d => d.id.startsWith('service_'))
      await axios.post('/download', { url: imageUrl, id: box.id.replace('service_', '') })
      this.init()
    }
    document.ondragover = function (event) {
      event.preventDefault()
    }
  },
  methods: {
    async init () {
      this.services = (await axios.get('/api')).data
    }
  }
}
</script>

<style scoped>
.hello {
  display: flex;
  flex-wrap: wrap;
}
.box {
  width: 9em;
  height: 9em;
  border-style: solid;
  border-width: 1px;
  margin: 1em;
  position: relative;
}
.link {
  width: 100%;
  height: 100%;
}
.image {
  width: 100%;
  height: 100%;
}
.text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: lightgray;
  align-content: center;
  width: 100%;
  padding-top: 5px;
  padding-bottom: 5px;
  opacity: 0.1;
  transition: 0.5s;
}
.text:hover {
  opacity: 0.7;
}
.search {
  height: 1em;
  width: 1em;
}
</style>
