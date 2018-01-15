const API = 'https://intra.epitech.eu';

export default {
  name: 'Epitech',
  props: ['settings'],
  components: {},
  data() {
    return {
      logged: true,
      title: '',
      gpa: '',
    };
  },
  methods: {
    getCookie() {
      chrome.cookies.get({ url: API, name: 'user' }, (cookie) => {
        if (chrome.runtime.lastError) {
          this.logged = false;
          return;
        }
        const date = new Date(cookie.expirationDate * 1000);
        if (date < new Date()) {
          this.logged = false;
          return;
        }
      });
    },
    getUserInfo() {
      this.axios.get(API + '/user/?format=json').then((response) => {
        if (!response.data) {
          this.logged = false;
          return;
        }
        this.title = response.data.title;
        this.gpa = response.data.gpa[0].gpa;
      });
    },
  },
  mounted() {
    this.getCookie();
    this.getUserInfo();
  },
};