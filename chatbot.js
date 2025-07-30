const { Client, LocalAuth, MessageMedia, List, Buttons } = require('whatsapp-web.js');
const express = require('express');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal'); // Importar a biblioteca de QR Code
//const fs = require('fs');
//const path = require('path');

const sessionDataPath = path.resolve(__dirname, './.wwebjs_auth/session-nova-sessao');
const lockFile = path.join(sessionDataPath, 'SingletonLock');



// Variáveis de estado
let isAuthenticated = false;
let client;
let encerrado=false;

// Função assíncrona para iniciar o Playwright e o cliente do WhatsApp
function iniciarBot(){
 
if (fs.existsSync(lockFile)) {
    try {
        fs.unlinkSync(lockFile);
        console.log('🔓 Arquivo SingletonLock removido com sucesso.');
    } catch (err) {
        console.error('Erro ao remover SingletonLock:', err);
    }
}

    client = new Client({
        authStrategy: new LocalAuth({ clientId: 'nova-sessao' }),
        puppeteer: {
          
            headless: true,
            executablePath:"/usr/bin/google-chrome",
            args: ['--no-sandbox', '--disable-setuid-sandbox'
      ],
		 
            }
       //node --max-old-space-size=4096 chatbot.js

    });

    // Evento quando o cliente precisa exibir o QR Code
    client.on('qr', qr => {
        console.log('Escaneie o QR Code abaixo para conectar:');
        qrcode.generate(qr, { small: true }); // Exibe o QR Code no terminal de forma visual
    });
    client.on('loading_screen', (percent, message) => {
        console.log(`[INFO] Carregando... ${percent}% - ${message}`);
    });
    // Evento quando o cliente está autenticado
    client.on('authenticated', () => {
        console.log('[INFO] Cliente autenticado!');
        isAuthenticated = true;
        lastQRCode = null; // Limpar o último QR Code
    });

    // Evento quando a autenticação falha
    client.on('auth_failure', (msg) => {
        console.error('[ERRO] Falha na autenticação:', msg);
        isAuthenticated = false;
    });

    // Quando o cliente está pronto
    client.on('ready', () => {
        console.log('[INFO] Bot está pronto!');
        isAuthenticated = true;
    });
   client.on('message', async msg => {
        if (encerrado) return;

        if (msg.body === '!sair') {
           encerrado = true;
            try {
                await msg.reply('Encerrando...');
            } catch (e) {
                console.log('Erro ao enviar msg:', e.message);
            }
            await client.destroy();
            setTimeout(() => process.exit(0), 2000);
        }

        // outros comandos aqui...
    });

     

   

client.on('disconnected', (reason) => {
    console.log('Bot desconectado. Motivo:', reason);
    // Não chame iniciarBot() diretamente aqui.
    // Deixe o gerenciador de processos (PM2) fazer o trabalho de reiniciar.
    process.exit(1); // Isso faz o Node.js sair, e o PM2 o reiniciará.
});
    client.initialize();
// Remova as chamadas duplicadas de process.on('unhandledRejection') e process.on('uncaughtException')
// Mantenha apenas uma versão para cada.
process.on('unhandledRejection', (reason) => {
    console.error('❌ Erro não tratado:', reason);
    process.exit(1); // PM2 irá reiniciar automaticamente
});
process.on('uncaughtException', err => {
    console.error('[EXCEPTION]', err);
    process.exit(1); // PM2 irá reiniciar automaticamente
});
console.log('[INFO] Inicialização concluída.');
}
iniciarBot();



   
    

//console.log("Verificando client:", client);


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
            const chat = await msg.getChat();
			
			//Mensagem inicial
									// Delay de 3 segundo
			msg.react('👍');
            //await delay(2000);
			await chat.sendStateRecording(); 			// Simulando Digitação
			//await delay(25000);						// Delay de 20 segundos
			const audio_1 = await MessageMedia.fromFilePath('./audios/explicando_opus.ogg');
			await delay(5000)
			await client.sendMessage(msg.from,audio_1,{sendAudioAsVoice: true} ); 
			await chat.clearState();
              
             // Enviando video
			console.log('Carregando video...');
			await delay(4000);
			const modoUso= await MessageMedia.fromFilePath('./videos/curso-por-dentro_.mp4');
			//await delay(8000);
			//console.log('modoUso:', modoUso);
			console.log('Enviando video...');
			await client.sendMessage(msg.from,modoUso);
                        console.log('Video enviado');

             //Enviando audio 
			await chat.sendStateRecording(); 			// Simulando Digitação						// Delay de 20 segundos
			const audio_2 = MessageMedia.fromFilePath('./audios/gancho_opus.ogg');
			await delay(20000);
			await client.sendMessage(msg.from,audio_2,{sendAudioAsVoice: true} ); 
			await chat.clearState();

           //Texto
			   await chat.sendStateTyping();
			   await delay(8000);
			   await client.sendMessage(msg.from,'Olha só o que dizem os alunos da Jornada do Autodidata em Inglês:👇🏾');
                           await chat.sendStateTyping(); 
			   await chat.clearState();
               // Enviando video
			console.log('Carregando depo...);
			const depo= await MessageMedia.fromFilePath('./videos/depoimentos_.mp4');
			console.log('Enviando...);
			await client.sendMessage(msg.from,depo);
			console.log('enviado....');
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
