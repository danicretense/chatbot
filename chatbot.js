const { Client, LocalAuth, MessageMedia, List, Buttons } = require('whatsapp-web.js');
const express = require('express');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal'); // Importar a biblioteca de QR Code





// Variáveis de estado
let isAuthenticated = false;
let client;

// Função assíncrona para iniciar o Playwright e o cliente do WhatsApp

    client = new Client({
        authStrategy: new LocalAuth({ clientId: 'nova-sessao' }),
        puppeteer: {
            executablePath:'/usr/bin/google-chrome',
            headless: true,
           // executablePath:'/usr/bin/google-chrome',
            args: ['--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu']
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
    
    client.on('disconnected', (reason) => {
        console.log('[INFO] Cliente desconectado:', reason);
        if (browser) {
            console.log('[INFO] Fechando o navegador...');
            browser.close();
        }
    });



    // Inicializar cliente
    client.initialize();
    console.log('[INFO] Inicialização concluída.');

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
    numero=msg.from;
    array=Array.from(numero);
    digito_1=array[2];
    digito_2=array[3];
    valido=false;
for(i of array){

    if(digito_1=="2"&& digito_2=="1"){

        valido=true;

    }else if(digito_1=="3"&&digito_2=="1"){

        valido=true;
    
    }
}

	try{
		// Menu principal
		if (msg.body.match(/(Olá! Tenho interesse e queria mais informações, por favor)/i) && msg.from.endsWith('@c.us')) {

			//Captura a mensagem enviada pelo cliente
			const chat = await msg.getChat();
			
			//Mensagem inicial
									// Delay de 3 segundo
			msg.react('👍');
            await delay(2000);
			await chat.sendStateRecording(); 			// Simulando Digitação
			await delay(25000);						// Delay de 20 segundos
			const audio_1 = MessageMedia.fromFilePath('./audios/audio1.ogg');
			await client.sendMessage(msg.from,audio_1,{sendAudioAsVoice: true} ); 
			await chat.clearState();
              


             //Enviando audio sobre o produto
			await chat.sendStateRecording(); 			// Simulando Digitação
			await delay(20000);						// Delay de 20 segundos
			const audio_2 = MessageMedia.fromFilePath('./audios/audio2.ogg');
			await client.sendMessage(msg.from,audio_2,{sendAudioAsVoice: true} ); 
			await chat.clearState();

            
            await chat.sendStateRecording(); 			// Simulando Digitação
			await delay(18000);						// Delay de 20 segundos
			const audio_3 = MessageMedia.fromFilePath('./audios/audio3.ogg');
			await client.sendMessage(msg.from,audio_3,{sendAudioAsVoice: true} ); 
			await chat.clearState();
			// Enviando video
			const modoUso= MessageMedia.fromFilePath('./videos/como_usar.mp4')
			await delay(5000);
			await client.sendMessage(msg.from,modoUso);
            //Enviando outro audio
            await chat.sendStateRecording(); 			// Simulando Digitação
			await delay(18000);						// Delay de 20 segundos
			const audio_4 = MessageMedia.fromFilePath('./audios/audio4.ogg');
			await client.sendMessage(msg.from,audio_4,{sendAudioAsVoice: true} ); 
			await chat.clearState();

            //Enviando mais um audio
            await chat.sendStateRecording(); 			// Simulando Digitação
			await delay(18000);						// Delay de 20 segundos
			const audio_5 = MessageMedia.fromFilePath('./audios/audio5.ogg');
			await client.sendMessage(msg.from,audio_5,{sendAudioAsVoice: true} ); 
			await chat.clearState();
            //Enviando texto
            await chat.sendStateTyping();
            await delay(60000);
            await client.sendMessage(msg.from,'Olha esses resultados que minhas clientes me enviaram essa semana 😍👇🏾')
            await chat.clearState();
             // Enviando foto
			 foto=MessageMedia.fromFilePath('./images/WhatsApp Image 2025-02-01 at 00.29.39.jpeg');
			 await client.sendMessage(msg.from,foto);

             foto2=MessageMedia.fromFilePath('./images/WhatsApp Image 2025-02-01 at 00.29.39 (1).jpeg');
			 await client.sendMessage(msg.from,foto2);

             foto3=MessageMedia.fromFilePath('./images/WhatsApp Image 2025-02-01 at 00.29.38.jpeg');
			 await client.sendMessage(msg.from,foto3);

             foto4=MessageMedia.fromFilePath('./images/liso.jpeg');
			 await client.sendMessage(msg.from,foto4);
             //Enviando audios
             await chat.sendStateRecording(); 			// Simulando Digitação
			await delay(18000);						// Delay de 20 segundos
			const audio_6 = MessageMedia.fromFilePath('./audios/audio6.ogg');
			await client.sendMessage(msg.from,audio_6,{sendAudioAsVoice: true} );
            if(valido){ 
			 //Texto
			   await chat.sendStateTyping();
			   await delay(8000);
			   await client.sendMessage(msg.from,'😱 PROGRESSIVA HAVANA SEM FORMOL (10 aplicações) de R$ 197,00 por apenas R$ 150,00🤑 COM ENTREGA TOTALMENTE GRATIS 🏍️');
              
              //Enviando audios
             await chat.sendStateRecording(); 			// Simulando Digitação
             await delay(18000);						// Delay de 20 segundos
             const audio_7 = MessageMedia.fromFilePath('./audios/audio7.ogg');
             await client.sendMessage(msg.from,audio_7,{sendAudioAsVoice: true} ); 

              //Texto
			   await chat.sendStateTyping();
			   await delay(8000);
			   await client.sendMessage(msg.from,'⚠️⚠️⚠️ ou 2 UNIDADES POR APENAS R$197,00 ⚠️⚠️⚠️');
               await client.sendMessage(msg.from,'Então? Podemos fechar seu pedido?😊');
               
             
            }else{
                await chat.sendStateRecording();
				await delay(8000);
                audio8=MessageMedia.fromFilePath('./audios/audio8-correios.ogg')
                await client.sendMessage(msg.from,audio8);
                await delay(15000);
                await client.sendMessage(msg.from,'CNPJ caso queira consultar:\n25351.324520/2021-99');
                vid1= MessageMedia.fromFilePath('./videos/vid1.mp4');
                await delay(12000);
                await client.sendMessage(msg.from,vid1);
                vid2=MessageMedia.fromFilePath('./videos/vid2.mp4');
                await delay(12000);
                await client.sendMessage(msg.from,vid2);
                await chat.sendStateTyping();
                await delay(12000);
                await client.sendMessage(msg.from,'Nosso estoque nos correios👆🏼');
                await delay(15000);
                await client.sendMessage(msg.from,'PROGRESSIVA HAVANA SEM FORMOL 😱 de: R$197,00 por apenas R$170,00 COM ENTREGA TOTALMENTE GRATIS EM 7 dias🚛\nFormas de pagamento: *PIX, BOLETO BANCÁRIO OU LINK PARA CARTÃO DE CREDITO EM ATE 12x* 💵\n Qual seria a melhor forma de pagamento para você?');
                await client.sendMessage(msg.from,'Então? Podemos fechar seu pedido?😊');
                
            }
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
