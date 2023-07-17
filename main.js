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

import { BaseURL } from "./config.js"
import "./hooks.js"
import { sendRequest } from "./messages.js"

const styles = document.createElement("link")
styles.rel = "stylesheet"
styles.href = BaseURL + "static/styles.css"
document.head.appendChild(styles)

Commands.push({
	Tag: "ur",
	Description: "[member number] - open the Universal Remote",
	Action: (_args, _msg, parsed) => {
		if (!Player.CanInteract()) {
			return "You cannot use this command right now"
		}
		if (ChatRoomGame !== "") {
			return "You cannot use this command in a mini game"
		}
		if (parsed.length !== 1) {
			return "Invalid arguments"
		}
		const member = parseInt(parsed[0])
		if (isNaN(member)) {
			return "Invalid member number"
		}

		if (ChatRoomCharacter.some((c) => c.MemberNumber === member)) {
			ChatRoomFocusCharacter(
				ChatRoomCharacter.find((c) => c.MemberNumber === member)
			)
			return
		}

		sendRequest(member)
	},
})
