<template>
  <div id="signup">
    <h2>Signup</h2>
    <form v-on:submit.prevent="signup" class="pure-form pure-form-stacked">
      <label><input v-model="username" placeholder="Username"></label>
      <label><input v-model="email" placeholder="Email"></label>
      <label><input v-model="password" placeholder="Password" type="password"></label><br>
      <button type="submit" class="pure-button pure-button-primary">サインアップ</button>
      <p v-if="error" class="error">サインアップに失敗しました</p>
    </form>
  </div>
</template>

<script>
import auth from '../auth';
import store from '../credential_store';

export default {
  data() {
    return {
      email: '',
      password: '',
      username: '',
      error: false,
      state: store.state,
    };
  },

  methods: {
    signup() {
      const _this = this;
      auth.signup(this.username, this.email, this.password).then((res) => {
        console.log(res);
        store.setEmailAction(_this.email);
        store.setUsernameAction(_this.username);
        _this.$router.replace('/confirm');
      }).catch((err) => {
        console.log(err);
        _this.error = true;
      });
    },

  },
};
</script>

<style>
#signup {
  padding: .5em 1em;
}
</style>
