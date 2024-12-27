const { Client, LocalAuth ,MessageMedia} = require('whatsapp-web.js');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Inicializar cliente com autenticação local
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'nova-sessao',
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
});

// Quando o cliente está pronto
client.on('ready', () => {
    console.log('[INFO] Bot está pronto!');
});

// Ao receber uma mensagem
client.on('message', async (msg) => {
    try {
        console.log(`[INFO] Mensagem de ${msg.from}: ${msg.body}`);
        if (msg.body === 'Olá') {
            await client.sendMessage(msg.from, 'Olá! Como posso ajudar?');
        }
    } catch (error) {
        console.error('[ERRO] Ocorreu um problema ao processar a mensagem:', error);
    }
});

// Inicializar cliente
client.initialize();

// Servir rota para QR Code
app.get('/qr', (req, res) => {
    const qrFilePath = path.join(__dirname, 'qr-codes', 'index.html');
    if (fs.existsSync(qrFilePath)) {
        res.sendFile(qrFilePath);
    } else {
        res.send('QR Code ainda não foi gerado.');
    }
});

app.listen(PORT, () => {
    console.log(`[INFO] Servidor rodando em http://localhost:${PORT}`);
});

// Função para criar um delay entre uma ação e outra
const delay = ms => new Promise(res => setTimeout(res, ms)); 

//Emojis que podemos usar nas conversas
//1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟 ➡️ ⤵️ 👙 👗 💲 💎 📅 📆 🗓️ 🗒️ 📋 📒 📝 🎧 📲 ⚠️ 🙋🏼‍ 🤎 🖤 💛 📈 🛒 ❤️ 🤩

//Mensagem do menu de opções
const menu_opcoes = 'Se tiver duvidas digite uma das opções abaixo:\n\n1️⃣ - *Quanto custa* \n\n2️⃣ - *Como Comprar Progressiva Vegetal Em Creme* ';
// Configuração do Funil
// ---------------------
client.on('ready', () => {
    console.log('Cliente WhatsApp está pronto!');
});

client.on('message', async msg => {
    
	try{
		// Menu principal
		if (msg.body.match(/(olá|oi|Olá! Quero saber mais sobre a progressiva vegetal)/i) && msg.from.endsWith('@c.us')) {

			//Captura a mensagem enviada pelo cliente
			const chat = await msg.getChat();
			
			//Mensagem inicial
			await delay(10000); 						// Delay de 3 segundo
			msg.react('👍');
			await chat.sendStateTyping(); 			// Simulando Digitação
			await delay(10000);						// Delay de 3 segundos
			const contact = await msg.getContact(); // Captura o contato
			const name = contact.pushname; 			// Captura o nome do contato
			await client.sendMessage(msg.from, 'Oi ' + name.split(" ")[0] + '! Meu nome é Daniela, sou atendente da Havana Cosméticos e vou te passar algumas informações sobre a *PROGRESSIVA VEGETAL,blz?😉*'); 
			await chat.clearState();
            

			//Video de como aplicar a progressiva
			const media_video = MessageMedia.fromFilePath('./videos/modo de usar.mp4');
			await delay(10000);
            await client.sendMessage(msg.from, media_video, {caption: 'Como aplicar a progressiva! 🥰'});
             //Audio explicando a composição
			
			await chat.sendStateRecording();

			await delay(62000);
			const media_audio = MessageMedia.fromFilePath('./audios/Quebra.aac');
			await client.sendMessage(msg.from, media_audio, {sendAudioAsVoice: true});
			await chat.clearState();
			await delay(5000);
			const m_video = MessageMedia.fromFilePath('./videos/5.mp4');
			await client.sendMessage(msg.from, m_video, {caption: 'Resultado de uma das nossas clientes'});
			//Menu de opções
			
			await client.sendMessage(msg.from, menu_opcoes); 
		}

		//Opção 1 - Preço do produto
		if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')) { 
			
			//Captura a mensagem enviada pelo cliente
			const chat = await msg.getChat();
			msg.react('🥰');

			
			await delay(1000); 						// Delay de 1 segundo
			await chat.sendStateTyping();
			await delay(5000);
			await client.sendMessage(msg.from, 'Atualmente nossa progressiva está saindo no valor de R$197,00');
			await chat.sendStateRecording();
			await delay(40000); 						// Delay de 3 segundos
			const media_audio = MessageMedia.fromFilePath('./audios/oferta.aac');
			await client.sendMessage(msg.from, media_audio, {sendAudioAsVoice: true});
			await client.sendMessage(msg.from, menu_opcoes); 
			await chat.clearState();
			
		}

		//Opção 2 - Informações sobre o *Sutiã Slim Comfort*
		if (msg.body !== null && msg.body === '2' && msg.from.endsWith('@c.us')) { 
		
			//Captura a mensagem enviada pelo cliente
			const chat = await msg.getChat(); 
			

			//Enviar audio de como funciona o sutia
			await delay(3000); 						// Delay de 1 segundo
			await chat.sendStateTyping();
			await delay(10000); 						// Delay de 10 segundos
			
			//const media_audio2 = MessageMedia.fromFilePath('./audios/a1 sutia.aac');
			await client.sendMessage(msg.from,"é só você me mandar seu nome completo,numero de telefone e seu CEP ");
			await chat.clearState();
			
			//Menu de opções
			await chat.sendStateTyping(); 	// Simulando Digitação
			await delay(3000); 				// Delay de 3 segundos
			await client.sendMessage(msg.from, menu_opcoes); 
			await chat.clearState();
		}
		
		
		
	
	} catch (error) {
		//Em caso de erro
		console.log('Ocorreu um erro: ', error);
	}
});

// Rejeita chamadas de audio ou video automaticamente
client.on('call', async (call) => {
    console.log('Call received, rejecting. GOTO Line 261 to disable', call);
    await call.reject();
    //await client.sendMessage(call.from, `[${call.fromMe ? 'Outgoing' : 'Incoming'}] Phone call from ${call.from}, type ${call.isGroup ? 'group' : ''} ${call.isVideo ? 'video' : 'audio'} call. ${'This call was automatically rejected by the script.' : ''}`);
});

// Gerenciamento de erros
process.on('unhandledRejection', (error) => {
	console.log("Unhandled promise rejection:", error);
  });
  
  
  
  app.use('/qr', express.static(path.join(__dirname, 'qr-codes')));

app.get('/', (req, res) => {
    res.send('Bot está rodando. Acesse /qr para ver os QR Codes.');
});


//---------------------------------------------------------------------------

//Trechos de código para auxiliar no desenvolvimento

//Enviar texto
//await client.sendMessage(msg.from, 'Link para cadastro: https://site.com');

//Enviar imagem
//const media_imagem = MessageMedia.fromFilePath('./imagens/imagem1.jpg');
//await client.sendMessage(msg.from, media_imagem, {caption: 'Olha isso... não é lindo?! 🥰'});

//Enviar audio
//const media_audio = MessageMedia.fromFilePath('./audios/audio1.aac');
//await client.sendMessage(msg.from, media_audio, {sendAudioAsVoice: true});

//Enviar video
//const media_video = MessageMedia.fromFilePath('./videos/video1.mp4');
//await client.sendMessage(msg.from, media_video, {caption: 'Olha isso... não é lindo?! 🥰'});

//Reagir a uma mensagem
//msg.react('👍');
