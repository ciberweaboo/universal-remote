/**
 *     Universal Remote
 *  Copyright (C) 2023  Sid
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
	getLastRequest,
	setLastRequest,
	setRenderState,
	setTargetPlayer,
} from "./state.js"
import { isUniRemoteMessage } from "./typeasserts.js"

/**
 * @param {string} beep
 * @returns {import("./types/uniremote").UniRemoteMessage}
 */
export function parseUniRemoteMessage(beep) {
	try {
		const b = JSON.parse(beep)
		if (!isUniRemoteMessage(b)) {
			return null
		}
		return b
	} catch (e) {
		return null
	}
}

/**
 * @param {number} member
 * @param {import("./types/uniremote").UniRemoteMessage & import("./types/uniremote").UniRemoteResponse} urm
 */
export function processResponse(member, urm) {
	if (urm.nonce !== getLastRequest()) {
		return
	}
	if (!urm.allowed) {
		chatNotify(
			"You are not allowed to remote control this player or the player is not currently controllable. You must be whitelisted, a lover, or the owner of the player, and the player's item permissions must allow you to access their items."
		)
		return
	}
	const c = CharacterLoadOnline(urm.bundle, member)
	setRenderState("interactable")
	setTargetPlayer(member)
	ChatRoomFocusCharacter(c)
	DialogChangeMode("items")
	DialogChangeFocusToGroup(c, "ItemVulva")
}

/**
 * @param {number} member
 * @param {import("./types/uniremote").UniRemoteMessage & import("./types/uniremote").UniRemoteUpdate} urm
 */
export function processUpdate(member, urm) {
	if (!isAllowed(member)) {
		return
	}

	ServerAppearanceLoadFromBundle(
		Player,
		"Female3DCG",
		urm.appearance,
		Player.MemberNumber
	)
	if (ServerPlayerIsInChatRoom()) {
		ChatRoomCharacterUpdate(Player)
	} else {
		CharacterRefresh(Player)
	}
	if (urm.message) {
		const msg =
			/** @type {{ Type: string; Content: string; Dictionary: { Tag?: string; SourceCharacter?: number; MemberNumber?: string }[] }} */ (
				urm.message
			)
		if (msg.Type === "Action") {
			ServerSend("ChatRoomChat", msg)
		}
	} else {
		const name = Player.FriendNames?.get(member)
		chatNotify(
			`${name ? name : member} has disconnected from your toys... for now...`
		)
	}
}

/**
 * @param {number} member
 * @param {import("./types/uniremote").UniRemoteRequest & import("./types/uniremote").UniRemoteMessage} urm
 */
export function processRequest(member, urm) {
	/** @type {import("./types/uniremote").UniRemoteMessage & import("./types/uniremote").UniRemoteResponse} */
	const res = {
		type: "uniremote",
		nonce: urm.nonce,
		nature: "response",
		allowed: isAllowed(member),
	}

	if (res.allowed) {
		res.bundle = {
			ID: Player.OnlineID,
			Name: Player.Name,
			ActivePose: Player.ActivePose,
			ArousalSettings: Player.ArousalSettings,
			AssetFamily: Player.AssetFamily,
			BlackList: [],
			BlockItems: {},
			Crafting: "",
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
			Appearance: ServerAppearanceBundle(Player.Appearance),
		}
		const name = Player.FriendNames?.get(member)
		chatNotify(`${name ? name : member} has taken remote control of your toys!`)
	}

	sendBeep(member, res)
}

const ItemPermissions = /** @type {const} */ ({
	Everyone: 0,
	EveryoneButBlacklist: 1,
	EveryoneButSubs: 2,
	Whitelisted: 3,
	Lovers: 4,
	Owner: 5,
})

/**
 * @param {number} member
 * @returns {boolean}
 */
function isAllowed(member) {
	if (member === Player.MemberNumber) {
		return false
	}

	if (
		Player?.ItemPermission <= ItemPermissions.Whitelisted &&
		Player?.WhiteList?.includes?.(member)
	) {
		return true
	}

	if (Player?.Ownership?.MemberNumber === member) {
		return true
	}

	if (
		Player?.ItemPermission <= ItemPermissions.Lovers &&
		Player?.Lovership?.some?.((l) => l.MemberNumber === member)
	) {
		return true
	}

	return false
}

export function sendRequest(member) {
	if (!Player.CanInteract()) {
		chatNotify(
			"You must be able to use your hands to use the Universal Remote (CanInteract == false)"
		)
		return
	}

	if (ChatRoomGame !== "") {
		chatNotify(
			"You cannot use the Universal Remote in a game room (LARP, MagicBattle, etc.)"
		)
		return
	}

	if (CurrentScreen !== "ChatRoom") {
		console.warn("Cannot send request from outside chatroom")
	}

	if (ChatRoomCharacter.some((c) => c.MemberNumber === member)) {
		ChatRoomFocusCharacter(
			ChatRoomCharacter.find((c) => c.MemberNumber === member)
		)
		return
	}

	const nonce = Date.now()
	setLastRequest(nonce)

	/**
	 * @type {import("./types/uniremote").UniRemoteRequest & import("./types/uniremote").UniRemoteMessage}
	 */
	const urm = {
		type: "uniremote",
		nature: "request",
		action: "remote",
		nonce: nonce,
	}
	sendBeep(member, urm)
	setRenderState("loading")
	setTargetPlayer(member)
	ChatRoomHideElements()
	ChatRoomStatusUpdate("Preference")
}

/**
 * @param {number} member
 * @param {import("./types/uniremote").UniRemoteMessage} urm
 */
export function sendBeep(member, urm) {
	/** @type {import("./types/uniremote").Beep} */
	const beep = {
		IsSecret: true,
		BeepType: "Leash",
		MemberNumber: member,
		Message: JSON.stringify(urm),
	}
	ServerSend("AccountBeep", beep)
}

/**
 * @param {string | HTMLElement | HTMLElement[]} node
 */
export function chatNotify(node) {
	const div = document.createElement("div")
	div.setAttribute("class", "ChatMessage remote-notification")
	div.setAttribute("data-time", ChatRoomCurrentTime())
	div.setAttribute("data-sender", Player.MemberNumber.toString())
	div.appendChild(document.createTextNode("Universal Remote: "))
	if (typeof node === "string") {
		div.appendChild(document.createTextNode(node))
	} else if (Array.isArray(node)) {
		div.append(...node)
	} else {
		div.appendChild(node)
	}

	ChatRoomAppendChat(div)
}
