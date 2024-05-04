let handler = async (m, { conn, text, usedPrefix, command }) => {
        
    conn.relayMessage(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: 'Aquí está tu código:' },
                    footer: { text: 'Presiona el botón para copiar' },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: 'cta_copy',
                                buttonParamsJson: JSON.stringify({
                                    display_text: 'Copiar código',
                                    copy_code: codeBot, // Aquí se debe reemplazar codeBot con tu variable que contiene el código
                                    id: 'copy_button'
                                })
                            }
                        ]
                    }
                }
            }
        }
    }, {});
}

handler.command = ['boton'];
export default handler;
