<template>
  <div class="image">
    <v-container>
      <v-btn color="blue" class="white--text">
        <v-icon class="mr-1">add_photo_alternate</v-icon>
        New Image
      </v-btn>
      <v-btn @click="pullImage()" color="blue" class="white--text">
        <v-icon class="mr-1">arrow_downward</v-icon>
        Pull Image
      </v-btn>
      <div v-for="image in images" :key="image.Id">
        <v-card class="mt-2 elevativon-3" id="cards">
          <v-card-title primary-title>
            <div>
              <!-- <h3 class="headline mb-0">{{image.RepoTags[0].split(':')[0]}}</h3> -->
              <h3 v-for="(tag, index) in image.RepoTags" :key="index">
                {{tag}}
              </h3>
            </div>
          </v-card-title>
          <v-card-text>
            <b>Size: </b> {{image.Size / (1024 * 1024) | roundValuee }}
          </v-card-text>
          <v-card-actions>
            <v-hover><v-btn depressed class="green--text" slot-scope="{ hover }" :class="`elevation-${hover ? 9 : 0}`"><v-icon class="mr-1">done</v-icon> Run</v-btn></v-hover>
            <v-hover><v-btn depressed @click="openDialog('delete', image.Id)" class="red--text" slot-scope="{ hover }" :class="`elevation-${hover ? 9 : 0}`"><v-icon class="mr-1">delete_forever</v-icon> Delete</v-btn></v-hover>
          </v-card-actions>
        </v-card>
      </div>
      <br/>
      <v-dialog v-model="dialogOpened" max-width="30%">
        <v-card>
          <v-card-text class="headline">
            Are you sure you want to {{dialogText}} the container?
          </v-card-text>
          <v-card-actions>
            <v-btn @click="imageAction()" class="red--text">Yes</v-btn>
            <v-btn @click="openDialog()" class="green--text">No</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      images: [],
      dialogOpened: false,
      dialogText: '',
      selectedImage: ''
    }
  },
  created() {
    console.log('created')
    this.getImages()
  },
  methods: {
    openDialog(action, id) {
      this.dialogText = action;
      this.dialogOpened = !this.dialogOpened
      this.selectedImage = id
    },
    imageAction() {
      console.log(this.selectedImage)
      axios
          .get(`http://localhost:3000/image/${this.selectedImage}/?action=${this.dialogText}`)
          .then(res => {
            this.dialogOpened = !this.dialogOpened
            console.log(res.data)
            this.getImages()
          })
          .catch(err => console.log(err))
    },
    getImages() {
      axios
      .get('http://localhost:3000/images')
      .then(res => {
        console.log(res)
        this.images = res.data
      })
    },
    pullImage() {

    }
  }
}
</script>
