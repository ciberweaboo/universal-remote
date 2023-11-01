var CiberRemote = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // config.js
  var BaseURL;
  var init_config = __esm({
    "config.js"() {
      BaseURL = "http://localhost:3002/";
    }
  });

  // state.js
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
  var renderState, lastRequest, targetPlayer;
  var init_state = __esm({
    "state.js"() {
      renderState = "";
      lastRequest = 0;
      targetPlayer = 0;
    }
  });

  // typeasserts.js
  function isUniRemoteMessage(msg) {
    return typeof msg === "object" && msg && "type" in msg && msg.type === "uniremote";
  }
  function isBeep(msg) {
    return typeof msg === "object" && msg && "BeepType" in msg;
  }
  var init_typeasserts = __esm({
    "typeasserts.js"() {
    }
  });

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
  var ItemPermissions;
  var init_messages = __esm({
    "messages.js"() {
      init_state();
      init_typeasserts();
      ItemPermissions = /** @type {const} */
      {
        Everyone: 0,
        EveryoneButBlacklist: 1,
        EveryoneButSubs: 2,
        Whitelisted: 3,
        Lovers: 4,
        Owner: 5
      };
    }
  });

  // sdk.js
  var SDK, HOOK_PRIORITY;
  var init_sdk = __esm({
    "sdk.js"() {
      SDK = window.bcModSdk.registerMod(
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
      HOOK_PRIORITY = /** @type {const} */
      {
        OBSERVE: 0,
        ADD_BEHAVIOR: 1,
        MODIFY_BEHAVIOR: 5,
        OVERRIDE_BEHAVIOR: 10,
        TOP: 100
      };
    }
  });

  // hooks.js
  var require_hooks = __commonJS({
    "hooks.js"() {
      init_messages();
      init_sdk();
      init_state();
      init_typeasserts();
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
    }
  });

  // main.js
  var require_main = __commonJS({
    "main.js"() {
      init_config();
      var import_hooks = __toESM(require_hooks());
      init_messages();
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
    }
  });
  return require_main();
})();
