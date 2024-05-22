~ O arquivo xs-app.json é um arquivo de configuração usado em aplicativos SAP Cloud Platform XS Advanced para definir como as solicitações HTTP devem ser roteadas para os diferentes serviços ou recursos dentro do aplicativo. Ele é usado principalmente em aplicativos baseados em Node.js ou em serviços de aplicativos na nuvem SAP.

~ Último erro 26/04 18:03
~ View1.controller.js:51 Erro ao chamar a API: TypeError: this.dataNews is not a function
~ atualização 18:05
~ dataNews está faltando e deve ser adicionado da Main.controller.js na View1.controller.js

primeiros erros:
~ noticias como do The Guardian não trazem imagens devido Non-authorized devido falta de assinatura

primeiras questões:
~ o scroll das notícias será apresentado com várias noticias pequenas? várias box como do print?

~ Atualização 27/04 17:34
~ Será necessário mudar a view.xml
~ Utilizar algum VBox, para gerar 3 tipos diferentes de Tiles
~ Durante o .forEach gerar um condicionador de tamanho levando em conta a quantia de notícias
~ Aprender a montar um CSS para isso

~ Atualização 30/04 16:18
~ Mudar a FlexBox view.xml para talvez uma VBox com imagem e text
~ Apontar como no ItelligentClipping view.xml
~ Com isso fica facil montar o .css