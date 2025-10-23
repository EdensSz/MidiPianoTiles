import { getPlayer } from "./Player.js"

/**
 * Charge un fichier MIDI depuis une URL
 */
export class MidiUrlLoader {
	/**
	 * Charge un fichier MIDI depuis une URL
	 * @param {string} url - URL du fichier MIDI
	 * @param {string} songName - Nom optionnel du morceau
	 * @returns {Promise} Promise qui se résout quand le MIDI est chargé
	 */
	static async loadFromUrl(url, songName = null) {
		try {
			console.log("Loading MIDI from URL:", url)

			// Fetch le fichier MIDI
			const response = await fetch(url)
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			// Récupérer le blob
			const blob = await response.blob()
			
			// Convertir le blob en Data URL
			const dataUrl = await this.blobToDataUrl(blob)
			
			// Extraire le nom du fichier de l'URL si pas de nom fourni
			if (!songName) {
				songName = this.extractFilenameFromUrl(url)
			}

			// Charger dans le player
			getPlayer().loadSong(dataUrl, songName)
			
			console.log("MIDI loaded successfully:", songName)
			return true

		} catch (error) {
			console.error("Error loading MIDI from URL:", error)
			throw error
		}
	}

	/**
	 * Convertit un Blob en Data URL
	 */
	static blobToDataUrl(blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = () => resolve(reader.result)
			reader.onerror = reject
			reader.readAsDataURL(blob)
		})
	}

	/**
	 * Extrait le nom de fichier depuis une URL
	 */
	static extractFilenameFromUrl(url) {
		try {
			const pathname = new URL(url).pathname
			const filename = pathname.split('/').pop()
			return filename || 'Song from URL'
		} catch {
			return 'Song from URL'
		}
	}

	/**
	 * Charge un MIDI depuis un paramètre URL (?midi=...)
	 * Appelle cette fonction au chargement de la page
	 */
	static loadFromUrlParameter() {
		const urlParams = new URLSearchParams(window.location.search)
		const midiUrl = urlParams.get('midi')
		
		if (midiUrl) {
			// Décoder l'URL si elle est encodée
			const decodedUrl = decodeURIComponent(midiUrl)
			console.log("MIDI URL parameter detected:", decodedUrl)
			
			// Charger après un petit délai pour laisser le temps au player de s'initialiser
			setTimeout(() => {
				this.loadFromUrl(decodedUrl)
			}, 1000)
		}
	}
}

// Export de la fonction principale pour usage simple
export async function loadMidiFromUrl(url, songName = null) {
	return MidiUrlLoader.loadFromUrl(url, songName)
}

// Export de la fonction pour charger depuis le paramètre URL
export function initMidiUrlLoading() {
	MidiUrlLoader.loadFromUrlParameter()
}
