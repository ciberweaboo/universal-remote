var SDK=function(){"use strict";const e="1.1.0";function o(e){alert("Mod ERROR:\n"+e);const o=new Error(e);throw console.error(o),o}const t=new TextEncoder;function n(e){return!!e&&"object"==typeof e&&!Array.isArray(e)}function r(e){const o=new Set;return e.filter((e=>!o.has(e)&&o.add(e)))}const i=new Map,a=new Set;function d(e){a.has(e)||(a.add(e),console.warn(e))}function s(e){const o=[],t=new Map,n=new Set;for(const r of p.values()){const i=r.patching.get(e.name);if(i){o.push(...i.hooks);for(const[o,a]of i.patches.entries())t.has(o)&&t.get(o)!==a&&d(`ModSDK: Mod '${r.name}' is patching function ${e.name} with same pattern that is already applied by different mod, but with different pattern:\nPattern:\n${o}\nPatch1:\n${t.get(o)||""}\nPatch2:\n${a}`),t.set(o,a),n.add(r.name)}}o.sort(((e,o)=>o.priority-e.priority));const r=function(e,o){if(0===o.size)return e;let t=e.toString().replaceAll("\r\n","\n");for(const[n,r]of o.entries())t.includes(n)||d(`ModSDK: Patching ${e.name}: Patch ${n} not applied`),t=t.replaceAll(n,r);return(0,eval)(`(${t})`)}(e.original,t);let i=function(o){var t,i;const a=null===(i=(t=m.errorReporterHooks).hookChainExit)||void 0===i?void 0:i.call(t,e.name,n),d=r.apply(this,o);return null==a||a(),d};for(let t=o.length-1;t>=0;t--){const n=o[t],r=i;i=function(o){var t,i;const a=null===(i=(t=m.errorReporterHooks).hookEnter)||void 0===i?void 0:i.call(t,e.name,n.mod),d=n.hook.apply(this,[o,e=>{if(1!==arguments.length||!Array.isArray(o))throw new Error(`Mod ${n.mod} failed to call next hook: Expected args to be array, got ${typeof e}`);return r.call(this,e)}]);return null==a||a(),d}}return{hooks:o,patches:t,patchesSources:n,enter:i,final:r}}function c(e,o=!1){let r=i.get(e);if(r)o&&(r.precomputed=s(r));else{let o=window;const a=e.split(".");for(let t=0;t<a.length-1;t++)if(o=o[a[t]],!n(o))throw new Error(`ModSDK: Function ${e} to be patched not found; ${a.slice(0,t+1).join(".")} is not object`);const d=o[a[a.length-1]];if("function"!=typeof d)throw new Error(`ModSDK: Function ${e} to be patched not found`);const c=function(e){let o=-1;for(const n of t.encode(e)){let e=255&(o^n);for(let o=0;o<8;o++)e=1&e?-306674912^e>>>1:e>>>1;o=o>>>8^e}return((-1^o)>>>0).toString(16).padStart(8,"0").toUpperCase()}(d.toString().replaceAll("\r\n","\n")),l={name:e,original:d,originalHash:c};r=Object.assign(Object.assign({},l),{precomputed:s(l),router:()=>{},context:o,contextProperty:a[a.length-1]}),r.router=function(e){return function(...o){return e.precomputed.enter.apply(this,[o])}}(r),i.set(e,r),o[r.contextProperty]=r.router}return r}function l(){const e=new Set;for(const o of p.values())for(const t of o.patching.keys())e.add(t);for(const o of i.keys())e.add(o);for(const o of e)c(o,!0)}function f(){const e=new Map;for(const[o,t]of i)e.set(o,{name:o,original:t.original,originalHash:t.originalHash,sdkEntrypoint:t.router,currentEntrypoint:t.context[t.contextProperty],hookedByMods:r(t.precomputed.hooks.map((e=>e.mod))),patchedByMods:Array.from(t.precomputed.patchesSources)});return e}const p=new Map;function u(e){p.get(e.name)!==e&&o(`Failed to unload mod '${e.name}': Not registered`),p.delete(e.name),e.loaded=!1,l()}function g(e,t,r){"string"==typeof e&&"string"==typeof t&&(alert(`Mod SDK warning: Mod '${e}' is registering in a deprecated way.\nIt will work for now, but please inform author to update.`),e={name:e,fullName:e,version:t},t={allowReplace:!0===r}),e&&"object"==typeof e||o("Failed to register mod: Expected info object, got "+typeof e),"string"==typeof e.name&&e.name||o("Failed to register mod: Expected name to be non-empty string, got "+typeof e.name);let i=`'${e.name}'`;"string"==typeof e.fullName&&e.fullName||o(`Failed to register mod ${i}: Expected fullName to be non-empty string, got ${typeof e.fullName}`),i=`'${e.fullName} (${e.name})'`,"string"!=typeof e.version&&o(`Failed to register mod ${i}: Expected version to be string, got ${typeof e.version}`),e.repository||(e.repository=void 0),void 0!==e.repository&&"string"!=typeof e.repository&&o(`Failed to register mod ${i}: Expected repository to be undefined or string, got ${typeof e.version}`),null==t&&(t={}),t&&"object"==typeof t||o(`Failed to register mod ${i}: Expected options to be undefined or object, got ${typeof t}`);const a=!0===t.allowReplace,d=p.get(e.name);d&&(d.allowReplace&&a||o(`Refusing to load mod ${i}: it is already loaded and doesn't allow being replaced.\nWas the mod loaded multiple times?`),u(d));const s=e=>{"string"==typeof e&&e||o(`Mod ${i} failed to patch a function: Expected function name string, got ${typeof e}`);let t=g.patching.get(e);return t||(t={hooks:[],patches:new Map},g.patching.set(e,t)),t},f={unload:()=>u(g),hookFunction:(e,t,n)=>{g.loaded||o(`Mod ${i} attempted to call SDK function after being unloaded`);const r=s(e);"number"!=typeof t&&o(`Mod ${i} failed to hook function '${e}': Expected priority number, got ${typeof t}`),"function"!=typeof n&&o(`Mod ${i} failed to hook function '${e}': Expected hook function, got ${typeof n}`);const a={mod:g.name,priority:t,hook:n};return r.hooks.push(a),l(),()=>{const e=r.hooks.indexOf(a);e>=0&&(r.hooks.splice(e,1),l())}},patchFunction:(e,t)=>{g.loaded||o(`Mod ${i} attempted to call SDK function after being unloaded`);const r=s(e);n(t)||o(`Mod ${i} failed to patch function '${e}': Expected patches object, got ${typeof t}`);for(const[n,a]of Object.entries(t))"string"==typeof a?r.patches.set(n,a):null===a?r.patches.delete(n):o(`Mod ${i} failed to patch function '${e}': Invalid format of patch '${n}'`);l()},removePatches:e=>{g.loaded||o(`Mod ${i} attempted to call SDK function after being unloaded`);s(e).patches.clear(),l()},callOriginal:(e,t,n)=>(g.loaded||o(`Mod ${i} attempted to call SDK function after being unloaded`),"string"==typeof e&&e||o(`Mod ${i} failed to call a function: Expected function name string, got ${typeof e}`),Array.isArray(t)||o(`Mod ${i} failed to call a function: Expected args array, got ${typeof t}`),function(e,o,t=window){return c(e).original.apply(t,o)}(e,t,n)),getOriginalHash:e=>("string"==typeof e&&e||o(`Mod ${i} failed to get hash: Expected function name string, got ${typeof e}`),c(e).originalHash)},g={name:e.name,fullName:e.fullName,version:e.version,repository:e.repository,allowReplace:a,api:f,loaded:!0,patching:new Map};return p.set(e.name,g),Object.freeze(f)}function h(){const e=[];for(const o of p.values())e.push({name:o.name,fullName:o.fullName,version:o.version,repository:o.repository});return e}let m;const y=function(){if(void 0===window.bcModSdk)return window.bcModSdk=function(){const o={version:e,apiVersion:1,registerMod:g,getModsInfo:h,getPatchingInfo:f,errorReporterHooks:Object.seal({hookEnter:null,hookChainExit:null})};return m=o,Object.freeze(o)}();if(n(window.bcModSdk)||o("Failed to init Mod SDK: Name already in use"),1!==window.bcModSdk.apiVersion&&o(`Failed to init Mod SDK: Different version already loaded ('1.1.0' vs '${window.bcModSdk.version}')`),window.bcModSdk.version!==e&&(alert(`Mod SDK warning: Loading different but compatible versions ('1.1.0' vs '${window.bcModSdk.version}')\nOne of mods you are using is using an old version of SDK. It will work for now but please inform author to update`),window.bcModSdk.version.startsWith("1.0.")&&void 0===window.bcModSdk._shim10register)){const e=window.bcModSdk,o=Object.freeze(Object.assign(Object.assign({},e),{registerMod:(o,t,n)=>o&&"object"==typeof o&&"string"==typeof o.name&&"string"==typeof o.version?e.registerMod(o.name,o.version,"object"==typeof t&&!!t&&!0===t.allowReplace):e.registerMod(o,t,n),_shim10register:!0}));window.bcModSdk=o}return window.bcModSdk}();return"undefined"!=typeof exports&&(Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=y),y}();


var CiberRemote = (() => {
  // config.js
  var BaseURL = "http://localhost:3002/";

  // state.js
  var renderState = "";
  var lastRequest = 0;
  var targetPlayer = 0;
  function getRenderState() {
    return renderState;
  }
  function setRenderState(newState) {
    renderState = newState;
  }
  function getLastRequest() {
    return lastRequest;
  }
  function setLastRequest(newRequest) {
    lastRequest = newRequest;
  }
  function getTargetPlayer() {
    return targetPlayer;
  }
  function setTargetPlayer(newTarget) {
    targetPlayer = newTarget;
  }

  // typeasserts.js
  function isUniRemoteMessage(msg) {
    return typeof msg === "object" && msg && "type" in msg && msg.type === "uniremote";
  }
  function isBeep(msg) {
    return typeof msg === "object" && msg && "BeepType" in msg;
  }

  // messages.js
  function parseUniRemoteMessage(beep) {
    try {
      const b = JSON.parse(beep);
      if (!isUniRemoteMessage(b)) {
        return null;
      }
      return b;
    } catch (e) {
      return null;
    }
  }
  function processResponse(member, urm) {
    if (urm.nonce !== getLastRequest()) {
      return;
    }
    if (!urm.allowed) {
      chatNotify(
        "You are not allowed to remote control this player or the player is not currently controllable. You must be whitelisted, a lover, or the owner of the player, and the player's item permissions must allow you to access their items."
      );
      return;
    }
    const c = CharacterLoadOnline(urm.bundle, member);
    setRenderState("interactable");
    setTargetPlayer(member);
    ChatRoomFocusCharacter(c);
    DialogChangeMode("items");
    DialogChangeFocusToGroup(c, "ItemVulva");
  }
  function processUpdate(member, urm) {
    if (!isAllowed(member)) {
      return;
    }
    ServerAppearanceLoadFromBundle(
      Player,
      "Female3DCG",
      urm.appearance,
      Player.MemberNumber
    );
    if (ServerPlayerIsInChatRoom()) {
      ChatRoomCharacterUpdate(Player);
    } else {
      CharacterRefresh(Player);
    }
    if (urm.message) {
      const msg = (
        /** @type {{ Type: string; Content: string; Dictionary: { Tag?: string; SourceCharacter?: number; MemberNumber?: string }[] }} */
        urm.message
      );
      if (msg.Type === "Action") {
        ServerSend("ChatRoomChat", msg);
      }
    } else {
      const name = Player.FriendNames?.get(member);
      chatNotify(
        `${name ? name : member} has disconnected from your toys... for now...`
      );
    }
  }
  function processRequest(member, urm) {
    const res = {
      type: "uniremote",
      nonce: urm.nonce,
      nature: "response",
      allowed: isAllowed(member)
    };
    if (res.allowed) {
      res.bundle = {
        ID: Player.OnlineID,
        Name: Player.Name,
        ActivePose: Player.ActivePose,
        ArousalSettings: Player.ArousalSettings,
        AssetFamily: Player.AssetFamily,
        BlackList: [],
        BlockItems: {},
        Crafting: null,
        Creation: Player.Creation,
        Description: Player.Description,
        Difficulty: Player.Difficulty,
        FavoriteItems: {},
        Game: {},
        Inventory: {},
        LimitedItems: {},
        ItemPermission: Player.ItemPermission,
        Lovership: Player.Lovership,
        LabelColor: Player.LabelColor,
        MemberNumber: Player.MemberNumber,
        Nickname: Player.Nickname,
        OnlineSharedSettings: Player.OnlineSharedSettings,
        Owner: Player.Owner,
        Ownership: Player.Ownership,
        Reputation: Player.Reputation,
        Title: Player.Title,
        WhiteList: [],
        Appearance: ServerAppearanceBundle(Player.Appearance)
      };
      const name = Player.FriendNames?.get(member);
      chatNotify(`${name ? name : member} has taken remote control of your toys!`);
    }
    sendBeep(member, res);
  }
  var ItemPermissions = (
    /** @type {const} */
    {
      Everyone: 0,
      EveryoneButBlacklist: 1,
      EveryoneButSubs: 2,
      Whitelisted: 3,
      Lovers: 4,
      Owner: 5
    }
  );
  function isAllowed(member) {
    if (member === Player.MemberNumber) {
      return false;
    }
    if (Player?.ItemPermission <= ItemPermissions.Whitelisted && Player?.WhiteList?.includes?.(member)) {
      return true;
    }
    if (Player?.Ownership?.MemberNumber === member) {
      return true;
    }
    if (Player?.ItemPermission <= ItemPermissions.Lovers && Player?.Lovership?.some?.((l) => l.MemberNumber === member)) {
      return true;
    }
    return false;
  }
  function sendRequest(member) {
    if (!Player.CanInteract()) {
      chatNotify(
        "You must be able to use your hands to use the Universal Remote (CanInteract == false)"
      );
      return;
    }
    if (ChatRoomGame !== "") {
      chatNotify(
        "You cannot use the Universal Remote in a game room (LARP, MagicBattle, etc.)"
      );
      return;
    }
    if (CurrentScreen !== "ChatRoom") {
      console.warn("Cannot send request from outside chatroom");
    }
    if (ChatRoomCharacter.some((c) => c.MemberNumber === member)) {
      ChatRoomFocusCharacter(
        ChatRoomCharacter.find((c) => c.MemberNumber === member)
      );
      return;
    }
    const nonce = Date.now();
    setLastRequest(nonce);
    const urm = {
      type: "uniremote",
      nature: "request",
      action: "remote",
      nonce
    };
    sendBeep(member, urm);
    setRenderState("loading");
    setTargetPlayer(member);
    ChatRoomHideElements();
    ChatRoomStatusUpdate("Preference");
  }
  function sendBeep(member, urm) {
    const beep = {
      IsSecret: true,
      BeepType: "Leash",
      MemberNumber: member,
      Message: JSON.stringify(urm)
    };
    ServerSend("AccountBeep", beep);
  }
  function chatNotify(node) {
    const div = document.createElement("div");
    div.setAttribute("class", "ChatMessage remote-notification");
    div.setAttribute("data-time", ChatRoomCurrentTime());
    div.setAttribute("data-sender", Player.MemberNumber.toString());
    div.appendChild(document.createTextNode("Universal Remote: "));
    if (typeof node === "string") {
      div.appendChild(document.createTextNode(node));
    } else if (Array.isArray(node)) {
      div.append(...node);
    } else {
      div.appendChild(node);
    }
    ChatRoomAppendChat(div);
  }

  // sdk.js
  var SDK = window.bcModSdk.registerMod(
    {
      name: "CiberRemote",
      fullName: "Ciber Remote v2",
      version: "1.0.0",
      repository: "https://github.com/ciberweaboo/universal-remote"
    },
    {
      allowReplace: false
    }
  );
  var HOOK_PRIORITY = (
    /** @type {const} */
    {
      OBSERVE: 0,
      ADD_BEHAVIOR: 1,
      MODIFY_BEHAVIOR: 5,
      OVERRIDE_BEHAVIOR: 10,
      TOP: 100
    }
  );

  // hooks.js
  var clicking = false;
  SDK.hookFunction(
    "ServerAccountBeep",
    HOOK_PRIORITY.MODIFY_BEHAVIOR,
    (args, next) => {
      if (!isBeep(args[0])) {
        return next(args);
      }
      const beep = args[0];
      if (beep.BeepType !== "Leash") {
        return next(args);
      }
      const urm = parseUniRemoteMessage(beep.Message);
      if (!urm) {
        return next(args);
      }
      switch (urm.nature) {
        case "request":
          processRequest(beep.MemberNumber, urm);
          return null;
        case "response":
          processResponse(beep.MemberNumber, urm);
          return null;
        case "update":
          processUpdate(beep.MemberNumber, urm);
          return null;
        default:
          return next(args);
      }
    }
  );
  SDK.hookFunction(
    "ChatRoomRun",
    HOOK_PRIORITY.OVERRIDE_BEHAVIOR,
    (args, next) => {
      switch (getRenderState()) {
        case "loading":
          DrawRect(0, 0, 2e3, 1e3, "black");
          DrawText("Loading...", 1e3, 500, "white", "center");
          return null;
        case "interactable":
          return null;
        default:
          return next(args);
      }
    }
  );
  SDK.hookFunction(
    "ServerSend",
    HOOK_PRIORITY.OVERRIDE_BEHAVIOR,
    (args, next) => {
      if (typeof args[1] === "object" && args[1] && clicking && getRenderState() === "interactable" && // Exclusion for the update sent by this addon
      args[0] !== "AccountBeep") {
        if (args[0] === "ChatRoomChat") {
          sendBeep(getTargetPlayer(), {
            type: "uniremote",
            nonce: Date.now(),
            nature: "update",
            appearance: ServerAppearanceBundle(CurrentCharacter.Appearance),
            message: args[1]
          });
        }
        console.debug(args);
        return null;
      }
      return next(args);
    }
  );
  SDK.hookFunction("CommonClick", HOOK_PRIORITY.TOP, (args, next) => {
    clicking = true;
    const ret = next(args);
    clicking = false;
    return ret;
  });
  SDK.hookFunction(
    "DialogMenuButtonBuild",
    HOOK_PRIORITY.OVERRIDE_BEHAVIOR,
    (args, next) => {
      if (getRenderState() === "interactable") {
        const ret = next(args);
        DialogMenuButton = DialogMenuButton.filter(
          (a) => !a.startsWith("Activity")
        );
        return ret;
      }
      return next(args);
    }
  );
  SDK.hookFunction(
    "DialogMenuBack",
    HOOK_PRIORITY.OVERRIDE_BEHAVIOR,
    (args, next) => {
      if (getRenderState() === "interactable") {
        sendBeep(getTargetPlayer(), {
          type: "uniremote",
          nonce: Date.now(),
          nature: "update",
          appearance: ServerAppearanceBundle(CurrentCharacter.Appearance),
          message: null
        });
        clearState();
        return null;
      }
      return next(args);
    }
  );
  SDK.hookFunction(
    "DialogLeave",
    HOOK_PRIORITY.OVERRIDE_BEHAVIOR,
    (args, next) => {
      if (getRenderState() === "interactable") {
        return DialogLeaveFocusItem();
      }
      return next(args);
    }
  );
  SDK.hookFunction(
    "DialogInventoryBuild",
    HOOK_PRIORITY.OVERRIDE_BEHAVIOR,
    (args, next) => {
      if (getRenderState() === "interactable") {
        const ret = next(args);
        return ret;
      }
      return next(args);
    }
  );
  SDK.hookFunction(
    "FriendListLoadFriendList",
    HOOK_PRIORITY.ADD_BEHAVIOR,
    (args, next) => {
      const ret = next(args);
      if (getRenderState() === "" && ServerPlayerIsInChatRoom() && FriendListModeIndex === 0) {
        Array.from(document.querySelectorAll(".FriendListRow")).forEach((row) => {
          const remote = document.createElement("div");
          remote.classList.add("FriendListLinkColumn");
          const memberNumber = (
            /** @type {HTMLDivElement} */
            row.children[1].innerText.trim()
          );
          if (!/^\d+$/.test(memberNumber)) {
            console.warn(
              "Invalid member number in friend list. Are member numbers correctly visible in the friend list?"
            );
            return;
          }
          row.setAttribute("data-membernumber", memberNumber);
          remote.onclick = () => {
            const member = parseInt(row.getAttribute("data-membernumber"));
            if (isNaN(member)) {
              console.warn(
                "Invalid member number in data-membernumber. Are member numbers correctly visible in the friend list?"
              );
              return;
            }
            FriendListReturn = {
              Module: "Online",
              Screen: "ChatRoom"
            };
            FriendListExit();
            sendRequest(member);
          };
          remote.innerText = "Remote";
          row.appendChild(remote);
        });
      }
      return ret;
    }
  );
  SDK.hookFunction("GameRun", HOOK_PRIORITY.OBSERVE, (args, next) => {
    if (getRenderState() === "loading" && Date.now() - getLastRequest() > 5e3) {
      clearState();
      chatNotify(
        "The remote request timed out. The player may be offline or not using Universal Remote."
      );
    }
    return next(args);
  });
  function clearState() {
    ChatRoomStatusUpdate("");
    setRenderState("");
    setLastRequest(0);
    DialogLeave();
  }

  // main.js
  var styles = document.createElement("link");
  styles.rel = "stylesheet";
  styles.href = BaseURL + "static/styles.css";
  document.head.appendChild(styles);
  Commands.push({
    Tag: "ur",
    Description: "[member number] - open the Universal Remote",
    Action: (_args, _msg, parsed) => {
      if (parsed.length !== 1) {
        chatNotify("You must specify a member number");
        return;
      }
      const member = parseInt(parsed[0]);
      if (isNaN(member)) {
        chatNotify("You must specify a member number");
        return;
      }
      sendRequest(member);
    }
  });
})();
