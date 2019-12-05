/* global __DEVELOPMENT__ */

import "whatwg-fetch";
import React from "react";
import { render } from "react-dom";
import { hashHistory } from "react-router";
import localforage from "localforage";

import { CozyProvider } from "cozy-client";
import { I18n, initTranslation } from "cozy-ui/transpiled/react/I18n";
import { isIOSApp } from "cozy-device-helper";
import { Document } from "cozy-doctypes";

import logger from "lib/logger";
import configureStore from "drive/store/configureStore";
import { loadState } from "drive/store/persistedState";
import { startBackgroundService } from "drive/mobile/lib/background";
import { configureReporter } from "drive/lib/reporter";
/* import {
  intentHandlerAndroid,
  intentHandlerIOS
} from "drive/mobile/lib/intents";
 */
import {
  startTracker,
  useHistoryForTracker,
  startHeartBeat,
  stopHeartBeat
} from "drive/mobile/lib/tracker";
import { getTranslateFunction } from "drive/mobile/lib/i18n";
import { scheduleNotification } from "drive/mobile/lib/notification";
import {
  getLang,
  initClient,
  initBar,
  restoreCozyClientJs,
  resetClient,
  getOauthOptions
} from "drive/mobile/lib/cozy-helper";
import DriveMobileRouter from "drive/mobile/modules/authorization/DriveMobileRouter";
import { backupImages } from "drive/mobile/modules/mediaBackup/duck";
import {
  revokeClient,
  getClientSettings,
  getToken,
  setToken,
  isClientRevoked
} from "drive/mobile/modules/authorization/duck";
import {
  getServerUrl,
  isAnalyticsOn
} from "drive/mobile/modules/settings/duck";
import { startReplication } from "drive/mobile/modules/replication/sagas";
import { ONBOARDED_ITEM } from "drive/mobile/modules/onboarding/OnBoarding";

// Allows to know if the launch of the application has been done by the service background
// @see: https://git.io/vSQBC
const isBackgroundServiceParameter = () => {
  const queryDict = location.search
    .substr(1)
    .split("&")
    .reduce((acc, item) => {
      const [prop, val] = item.split("=");
      return { ...acc, [prop]: val };
    }, {});

  return queryDict.backgroundservice;
};

class InitAppMobile {
  initialize = () => {
    this.appReady = new Promise((resolve, reject) => {
      this.resolvePromise = resolve;
      this.rejectPromise = reject;
    });
    this.bindEvents();
    this.stardedApp = false;
    this.isStarting = false;
    if (__DEVELOPMENT__ && typeof cordova === "undefined") this.onDeviceReady();
    return this.appReady;
  };

  bindEvents = () => {
    document.addEventListener(
      "deviceready",
      this.onDeviceReady.bind(this),
      false
    );
    document.addEventListener("resume", this.onResume.bind(this), false);
    document.addEventListener("pause", this.onPause.bind(this), false);
    /*We add fastclick only for iOS since Chrome removed this behavior (iOS also, but
      we still use UIWebview and not WKWebview... )*/
    if (isIOSApp()) {
      var FastClick = require("fastclick");
      document.addEventListener(
        "DOMContentLoaded",
        function() {
          FastClick.attach(document.body);
        },
        false
      );
    }
  };

  getCozyURL = async () => {
    if (this.cozyURL) return this.cozyURL;
    const persistedState = (await this.getPersistedState()) || {};
    // TODO: not ideal to access the server URL in the persisted state like this...
    this.cozyURL = persistedState.mobile
      ? persistedState.mobile.settings.serverUrl
      : "";
    return this.cozyURL;
  };

  getPersistedState = async () => {
    if (this.persistedState) return this.persistedState;
    this.persistedState = await loadState();
    return this.persistedState;
  };

  getClient = async () => {
    if (this.client) return this.client;
    const cozyURL = await this.getCozyURL();
    this.client = initClient(cozyURL);

    if (!Document.cozyClient) {
      Document.registerClient(this.client);
    }
    return this.client;
  };

  getPolyglot = () => {
    if (!this.polyglot) {
      this.polyglot = initTranslation(getLang(), lang =>
        require(`drive/locales/${lang}`)
      );
    }
    return this.polyglot;
  };

  getStore = async () => {
    if (this.store) return this.store;
    const client = await this.getClient();
    const polyglot = this.getPolyglot();
    const persistedState = await this.getPersistedState();
    this.store = configureStore(
      client,
      polyglot.t.bind(polyglot),
      persistedState
    );
    return this.store;
  };

  onDeviceReady = async () => {
    if (this.isStarting === true) {
      return;
    }
    this.isStarting = true;
    const store = await this.getStore();
    this.startApplication();
    await this.appReady;
    /*  if (window.plugins && window.plugins.intentShim) {
      window.plugins.intentShim.onIntent(intentHandlerAndroid(store));
      window.plugins.intentShim.getIntent(intentHandlerAndroid(store), err => {
        logger.error("Error getting launch intent", err);
      });
    } */
    this.openWith();
    if (isBackgroundServiceParameter()) {
      startBackgroundService();
    }
    store.dispatch(backupImages());
    if (navigator && navigator.splashscreen) navigator.splashscreen.hide();
  };

  onResume = async () => {
    const store = await this.getStore();
    store.dispatch(backupImages());
    if (isAnalyticsOn(store.getState())) startHeartBeat();
  };

  onPause = async () => {
    const store = await this.getStore();
    if (isAnalyticsOn(store.getState())) stopHeartBeat();
    // TODO: selector
    if (store.getState().mobile.mediaBackup.currentUpload && isIOSApp()) {
      const t = getTranslateFunction();
      scheduleNotification({
        text: t("mobile.notifications.backup_paused")
      });
    }
  };

  openWith = () => {
    // Increase verbosity if you need more logs
    cordova.openwith.setVerbosity(cordova.openwith.DEBUG);

    // Initialize the plugin
    cordova.openwith.init(initSuccess, initError);

    function initSuccess() {
      console.log("init success!");
    }
    function initError(err) {
      console.log("init failed: " + err);
    }

    // Define your file handler
    cordova.openwith.addHandler(myHandler);

    async function myHandler(intent) {
      console.log("hashHistory", hashHistory);
      console.log("intent received");
      console.log("  text: " + intent.text); // description to the sharing, for instance title of the page when shared URL from Safari
      if (intent.items.length > 0) {
        try {
          await localforage.setItem("importedFiles", intent.items);
        } catch (error) {
          console.log("error", error);
        }
      }
      for (var i = 0; i < intent.items.length; ++i) {
        var item = intent.items[i];
        /*  console.log("  type: ", item.uti); // UTI. possible values: public.url, public.text or public.image
        console.log("  type: ", item.type); // Mime type. For example: "image/jpeg"
        console.log("  data: ", item.data); // shared data. For URLs and text - actually the shared URL or text. For image - its base64 string representation.
        console.log("  text: ", item.text); // text to share alongside the item. as we don't allow user to enter text in native UI, in most cases this will be empty. However for sharing pages from Safari this might contain the title of the shared page.
        console.log("  name: ", item.name); // suggested name of the image. For instance: "IMG_0404.JPG"
        console.log("  utis: ", item.utis); // some optional additional info */
        console.log("item.fileUrl", item.fileUrl);
        // Read file with Cordova’s file plugin
        /* if (item.fileUrl) {
        resolveLocalFileSystemURL(item.fileUrl, (fileEntry) => {
          fileEntry.file((file) => {
            let mediaType = file.type.split('/')[0].toLowerCase()

            if (mediaType == 'image') {
              let reader = new FileReader

              reader.readAsDataURL(file)
              reader.onloadend = () => {
                // Can use this for an <img> tag
                file.src = reader.result
              }
            }
          })
        })
      } */
      }
      hashHistory.push("/uploadfrommobile");
    }
  };
  migrateToCozyAuth = async () => {
    const store = await this.getStore();
    const oauthOptions = getClientSettings(store.getState());
    const token = getToken(store.getState());
    const uri = await this.getCozyURL();
    const alreadyMigrated = await localforage.getItem("credentials");

    if (uri && oauthOptions && token && !alreadyMigrated) {
      await localforage.setItem(ONBOARDED_ITEM, true);
      return await localforage.setItem("credentials", {
        uri,
        oauthOptions,
        token
      });
    }

    return;
  };
  startApplication = async () => {
    if (this.stardedApp) return;

    const store = await this.getStore();
    const client = await this.getClient();
    const polyglot = await this.getPolyglot();

    //needed to migrate from cozy-drive auth to cozy-authenticate.
    //@TODO should be remove one day. It has been added for the migration
    //from 1.18.17 to 1.18.18
    await this.migrateToCozyAuth();

    configureReporter();
    useHistoryForTracker(hashHistory);
    if (isAnalyticsOn(store.getState())) {
      startTracker(getServerUrl(store.getState()));
    }

    const root = document.querySelector("[role=application]");
    render(
      <I18n lang={getLang()} polyglot={polyglot}>
        <CozyProvider client={client}>
          <DriveMobileRouter history={hashHistory} />
        </CozyProvider>
      </I18n>,
      root,
      () => {
        this.stardedApp = true;
        this.isStarting = false;
        this.resolvePromise(true);
      }
    );
  };
}

export default InitAppMobile;
