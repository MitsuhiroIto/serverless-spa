<template>
  <div id="app">
    <div class="header">
      <div class="pure-menu pure-menu-horizontal">
        <a class="pure-menu-heading" href="">Photo Gallery</a>
        <ul class="pure-menu-list">
          <li class="pure-menu-item pure-menu-selected"><a href="#" class="pure-menu-link">Home</a></li>
          <li class="pure-menu-item pure-menu-selected"><a href="#upload-image" class="pure-menu-link">Upload</a></li>
          <li class="pure-menu-item pure-menu-selected"><a href="#" class="pure-menu-link">Setting</a></li>
          <li class="pure-menu-item">
            <router-link v-if="isLoggedIn" to="/logout" class="pure-menu-link">Logout</router-link>
            <router-link v-if="!isLoggedIn" to="/login" class="pure-menu-link">Login</router-link>
          </li>
        </ul>
      </div>
    </div>
    <router-view/>
    <div class="footer">This sample app made by Mitsuhiro Ito.</div>
  </div>
</template>

<script>
import auth from './auth';

export default {
  data() {
    return {
      isLoggedIn: auth.loggedIn(),
    };
  },
  created() {
    auth.onChange = isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    };
  },
};
</script>

<style>
.footer{
  color: #FFFFFF;
  font-size: 87.5%;
  border-top: 1px solid #eee;
  margin-top: 1em;
  padding: 1em;
  background: rgb(49, 49, 49)
}
</style>
