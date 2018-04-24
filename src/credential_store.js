export default {
  debug: true,
  state: {
    email: '',
    username: '',
  },
  setEmailAction(newValue) {
    if (this.debug) console.log('setMessageAction triggered with', newValue);
    this.state.email = newValue;
  },
  clearEmailAction() {
    if (this.debug) console.log('clearMessageAction triggered');
    this.state.email = '';
  },
  setUsernameAction(newValue) {
    if (this.debug) console.log('setMessageAction triggered with', newValue);
    this.state.username = newValue;
  },
  clearUsernameAction() {
    if (this.debug) console.log('clearMessageAction triggered');
    this.state.username = '';
  },
};
