<template>
<div class="pure-g">
    <div class="text-box pure-u-1 pure-u-md-1 pure-u-lg-1 pure-u-xl-1">
        <div class="l-box">
            <h1 class="text-box-head">Photo Gallery</h1>
            <p class="text-box-subhead">A collection of various photos from around the world</p>
        </div>
    </div>
    <div class="photo-detail pure-u-1 pure-u-md-1 pure-u-lg-1 pure-u-xl-1">
        <img v-bind:src="image_url_base + '/' + photo_id + '.' + type">
    </div>
    <button v-on:click="deleteImage" class="pure-button">この画像を削除する</button>
</div>
</template>
<script>
import axios from 'axios';
import appConfig from '../config';
import auth from '../auth';

const API_BASE_URL = appConfig.ApiBaseUrl;

export default {
  data() {
    return {
      image_url_base: appConfig.ImageBaseUrl,
      photo_id: this.$route.params.photo_id,
      type: 'jpeg',
      labels: [],
    };
  },
  created() {
    this.getImage();
  },
  methods: {
    getImage() {
      const self = this;
      const auth_header = auth.get_id_token();

      axios
        .get(`${API_BASE_URL}/images/${this.photo_id}`, {
          headers: { Authorization: auth_header },
        })
        .then((res) => {
          console.log(res.data);
          self.$data.type = res.data.type.split('/')[1];
        });
    },
    deleteImage() {
      const self = this;
      const auth_header = auth.get_id_token();
      axios
        .delete(`${API_BASE_URL}/images/${this.photo_id}`, {
          headers: { Authorization: auth_header },
        })
        .then(() => {
          console.log(`${self.photo_id}is deleted.`);
          alert('画像を削除しました');
          self.$router.replace('/');
        });
    },
  },
};
</script>
<style>
.header .pure-menu {
  border-bottom-color: black;
  border-radius: 0;
}
.pure-menu-link {
  padding: 1em 0.7em;
}
.text-box-head {
  color: #fff;
  padding-bottom: 0.2em;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 24px;
}
.text-box-subhead {
  font-weight: normal;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
h1 {
  font-size: 2em;
  margin: 0.67em 0;
}
.l-box {
  padding: 2em;
}
.text-box {
  text-align: left;
  overflow: hidden;
  position: relative;
  height: 180px;
  background: rgb(49, 49, 49);
  color: rgb(255, 190, 94);
}
.photo-detail img {
  max-width: 100%;
  min-height: 250px;
  height: auto;
}
.photo img {
  max-width: 100%;
  min-height: 250px;
  height: auto;
}
a {
  letter-spacing: 0em;
}
</style>
