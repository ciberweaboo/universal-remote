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

/**
 * @param {any} msg
 * @returns {msg is import("./types/uniremote").UniRemoteMessage}
 */
export function isUniRemoteMessage(msg) {
	return (
		typeof msg === "object" && msg && "type" in msg && msg.type === "uniremote"
	)
}

/**
 * @param {any} msg
 * @returns {msg is import("./types/uniremote").Beep}
 */
export function isBeep(msg) {
	return typeof msg === "object" && msg && "BeepType" in msg
}
