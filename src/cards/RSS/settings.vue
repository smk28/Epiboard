<template>
  <v-card-text>
    <h4 class="headline">Feeds</h4>
    <v-list>
      <v-list-tile v-for="(feed, idx) in feeds" :key="feed">
        <v-list-tile-content>
          <v-list-tile-title>{{ feed }}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon @click="removeFeed(idx)">close</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-layout align-center>
      <v-text-field v-model="newFeed" name="feed" label="e.g. https://exemple.com/rss"/>
      <v-btn flat @click="addFeed(newFeed)">Add</v-btn>
    </v-layout>
  </v-card-text>
</template>
<script src="./settings.js"></script>
