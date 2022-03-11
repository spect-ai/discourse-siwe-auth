import Controller from "@ember/controller";
import { withPluginApi } from "discourse/lib/plugin-api";
import Web3Modal from "../lib/web3modal";

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.initAuth();
  },

  verifySignature(account, message, signature, avatar) {
    document.getElementById("eth_account").value = account;
    document.getElementById("eth_message").value = message;
    document.getElementById("eth_signature").value = signature;
    document.getElementById("eth_avatar").value = avatar;
    document.getElementById("siwe-sign").submit();
  },

  async initAuth() {
    const env = withPluginApi("0.11.7", (api) => {
      const siteSettings = api.container.lookup("site-settings:main");
      return {
        INFURA_ID: siteSettings.siwe_infura_id,
      }
    });
    let provider = Web3Modal.create();
    await provider.providerInit(env);

    try {
      const [account, message, signature, avatar] = await provider.runSigningProcess();
      this.verifySignature(account, message, signature, avatar);
    } catch (e) {
      console.error(e);
    }
  },

  actions: {
    async initAuth() {
      this.initAuth();
    }
  }
});