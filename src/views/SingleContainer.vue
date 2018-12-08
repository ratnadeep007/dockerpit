<template>
  <div class="container">
    <v-container>
      <v-card v-if="containerDetail">
        <v-card-title>
          <h2>{{containerDetail.Name.split('/')[1]}}</h2>
        </v-card-title>
        <v-card-text>
          <div><b>Command: </b> {{containerDetail.Path}}</div>
          <div><b>Arguments: </b>
            <span v-for="(arg, index) in containerDetail.Args" :key="index">{{arg}} </span>
          </div>
          <div>
            <b>Image:</b>
            <div v-for="(image, index) in imageDetail.RepoTags" :key="index" class="ml-2">
              {{index+1}}. {{image}}
            </div>
          </div>
          <div v-if="containerDetail.State.Running">
            <div><b>Mac Address: </b> {{containerDetail.NetworkSettings.MacAddress}}</div>
            <div><b>IP Address: </b> {{containerDetail.NetworkSettings.IPAddress}}</div>
            <div>
              <b>Ports: </b>
              <span v-for="(port, index) in containerPort" :key="index">
                {{port.split('/')[0]}},
              </span>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-hover v-if="containerDetail.State.Running"><v-btn depressed @click="openDialog('stop', containerDetail.Id)" class="red--text" slot-scope="{ hover }" :class="`elevation-${hover ? 9 : 0}`"><i class="material-icons">stop</i>STOP</v-btn></v-hover>
          <v-hover v-if="containerDetail.State.Running"><v-btn depressed @click="openDialog('restart', containerDetail.Id)" class="blue--text" slot-scope="{ hover }" :class="`elevation-${hover ? 9 : 0}`"><i class="material-icons">loop</i>RESTART</v-btn></v-hover>
          <v-hover v-if="!containerDetail.State.Running"><v-btn depressed @click="openDialog('start', containerDetail.Id)" class="green--text" slot-scope="{ hover }" :class="`elevation-${hover ? 9 : 0}`"><i class="material-icons">done</i>START</v-btn></v-hover>
          <v-hover v-if="!containerDetail.State.Running"><v-btn depressed @click="openDialog('delete', containerDetail.Id)" class="red--text" slot-scope="{ hover }" :class="`elevation-${hover ? 9 : 0}`"><i class="material-icons">clear</i>DELETE</v-btn></v-hover>
        </v-card-actions>
      </v-card>
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
      containerId: '',
      containerDetail: null,
      containerPort: null,
      mappedIPPorts: [],
      imageDetail: null,
      imageId: null,
      dialogOpened: false,
      dialogText: '',
      selectedContainer: ''
    }
  },
  created() {
    this.containerId = this.$route.params.id
    axios
      .get(`http://localhost:3000/container/${this.containerId}/?action=detail`)
      .then(res => {
        console.log(res.data)
        this.containerDetail = res.data
        this.containerPort = Object.keys(res.data.NetworkSettings.Ports)
        this.containerPort.forEach(port => {
          // this.mappedIPPorts.push(port.split('/')[0])
          this.mappedIPPorts[port.split('/')[0]] = this.containerDetail.NetworkSettings.Ports[port]
          this.imageId = this.containerDetail.Image
          this.getImageDetail()
        })
      })
  },
  methods: {
    getImageDetail() {
      axios
        .get(`http://localhost:3000/image/${this.imageId}/?action=detail`)
        .then(res => {
          this.imageDetail = res.data
          console.log(this.imageDetail)
        })
    },
    openDialog(action, id) {
      this.dialogText = action;
      this.dialogOpened = !this.dialogOpened
      this.selectedContainer = id
    },
  }
}
</script>
