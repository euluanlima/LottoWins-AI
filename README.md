# LottoWins AI - Aplicativo de Previsão e Resultados de Loteria

Este é um aplicativo Next.js que fornece previsões de números (Smart Pick) e informações sobre loterias populares dos EUA como Powerball, Mega Millions e Cash4Life.

## Funcionalidades

*   **Seleção de Loteria:** Página inicial para selecionar a loteria desejada.
*   **Previsões (Smart Pick):** Gera números da sorte com base em um algoritmo (atualmente simulado).
*   **Resultados:** Exibe os últimos resultados sorteados. **(Nota: Atualmente falha ao buscar dados reais da API externa e usa dados de exemplo como fallback).**
*   **Frequência:** Mostra a frequência com que os números foram sorteados (calculado com base nos dados de resultados disponíveis - reais ou de exemplo).
*   **Verificador:** Permite ao usuário inserir números para verificar se correspondem a algum sorteio anterior (comparado com os dados de resultados disponíveis - reais ou de exemplo).
*   **Prêmios:** Exibe a estrutura de premiação de cada loteria **(Nota: Usa dados de exemplo, pois a API externa não fornece essa informação).**
*   **Temas:** Suporte a temas claro e escuro.
*   **Responsivo:** Design adaptado para desktop e mobile.

## Problema Conhecido: Falha na API Externa

Durante o desenvolvimento, a integração com a API externa `api.lotteryresultsapi.com` para buscar os resultados reais dos sorteios apresentou problemas persistentes ("Failed to fetch"). Apesar de várias tentativas de correção, a causa raiz não pôde ser determinada no ambiente de desenvolvimento.

Como resultado, as abas "Resultados", "Frequência" e "Verificador" estão configuradas para usar **dados de exemplo (mock data)** como fallback quando a API falha. A aba "Prêmios" usa dados de exemplo por design.

**Sugestão:** Investigue a causa da falha na API (`Failed to fetch`) no seu ambiente local ou no ambiente de deploy da Vercel. Verifique:
*   A validade e o status do token da API (`API_TOKEN` no arquivo `src/app/api/lottery-results/[lotteryTag]/route.ts`).
*   Possíveis problemas de rede ou CORS no ambiente de deploy.
*   Logs da função da Vercel que executa a rota `/api/lottery-results/...` para obter mais detalhes sobre o erro.
*   A documentação ou o status da API `lotteryresultsapi.com`.

## Configuração do Projeto

1.  **Clone o Repositório:**
    ```bash
    git clone <url-do-seu-repositorio-github>
    cd lotto-cash-app
    ```
2.  **Instale as Dependências:** É recomendado usar `pnpm`, mas `npm` também funciona (pode ser necessário usar a flag `--legacy-peer-deps` devido a conflitos de versão entre React 19 e algumas dependências).
    ```bash
    # Usando pnpm (recomendado)
    pnpm install

    # Ou usando npm
    npm install --legacy-peer-deps
    ```
3.  **Token da API (Opcional, para tentar dados reais):**
    *   Edite o arquivo `src/app/api/lottery-results/[lotteryTag]/route.ts`.
    *   Substitua o valor da constante `API_TOKEN` pelo seu token válido da `lotteryresultsapi.com`.
    *   **IMPORTANTE:** Para produção, mova o token para variáveis de ambiente (ex: `.env.local` e configure na Vercel) em vez de deixá-lo diretamente no código.

## Executando Localmente

```bash
npm run dev
# ou
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) (ou a porta indicada no terminal) no seu navegador.

## Deploy com GitHub e Vercel

1.  **Crie um Repositório no GitHub:** Crie um novo repositório (público ou privado) na sua conta do GitHub.
2.  **Envie o Código para o GitHub:**
    ```bash
    git init # Se ainda não for um repositório git
    git add .
    git commit -m "Commit inicial do LottoWins AI"
    git branch -M main
    git remote add origin <url-do-seu-repositorio-github>
    git push -u origin main
    ```
3.  **Conecte à Vercel:**
    *   Acesse sua conta na [Vercel](https://vercel.com/).
    *   Clique em "Add New..." -> "Project".
    *   Importe o repositório que você acabou de criar no GitHub.
4.  **Configure o Projeto na Vercel:**
    *   A Vercel geralmente detecta que é um projeto Next.js e configura tudo automaticamente.
    *   **Variáveis de Ambiente:** Se você moveu o `API_TOKEN` para variáveis de ambiente, adicione-o nas configurações do projeto na Vercel (Settings -> Environment Variables). Crie uma variável chamada `API_TOKEN` (ou o nome que você usou no código para `process.env.API_TOKEN`) com o valor do seu token.
5.  **Faça o Deploy:** Clique em "Deploy". A Vercel fará o build e o deploy do seu aplicativo.

Após o deploy, você receberá uma URL pública para acessar seu aplicativo LottoWins AI.

