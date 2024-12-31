const { Client, LocalAuth, MessageMedia,List,Buttons} = require('whatsapp-web.js');
const express = require('express');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode'); // Importar a biblioteca de QR Code

const app = express();
const PORT = 3000;

// Diretório para salvar os QR Codes
const qrDir = path.join(__dirname, 'qr-codes');
if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir);
}

// Inicializar cliente com autenticação local
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'nova-sessao',
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox','--use-fake-ui-for-media-stream',
            '--allow-file-access-from-files',
            '--autoplay-policy=no-user-gesture-required',],
        
    },
});

// Variável para armazenar o estado de autenticação e QR Code
let isAuthenticated = false;
let lastQRCode = null;

// Evento quando o cliente precisa exibir o QR Code
client.on('qr', (qr) => {
    console.log('[INFO] QR Code recebido. Gerando imagem...');
    qrcode.toFile(path.join(qrDir, 'qr-code.png'), qr, (err) => {
        if (err) {
            console.error('[ERRO] Não foi possível salvar o QR Code:', err);
            return;
        }
        lastQRCode = qr; // Salvar o último QR Code gerado
        console.log('[INFO] QR Code gerado com sucesso!');
    });
});

// Evento quando o cliente está autenticado
client.on('authenticated', () => {
    console.log('[INFO] Cliente autenticado!');
    isAuthenticated = true;
    lastQRCode = null; // Limpar o último QR Code
});

// Evento quando a autenticação é encerrada
client.on('auth_failure', (msg) => {
    console.error('[ERRO] Falha na autenticação:', msg);
    isAuthenticated = false;
});

// Quando o cliente está pronto
client.on('ready', () => {
    console.log('[INFO] Bot está pronto!');
    isAuthenticated = true;
});

// Ao receber uma mensagem
client.on('message', async (msg) => {
    try {
        console.log(`[INFO] Mensagem de ${msg.from}: ${msg.body}`);
        if (msg.body === 'iu') {
            await client.sendMessage(msg.from, 'Olá! Como posso ajudar?');
        }
    } catch (error) {
        console.error('[ERRO] Ocorreu um problema ao processar a mensagem:', error);
    }
});

// Inicializar cliente
client.initialize();

// Rota para exibir QR Code se necessário
app.get('/qr', (req, res) => {
    if (isAuthenticated) {
        res.send('O cliente já está autenticado.');
    } else if (lastQRCode) {
        const qrImagePath = path.join(qrDir, 'qr-code.png');
        if (fs.existsSync(qrImagePath)) {
            res.sendFile(qrImagePath);
        } else {
            res.send('QR Code foi gerado, mas o arquivo não foi encontrado.');
        }
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


// Configuração do Funil
// ---------------------
client.on('ready', () => {
    console.log('Cliente WhatsApp está pronto!');
});

client.on('message', async msg => {
    
	try{
		// Menu principal
		if (msg.body.match(/(Olá! Tenho interesse e queria mais informações, por favor)/i) && msg.from.endsWith('@c.us')) {

			//Captura a mensagem enviada pelo cliente
			const chat = await msg.getChat();
			
			//Mensagem inicial
									// Delay de 3 segundo
			msg.react('👍');
            await delay(3000);
			await chat.sendStateRecording(); 			// Simulando Digitação
			await delay(25000);						// Delay de 20 segundos
			const audio_1 = MessageMedia.fromFilePath('./audios/audio_1.ogg');
			await client.sendMessage(msg.from,audio_1,{sendAudioAsVoice: true} ); 
			await chat.clearState();
              


             //Enviando audio sobre o produto
			await chat.sendStateRecording(); 			// Simulando Digitação
			await delay(18000);						// Delay de 20 segundos
			const audio_2 = MessageMedia.fromFilePath('./audios/audio_2.ogg');
			await client.sendMessage(msg.from,audio_2,{sendAudioAsVoice: true} ); 
			await chat.clearState();

            // Ultimo audio
            await chat.sendStateRecording(); 			// Simulando Digitação
			await delay(18000);						// Delay de 20 segundos
			const audio_3 = MessageMedia.fromFilePath('./audios/audio_3.ogg');
			await client.sendMessage(msg.from,audio_3,{sendAudioAsVoice: true} ); 
			await chat.clearState();

			// Enviando texto
			await chat.sendStateTyping();
			await delay(5000);
			await client.sendMessage(msg.from,'Olha essa foto que a minha cliente  me enviou agorinha. Veja como ficou lindo o cabelo dela 😍👇🏾')

             // Enviando foto
			 foto=MessageMedia.fromFilePath('./images/antes_e_depois_2.jpg');
			 await client.sendMessage(msg.from,foto)
			 await chat.clearState();

			 
               
			   //Texto
			   await chat.sendStateTyping();
			   await delay(5000);
			   await client.sendMessage(msg.from,'Funciona para todos os tipos de cabelo e você pode usar no cabelo seco ou úmido, ela aquece super rápido, não quebra os fios e tem tecnologia antifrizz profissional 😉');
			   //Texto com condição
			   await delay(6000);
			   await client.sendMessage(msg.from,'Ficou alguma dúvida?');
               await chat.clearState();
            }  
			if(msg.body.match(/(preço|preco|nao|não|quanto e|quanto é?|e quanto|e quanto?|é quanto|valor|qual valor)|como|compra|comprar|custa/i) && msg.from.endsWith('@c.us')){
                chat = await msg.getChat();
                foto2=MessageMedia.fromFilePath('./images/119.png');
				await client.sendMessage(msg.from,foto2);
				await chat.sendStateTyping();
				await delay(8000);
				await client.sendMessage(msg.from,'⭐ VALOR APENAS R$ 119,99 ⭐\nVocê agenda a entrega comigo agora e recebe no dia que preferir, não precisa pagar nada agora. Você vai receber o produto e pagar direto ao entregador no dinheiro, Pix, débito ou crédito em até 12x 😉');
				await chat.sendStateTyping();
				await delay(6000);
                await client.sendMessage(msg.from,"*OBS: O PAGAMENTO NA ENTREGA SÓ ESTÁ DISPONIVEL PARA ALGUMAS CIDADES!!*");
                await delay(30000);
				await client.sendMessage(msg.from,'Vamos agendar seu pedido? 😊\n✅ Qual é o seu nome completo?\n✅ Qual é o endereço para entrega? (rua, número da casa, cidade, estado e cep)');
			    await delay(3000);
				await client.sendMessage(msg.from,'Qual dia você quer receber seu produto?');
			
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
