# Gerador de Documentação Online

O intuito desse conjunto de aplicação é resolver as necessidades da criação de um padrão de documentação escrita em **Asciidoc**.

## Ferramentas utilizadas
Nessa aplicação a linguagem utilizada foi o JavaScript com algumas bibliotecas para o funcionamento e disparo de requisições e tratamento de resposta.

**É necessário que o host do servidor possua o ASCIIDOCTOR instalado.**

| Servidor | Bibliotecas  |
|----------|--|
| Node.JS  | Express |
|          | ADM-Zip|
|          | Asciidoctor|
|          | html-pdf|
|          | multer|
|          | shelljs|

Para o site foi utilizada a mesma linguagem com as seguintes bibliotecas:

|Bibliotecas|  
|--|
| React.JS |
|Axios|


## Funcionamento
A API consiste em disparar uma requisição HTTP:POST para o endereço que a API está rodando pela rota `/file`, o conteúdo necessário para que a API não dê erro é um diretório compactado que siga uma estrutura definida:

- Obrigatório: *index.adoc*
- Todo o resto é opcional  e varia de como foi criado o seu documento

Após enviada a requisição, se um arquivo *index.adoc* for localizado, a API começará a tratar o documento utilizando o tema e fontes pré-instalados no pacote da aplicação. (Você pode encontrar os recursos dentro da pasta resources)

## Executar

Para executar a api, primeiro faça a instalação das dependencias com ```npm install``` e em seguida rode ```npm start```. Caso queira utilizar o modo de desenvolvedor, utilize ```npm run dev```
