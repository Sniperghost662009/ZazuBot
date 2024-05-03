export async function before(m, { conn }) {
		// Respuesta de anuncio 
 global.adReply = {
			contextInfo: {
			mentionedJid: [m.sender],
				forwardingScore: 9999,
				externalAdReply: {
				showAdAttribution: true,
					title: desc,
					body: desc,
					mediaUrl: null,
					description: null,
					previewType: "PHOTO",
					thumbnail: catalogo,
					sourceUrl: group
				}
			}
		}
		
		// Respuesta de descargas de YouTube
 global.adYT = {
			contextInfo: {
			mentionedJid: [m.sender],
				forwardingScore: 9999,
				externalAdReply: {
				showAdAttribution: true,
					title: desc,
					body: desc,
					mediaUrl: null,
					description: null,
					previewType: "PHOTO",
					thumbnail: catalogo,
					sourceUrl: group
				}
			}
		}
		
		  // Respuesta de Stickers 
 global.adSticker = {
			contextInfo: {
			mentionedJid: [m.sender],
				forwardingScore: 9999,
				externalAdReply: {
				showAdAttribution: true,
					title: desc,
					body: desc,
					mediaUrl: null,
					description: null,
					previewType: "PHOTO",
					thumbnail: catalogo,
					sourceUrl: group
				}
			}
		}
		//Respuesta de busquedas 
 global.adSearch = {
			contextInfo: {
			mentionedJid: [m.sender],
				forwardingScore: 9999,
				externalAdReply: {
				showAdAttribution: true,
					title: desc,
					body: desc,
					mediaUrl: null,
					description: null,
					previewType: "PHOTO",
					thumbnail: catalogo,
					sourceUrl: group
				}
			}
		}
		//Respuesta de Nsfw 
 global.adNsfw = {
			contextInfo: {
			mentionedJid: [m.sender],
				forwardingScore: 9999,
				externalAdReply: {
				showAdAttribution: true,
					title: desc,
					body: desc,
					mediaUrl: null,
					description: null,
					previewType: "PHOTO",
					thumbnail: catalogo,
					sourceUrl: group
				}
			}
		}
}
