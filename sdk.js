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

export const SDK = window.bcModSdk.registerMod(
	{
		name: "UniRemote",
		fullName: "Universal Remote",
		version: "1.0.0",
		repository: "https://gitlab.com/sidiousious/universal-remote",
	},
	{
		allowReplace: false,
	}
)

export const HOOK_PRIORITY = /** @type {const} */ ({
	OBSERVE: 0,
	ADD_BEHAVIOR: 1,
	MODIFY_BEHAVIOR: 5,
	OVERRIDE_BEHAVIOR: 10,
	TOP: 100,
})
