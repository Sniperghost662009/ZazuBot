let handler = async (m, { conn, text, usedPrefix, command }) => {
        
conn.relayMessage(m.chat, {viewOnceMessage: {
                        message: {
                                interactiveMessage: {
                                        body: { text: 'hello world' },
                      footer: { text: 'test footer' },
                                header: {
                                        hasMediaAttachment: true,
                                        imageMessage: info[type].contextInfo.quotedMessage.imageMessage
                                },
                                  nativeFlowMessage: {
                                        buttons: [
                                                {
                                                        name: 'cta_url',
                                                        buttonParamsJson: JSON.stringify({
                                                                display_text: 'test url',
                                                                url: 'https://www.google.com',
                                                                merchant_url: 'https://www.google.com',
                                                          id: 'aoba'
                                                        })
                                                },
                                                {
                                                        name: 'quick_reply',
                                                        buttonParamsJson: JSON.stringify({
                                                                  display_text: 'test button',
                                                                id: 'aoba2'
                                                        })
                                                  },
                                                {
                                                        name: 'cta_copy',
                                                        buttonParamsJson: JSON.stringify({
                                                                display_text: 'test copy',
                                                                copy_code: 'K'.repeat(50),
                                                                id: 'aoba3'
                                                        })
                                                }
                                   ],
                                   messageParamsJson: ''
                                  }
                                }
                        }
                }}, {})
        
/*conn.relayMessage(m.chat, {
        viewOnceMessage: {
                        message: {
                                interactiveMessage: {
                                        header: { title:  `test` },
                                        body: { text: '' },
                                        nativeFlowMessage: {
                                                buttons: [
                                                        {
                                                                name: 'single_select',
                                                        buttonParamsJson: JSON.stringify({
                                                                title: 'botones',
                                                                sections: [
                                                                        {
                                                                                title: 'List',
                                                                    highlight_label: 'ON',
                                                                    rows: [
                                                                        {
                                                                                header: 'owner',
                                                                                      title: '.owner',
                                                                                  description: '',
                                                                                  id: 'test'
                                                                        }
                                                                    ]
                                                                        },
                                                                        {
                                                                                highlight_label: 'ON',
                                                                                rows: [
                                                                                        {
                                                                                header: 'menu',
                                                                                      title: '.menu',
                                                                                  description: '',
                                                                                  id: 'tes'
                                                                        }
                                                                                ]
                                                                        },
                                                                        {
                                                                                highlight_label: 'ON',
                                                                                rows: [
                                                                                        {
                                                                                header: 'grupos ofc',
                                                                                      title: '.grupos',
                                                                                  description: '',
                                                                                  id: 'te'
                                                                        }
                                                                                ]
                                                                        }
                                                                ]
                                                        })
                                                        }
                                        ],
                                        messageParamsJson: ''
                                        }
                                }
                        }
                }
}, {})}*/


handler.command = ['boton'];
export default handler;
