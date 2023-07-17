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
	chatNotify,
	parseUniRemoteMessage,
	processRequest,
	processResponse,
	processUpdate,
	sendBeep,
	sendRequest,
} from "./messages.js"
import { HOOK_PRIORITY, SDK } from "./sdk.js"
import {
	getLastRequest,
	getRenderState,
	getTargetPlayer,
	setLastRequest,
	setRenderState,
} from "./state.js"
import { isBeep } from "./typeasserts.js"

let clicking = false

SDK.hookFunction(
	"ServerAccountBeep",
	HOOK_PRIORITY.MODIFY_BEHAVIOR,
	(args, next) => {
		if (!isBeep(args[0])) {
			return next(args)
		}
		const beep = args[0]
		if (beep.BeepType !== "Leash") {
			return next(args)
		}
		const urm = parseUniRemoteMessage(beep.Message)
		if (!urm) {
			return next(args)
		}
		switch (urm.nature) {
			case "request":
				processRequest(beep.MemberNumber, urm)
				return null
			case "response":
				processResponse(beep.MemberNumber, urm)
				return null
			case "update":
				processUpdate(beep.MemberNumber, urm)
				return null
			default:
				return next(args)
		}
	}
)

SDK.hookFunction(
	"ChatRoomRun",
	HOOK_PRIORITY.OVERRIDE_BEHAVIOR,
	(args, next) => {
		switch (getRenderState()) {
			case "loading":
				DrawRect(0, 0, 2000, 1000, "black")
				DrawText("Loading...", 1000, 500, "white", "center")
				return null
			case "interactable":
				return null
			default:
				return next(args)
		}
	}
)

SDK.hookFunction(
	"ServerSend",
	HOOK_PRIORITY.OVERRIDE_BEHAVIOR,
	(args, next) => {
		if (
			typeof args[1] === "object" &&
			args[1] &&
			clicking &&
			getRenderState() === "interactable" &&
			// Exclusion for the update sent by this addon
			args[0] !== "AccountBeep"
		) {
			if (args[0] === "ChatRoomChat") {
				sendBeep(getTargetPlayer(), {
					type: "uniremote",
					nonce: Date.now(),
					nature: "update",
					appearance: ServerAppearanceBundle(CurrentCharacter.Appearance),
					message: args[1],
				})
			}
			console.debug(args)
			return null
		}
		return next(args)
	}
)

SDK.hookFunction("CommonClick", HOOK_PRIORITY.TOP, (args, next) => {
	clicking = true
	const ret = next(args)
	clicking = false
	return ret
})

SDK.hookFunction(
	"DialogMenuButtonBuild",
	HOOK_PRIORITY.OVERRIDE_BEHAVIOR,
	(args, next) => {
		if (getRenderState() === "interactable") {
			const ret = next(args)
			DialogMenuButton = DialogMenuButton.filter(
				(a) => a.startsWith("Remote") || a === "Exit"
			)
			return ret
		}
		return next(args)
	}
)

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
				message: null,
			})
			clearState()
			return null
		}
		return next(args)
	}
)

SDK.hookFunction(
	"DialogLeave",
	HOOK_PRIORITY.OVERRIDE_BEHAVIOR,
	(args, next) => {
		if (getRenderState() === "interactable") {
			return DialogLeaveFocusItem()
		}
		return next(args)
	}
)

SDK.hookFunction(
	"DialogInventoryBuild",
	HOOK_PRIORITY.OVERRIDE_BEHAVIOR,
	(args, next) => {
		if (getRenderState() === "interactable") {
			const ret = next(args)
			DialogInventory = []
			return ret
		}
		return next(args)
	}
)

SDK.hookFunction(
	"FriendListLoadFriendList",
	HOOK_PRIORITY.ADD_BEHAVIOR,
	(args, next) => {
		const ret = next(args)
		if (getRenderState() === "" && ServerPlayerIsInChatRoom()) {
			Array.from(document.querySelectorAll(".FriendListRow")).forEach((row) => {
				const remote = document.createElement("div")
				remote.classList.add("FriendListLinkColumn")
				row.setAttribute(
					"data-membernumber",
					/** @type {HTMLDivElement} */ (row.children[1]).innerText.trim()
				)
				remote.onclick = () => {
					const member = parseInt(row.getAttribute("data-membernumber"))
					if (isNaN(member)) {
						console.error("Invalid member number in data-membernumber")
						return
					}

					FriendListReturn = {
						Module: "Online",
						Screen: "ChatRoom",
					}
					FriendListExit()
					sendRequest(member)
				}
				remote.innerText = "Remote"
				row.appendChild(remote)
			})
		}
		return ret
	}
)

SDK.hookFunction("GameRun", HOOK_PRIORITY.OBSERVE, (args, next) => {
	if (getRenderState() === "loading" && Date.now() - getLastRequest() > 5000) {
		clearState()
		chatNotify("The remote request timed out. The player may be offline.")
	}
	return next(args)
})

function clearState() {
	// clearChangeMessages()
	ChatRoomStatusUpdate("")
	setRenderState("")
	setLastRequest(0)
	DialogLeave()
	// ChatRoomShowElements()
}
