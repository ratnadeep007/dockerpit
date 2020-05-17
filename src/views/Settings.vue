<template>
  <div class="container">
    <v-container>
      <v-checkbox
        v-model="showK8s"
        :label="`Show Kubernetes Image`"
        @change="changeViewK8sImages"
      ></v-checkbox>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showK8s: this.$store.state.showK8sImages
    }
  },
  methods: {
    changeViewK8sImages() {
      this.$store.commit('changeK8sImageShow')
    }
  }
}
</script>