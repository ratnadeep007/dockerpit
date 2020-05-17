<template>
  <div class="home">
    <v-container>
      <p class="headline">Dashboard</p>
      <p class="title">Containers</p>
      <p>Running: {{ containerRunningCount }}</p>
      <p>Stopped: {{ containerStoppedCount }}</p>
      <p>Total: {{ containersCount }}</p>
      <p class="title">Images</p>
      <p>Total: {{ imagesCount }}</p>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      dockers: {},
      containers: [],
      images: [],
      dialogOpened: false,
      dialogText: '',
      selectedContainer: '',
      containersCount: 0,
      containerRunningCount: 0,
      containerStoppedCount: 0,
      imagesCount: 0,
    }
  },
  created() {
    console.log('created')
    this.getAll()
  },
  methods: {
    openDialog(action, id) {
      this.dialogText = action;
      this.dialogOpened = !this.dialogOpened
      this.selectedContainer = id
    },
    containerAction() {
      console.log(this.selectedContainer)
      axios
          .get(`http://localhost:3000/container/${this.selectedContainer}/?action=${this.dialogText}`)
          .then(res => {
            this.dialogOpened = !this.dialogOpened
            console.log(res.data)
            this.getAll()
          })
          .catch(err => console.log(err))
    },
    getAll() {
      axios
      .get('http://localhost:3000/home')
      .then(res => {
        console.log(res.data)
        this.containers = res.data.containers
        this.dockers = res.data
        this.containersCount = res.data.containers.length
        this.images = res.data.images
        let tempImageCount =  0;
        let tempImages = [];
        let tempContainerRunning = [];
        let tempContainerStopped = [];

        tempContainerRunning = this.containers.filter(container => container['State'] == 'running')
        tempContainerStopped = this.containers.filter(container => container['State'] != 'running')

        console.log(tempContainerRunning)
        this.containerStoppedCount = tempContainerStopped.length
        this.containerRunningCount = tempContainerRunning.length

        if (this.$store.state.showK8sImages) {
          this.imagesCount = res.data.images.length
        } else {
          tempImages = this.images.filter(image => !image.RepoTags[0].includes('k8s'))
          tempImages = tempImages.filter(image => !image.RepoTags[0].includes('kube'))
          tempImages = tempImages.filter(image => !image.RepoTags[0].includes('docker/desktop'))
          this.imagesCount = tempImages.length
        }
      })
    }
  }
}
</script>
