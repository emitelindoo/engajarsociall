---
name: Chatbot com Atendente IA
description: Chatbot com FAQ inicial e modo atendente IA (Carla) focado em conversão via Lovable AI.
type: feature
---
# Chatbot de Suporte e Vendas

## Estrutura
- **Modo FAQ**: opções pré-definidas (Como funciona, Tempo, Segurança, Senha) com respostas estáticas em `AUTO_REPLIES`.
- **Modo IA (Carla)**: ativado quando o lead clica em "Quero falar com atendente". Libera input de texto livre.

## Backend
- Edge function: `supabase/functions/sales-chat/index.ts`
- Modelo: `google/gemini-2.5-flash` via Lovable AI Gateway
- `verify_jwt = false` em config.toml
- Persona: Carla, atendente humana brasileira, foco em CONVERSÃO
- Conhece catálogo completo (preços, redes), garantias, e script de vendas (descobrir → recomendar → quebrar objeções → fechar)
- NUNCA revela ser IA. Mensagens curtas (1-3 linhas).

## Fallback
- Em caso de erro/rate limit, oferece link do WhatsApp como backup.
- Erros 429 e 402 são tratados e exibidos via toast.
