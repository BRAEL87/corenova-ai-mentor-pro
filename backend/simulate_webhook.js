const axios = require('axios');

const URL = 'http://localhost:5000/api/webhook';

const simulateMessage = async (messageText, from = '1234567890', name = 'Test Student') => {
    const payload = {
        object: 'whatsapp_business_account',
        entry: [
            {
                id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
                changes: [
                    {
                        value: {
                            messaging_product: 'whatsapp',
                            metadata: {
                                display_phone_number: '15550000000',
                                phone_number_id: '122111111111111'
                            },
                            contacts: [
                                {
                                    profile: { name: name },
                                    wa_id: from
                                }
                            ],
                            messages: [
                                {
                                    from: from,
                                    id: 'wamid.HBgLMTIzNDU2Nzg5MBVfAhgUM0EzNTQ2QURDRkJEN0U0QkYyRjkA',
                                    timestamp: Math.floor(Date.now() / 1000).toString(),
                                    text: { body: messageText },
                                    type: 'text'
                                }
                            ]
                        },
                        field: 'messages'
                    }
                ]
            }
        ]
    };

    try {
        console.log(`\x1b[36m[Simulating Message from ${name}]: "${messageText}"\x1b[0m`);
        const response = await axios.post(URL, payload);
        console.log(`\x1b[32m[Server Response Status]: ${response.status}\x1b[0m`);
    } catch (error) {
        console.error(`\x1b[31m[Error Simulating Message]: ${error.message}\x1b[0m`);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
};

// Help menu
const runTests = async () => {
    const args = process.argv.slice(2);
    const msg = args.join(' ') || 'START';
    await simulateMessage(msg);
};

runTests();
