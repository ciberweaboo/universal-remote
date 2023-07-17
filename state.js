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

/** @type {'' | 'loading' | 'interactable'} */
let renderState = ""
let lastRequest = 0
let targetPlayer = 0
// let changeMessages = []

export function getRenderState() {
	return renderState
}

/**
 * @param {'' | 'loading' | 'interactable'} newState
 */
export function setRenderState(newState) {
	renderState = newState
}

export function getLastRequest() {
	return lastRequest
}

/**
 * @param {number} newRequest
 */
export function setLastRequest(newRequest) {
	lastRequest = newRequest
}

export function getTargetPlayer() {
	return targetPlayer
}

/**
 * @param {number} newTarget
 */
export function setTargetPlayer(newTarget) {
	targetPlayer = newTarget
}

// export function getChangeMessages() {
// 	return changeMessages
// }

// /**
//  * @param {object} newMessage
//  */
// export function addChangeMessage(newMessage) {
// 	changeMessages.push(newMessage)
// }

// export function clearChangeMessages() {
// 	changeMessages = []
// }
