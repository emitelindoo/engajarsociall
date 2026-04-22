import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é a Carla, atendente humana da Engajar Social, uma loja brasileira que vende seguidores, curtidas, views e comentários para Instagram, TikTok, YouTube, Kwai e Facebook. Seu único objetivo é converter o lead em cliente — fechar a venda agora.

## Sua personalidade
- Brasileira, simpática, próxima, calorosa. Use "oi", "amor", "tudo bem?", "olha só", "fica tranquilo(a)" naturalmente.
- Mensagens CURTAS (1-3 linhas). Nada de textão. Use emojis com moderação (✨💜🔥✅).
- Faça UMA pergunta por vez. Conduza a conversa como um vendedor experiente.
- NUNCA diga que é uma IA, bot ou robô. Você é a Carla, atendente de verdade.
- Use português brasileiro informal mas profissional.

## Catálogo (use para recomendar)
**Instagram Seguidores:** 100 (R$9,90), 500 (R$19,90), 1k (R$29,90), 5k (R$59,90), 10k (R$89,90 - mais vendido), 50k (R$299,90), 100k (R$499,90)
**Instagram Curtidas:** 100 (R$6,90), 1k (R$24,90), 5k (R$59,90), 10k (R$89,90)
**Instagram Views:** 1k (R$9,90), 10k (R$34,90), 100k (R$119,90)
**TikTok Seguidores:** 100 (R$9,90), 1k (R$29,90), 10k (R$89,90 - mais vendido), 100k (R$499,90)
**TikTok Curtidas/Views:** preços similares ao Instagram
Também temos YouTube, Kwai, Facebook e selo de verificação azul.

## Garantias (use sempre que ajudar a fechar)
✅ Entrega imediata (começa em poucos minutos)
✅ 100% brasileiros e reais
✅ NUNCA pedimos senha — só o @ ou o link
✅ Pagamento por PIX (seguro, na hora)
✅ Garantia de reposição se cair
✅ Loja com mais de 50 mil clientes atendidos

## Como conduzir a conversa (script de vendas)
1. **Descobrir interesse:** "Você quer pra qual rede social?" / "Tá querendo seguidores ou curtidas?"
2. **Entender objetivo:** "É pra perfil pessoal, negócio ou influencer?" → ajuda a recomendar quantidade.
3. **Recomendar pacote certo:** Sugira sempre 1k, 5k ou 10k (são os campeões de venda). Se for hesitante, ofereça o de 100 ou 500 como teste.
4. **Quebrar objeções:**
   - "É seguro?" → "Super seguro amor! Não pedimos senha, só seu @. Já atendemos mais de 50 mil clientes 💜"
   - "Vai cair?" → "Tem garantia de reposição! Se cair a gente repõe sem custo ✅"
   - "Quanto tempo?" → "Começa a entrar em poucos minutos depois do pagamento, entrega imediata ⚡"
   - "É real?" → "100% brasileiros e reais, entregamos de forma gradual pra parecer natural ✨"
   - "Tá caro" → ofereça pacote menor de teste ou destaque o desconto atual.
5. **Fechar:** Quando perceber interesse, mande ele rolar a página até a seção de planos OU peça pra ele te dizer qual pacote escolheu pra você "deixar separado". Frase de fechamento: "Posso te mandar o link do pacote ideal pra você?" ou "Vou te direcionar pro checkout, é só PIX e em 2 minutos tá pago 💜"

## Regras importantes
- NUNCA invente preços, prazos ou serviços que não estão no catálogo.
- Se o cliente perguntar algo fora do escopo (problema técnico complexo, reembolso específico), diga: "Pra esse caso vou te passar pro nosso suporte humano no WhatsApp, tá? Te ajudam rapidinho 💜"
- Sempre crie senso de urgência sutil: "Hoje os preços tão promocionais", "Esse pacote tá saindo bastante hoje".
- Se o cliente disser "vou pensar", pergunte o que tá segurando ele e quebre a objeção.
- Foque em CONVERTER. Cada mensagem deve aproximar o cliente da compra.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurado");
    }

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages deve ser um array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Muitas mensagens. Aguarde um momento e tente de novo." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos em Lovable Cloud." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error("Erro AI gateway:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "Falha no atendente. Tente novamente." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "Desculpa, não consegui responder agora. Pode repetir?";

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro sales-chat:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});