<template>
  <div class="container">
    <v-container>
      <div v-for="container in containers" :key="container.Id">
        <v-card id="cards" class="mt-2 elevation-3">
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{container.Names[0].split('/')[1]}}</h3>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div><b>Image: </b>{{container.Image}}</div>
            <div><b>State: </b>{{container.State}}</div>
            <div v-if="container.State === 'running'"><b>Status: </b><span class="green--text">{{container.Status}} <i class="material-icons caption">fiber_manual_record</i></span></div>
            <div v-if="container.State === 'exited'"><b>Status: </b><span class="red--text">{{container.Status}} <i class="material-icons caption">fiber_manual_record</i></span></div>
            <div><b>Network: </b>{{container.HostConfig.NetworkMode}}</div>
            <div><b>Command: </b>{{container.Command}}</div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-hover v-if="container.State === 'running'"><v-btn depressed @click="openDialog('stop', container.Id)" class="red--text" slot-scope="{ hover }" :class="`elevation-${hover ? 9 : 0}`"><i class="material-icons">stop</i>STOP</v-btn></v-hover>
            <v-hover v-if="container.State === 'running'"><v-btn depressed @click="openDialog('restart', container.Id)" class="blue--text" slot-scope="{ hover }" :class="`elevation-${hover ? 9 : 0}`"><i class="material-icons">loop</i>RESTART</v-btn></v-hover>
            <v-hover v-if="container.State === 'exited'"><v-btn depressed @click="openDialog('start', container.Id)" class="green--text" slot-scope="{ hover }" :class="`elevation-${hover ? 9 : 0}`"><i class="material-icons">done</i>START</v-btn></v-hover>
            <v-hover v-if="container.State === 'exited'"><v-btn depressed @click="openDialog('delete', container.Id)" class="red--text" slot-scope="{ hover }" :class="`elevation-${hover ? 9 : 0}`"><i class="material-icons">clear</i>DELETE</v-btn></v-hover>
            <v-hover><v-btn depressed @click="detailContainer(container.Id)" class="blue--text" slot-scope="{ hover }" :class="`elevation-${hover ? 9 : 0}`"><i class="material-icons mr-1">list</i>DETAIL</v-btn></v-hover>
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
            <v-btn @click="containerAction()" class="red--text">Yes</v-btn>
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
      containers: [],
      dialogOpened: false,
      dialogText: '',
      selectedContainer: ''
    }
  },
  created() {
    console.log('created')
    this.getContainers()
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
            this.getContainers()
          })
          .catch(err => console.log(err))
    },
    getContainers() {
      axios
      .get('http://localhost:3000/containers')
      .then(res => {
        console.log(res)
        this.containers = res.data
      })
    },
    detailContainer(id) {
      this.$router.push({name: 'container', params: { id }})
    }
  }
}
</script>
