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

import { ModSDKGlobalAPI } from "./bcModSdk"

declare global {
	interface Window {
		bcModSdk: ModSDKGlobalAPI<unknown>
	}
}

export type Beep = {
	BeepType: "" | "Leash"
	Message: string
	IsSecret: boolean
	MemberNumber: number
}

export type UniRemoteRequest = {
	nature: "request"
	action: "remote"
}

export type UniRemoteUpdate = {
	nature: "update"
	appearance: ItemBundle[]
	message: object
}

export type UniRemoteResponse = {
	nature: "response"
	allowed: boolean
	bundle?: UniRemoteBundle
}

export type UniRemoteMessage = {
	type: "uniremote"
	nonce: number
} & (UniRemoteResponse | UniRemoteRequest | UniRemoteUpdate)

// From ChatRoomSyncSingle
export type UniRemoteBundle = {
	ID: string
	Name: string
	AssetFamily: string
	Title: string
	Nickname: string
	Appearance: ItemBundle[]
	ActivePose: string[]
	Reputation: Reputation[]
	Creation: number
	Lovership: Lovership[]
	Description: string
	Owner: string
	MemberNumber: number
	LabelColor: string
	ItemPermission: number
	Inventory: Record<string, string[]>
	Ownership: Ownership
	BlockItems: Record<string, Record<string, string[]>>
	LimitedItems: Record<string, Record<string, string[]>>
	FavoriteItems: Record<string, Record<string, string[]>>
	ArousalSettings: ArousalSettingsType
	OnlineSharedSettings: CharacterOnlineSharedSettings
	WhiteList: string[]
	BlackList: string[]
	Game: unknown
	Crafting: string
	Difficulty: {
		Level: number
		LastChange?: number
	}
}
