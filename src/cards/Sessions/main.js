import * as VTabs from 'vuetify/es5/components/VTabs';

// @vue/component
export default {
  name: 'Sessions',
  components: {
    ...VTabs,
  },
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      devices: [],
      recentlyClosed: [],
    };
  },
  mounted() {
    Promise.all([this.getDevices(), this.getRecentlyClosed()])
      .then(() => {
        this.listenChange();
      })
      .then(() => this.$emit('init'))
      .catch(err => this.$emit('init', err));
  },
  methods: {
    mergeTabsAndWindows(sessionItem) {
      const tabs = [];
      const keys = Object.keys(sessionItem);
      for (let i = 0; i < keys.length; i += 1) {
        const item = sessionItem[keys[i]];
        // If it's a tab we push it with lastModified value
        if (item.tab) {
          const { tab } = item;
          tab.lastModified = new Date(item.lastModified * 1e3).toLocaleString();
          tab.favIconUrl = this.$utils.getFavicon(tab.favIconUrl || tab.url);
          tabs.push(tab);
          // If it's a window we gather each tab and add them to the others
          // e.g: we don't care about the difference between tabs and windows
        } else if (item.window) {
          const subKeys = Object.keys(item.window.tabs);
          for (let j = 0; j < subKeys.length; j += 1) {
            const tab = item.window.tabs[subKeys[j]];
            tab.lastModified = new Date(item.lastModified * 1e3).toLocaleString();
            if (!tab.favIconUrl) {
              tab.favIconUrl = this.$utils.getFavicon(tab.favIconUrl || tab.url);
            }
            tabs.push(tab);
          }
        }
      }
      if (tabs.length > this.settings.maxDeviceTabs) {
        tabs.length = this.settings.maxDeviceTabs;
      }
      return tabs;
    },
    getDevices() {
      // TODO: Firefox doesn't support getDevices
      if (!browser.sessions.getDevices) return Promise.resolve();
      return new Promise((resolve, reject) => {
        browser.sessions.getDevices({
          maxResults: this.settings.maxDevices,
        }, (devices) => {
          if (browser.runtime.lastError) return reject(browser.runtime.lastError);
          this.devices = devices;
          for (let i = 0; i < devices.length; i += 1) {
            this.devices[i].tabs = this.mergeTabsAndWindows(devices[i].sessions);
            if (!devices[i].tabs.length) {
              this.devices.splice(i, 1);
            }
          }
          return resolve();
        });
      });
    },
    getRecentlyClosed() {
      return new Promise((resolve, reject) => {
        browser.sessions.getRecentlyClosed({
          maxResults: this.settings.maxRecentlyClosed,
        }, (recentlyClosed) => {
          if (browser.runtime.lastError) return reject(browser.runtime.lastError);
          this.recentlyClosed = this.mergeTabsAndWindows(recentlyClosed);
          return resolve();
        });
      });
    },
    listenChange() {
      browser.sessions.onChanged.addListener(() => {
        Promise.all([this.getDevices(), this.getRecentlyClosed()]);
      });
    },
  },
};
