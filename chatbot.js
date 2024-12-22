// Leitor de QR code
const qrcode = require('qrcode-terminal');

// Carrega Client WhatsApp
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js');

const client = new Client({
    puppeteer: {
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    }
});

// Serviço de leitura do QR code
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

// Verifica se a conexao foi bem sucedida
client.on('ready', () => {
    console.log('WhatsApp conectado com sucesso.');
});

// Inicializa Client 
client.initialize();

// Função para criar um delay entre uma ação e outra
const delay = ms => new Promise(res => setTimeout(res, ms)); 

//Emojis que podemos usar nas conversas
//1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟 ➡️ ⤵️ 👙 👗 💲 💎 📅 📆 🗓️ 🗒️ 📋 📒 📝 🎧 📲 ⚠️ 🙋🏼‍ 🤎 🖤 💛 📈 🛒 ❤️ 🤩

//Mensagem do menu de opções
const menu_opcoes = 'Se tiver duvidas digite uma das opções abaixo:\n\n1️⃣ - *Quanto custa* \n\n2️⃣ - *Como Comprar Progressiva Vegetal Em Creme* \n\n3️⃣ *- Locais com entrega rápida* ‍';

// Configuração do Funil
// ---------------------

client.on('message', async msg => {

	try{
		// Menu principal
		if (msg.body.match(/(Olá! Quero saber mais sobre a progressiva vegetal)/i) && msg.from.endsWith('@c.us')) {

			//Captura a mensagem enviada pelo cliente
			const chat = await msg.getChat();
			msg.react('👍');

			//Mensagem inicial
			await delay(3000); 						// Delay de 3 segundo
			await chat.sendStateTyping(); 			// Simulando Digitação
			await delay(10000);						// Delay de 3 segundos
			const contact = await msg.getContact(); // Captura o contato
			const name = contact.pushname; 			// Captura o nome do contato
			await client.sendMessage(msg.from, 'Olá ' + name.split(" ")[0] + '! Meu nome é Daniela, sou atendente da Havanas Cosméticos e vou te passar algumas informações sobre a *PROGRESSIVA VEGETAL*'); 
			await chat.clearState();
            

			//Video de como aplicar a progressiva
			const media_video = MessageMedia.fromFilePath('./videos/modo de usar.mp4');
            await client.sendMessage(msg.from, media_video, {caption: 'Como aplicar a progressiva! 🥰'});
             //Audio explicando a composição
			
			await chat.sendStateRecording();

			await delay(62000);
			const media_audio = MessageMedia.fromFilePath('./audios/Quebra.aac');
			await client.sendMessage(msg.from, media_audio, {sendAudioAsVoice: true});
			await chat.clearState();
			await delay(5000);
			//Menu de opções
			
			await client.sendMessage(msg.from, menu_opcoes); 
		}

		//Opção 1 - Preço do produto
		if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')) { 
			
			//Captura a mensagem enviada pelo cliente
			const chat = await msg.getChat();
			msg.react('🥰');

			
			await delay(1000); 						// Delay de 1 segundo
			const media_imagem = MessageMedia.fromFilePath('./images/preco.png');
			await client.sendMessage(msg.from, media_imagem);
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
			await client.sendMessage(msg.from,"Para poder comprar com a gente, você deve fornecer seu nome completo, cep, nº da casa e telefone. Com esses dados o agendamento da sua entrega será realizada e o pagamento só é feito quando você estiver com o   produto em mãos");
			await chat.clearState();
			
			//Menu de opções
			await chat.sendStateTyping(); 	// Simulando Digitação
			await delay(3000); 				// Delay de 3 segundos
			await client.sendMessage(msg.from, menu_opcoes); 
			await chat.clearState();
		}
		
		//Opção 3 - LOcalidades
		if (msg.body !== null && msg.body === '3' && msg.from.endsWith('@c.us')) { 
		
			//Captura a mensagem enviada pelo cliente
			const chat = await msg.getChat();
			

			//Enviar mensagem sobre os preços
			await delay(3000); 						// Delay de 1 segundo
			await chat.sendStateTyping(); 			// Simulando Digitação
			await delay(10000); 						// Delay de 5 segundos
			await client.sendMessage(msg.from,'Se você mora em uma dessas cidades a entrega é feita em 24 horas ou em até em 3 dias utéis:\n*Almirante Tamandaré*\n*Curitiba*\n*Araucária*\n*Colombo*\n*Fazenda Rio Grande*\n*Pinhais*\n*Piraquara*\n*São José dos Pinhais*');
			await chat.clearState();
			
			//Menu de opções
			await chat.sendStateTyping(); 	   // Simulando Digitação
			await delay(3000); 				  // Delay de 3 segundos,,
			//await chat.setPresenceOnline();
			await client.sendMessage(msg.from, menu_opcoes); 
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
