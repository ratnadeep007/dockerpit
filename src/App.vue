<template>
  <v-app>
    <v-navigation-drawer app permanent>
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              DOCKPIT
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list dense class="pt-0">
        <v-list-tile v-for="item in items" :to="item.router" :key="item.title">
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      items: [
        { title: 'Home', icon: 'dashboard', router: '/' },
        { title: 'Containers', icon: 'dashboard', router: '/containers' },
        { title: 'Images', icon: 'dashboard', router: '/images'}
      ],
      right: null
    }
  }
}
</script>
