# Alternativas de Gateways de Pagamento no Brasil

## Contexto

Muitos gateways de pagamento no Brasil apresentam limitações, especialmente para quem busca:
- Ambiente de testes realista (sandbox)
- Liberação fácil de Pix
- Documentação clara
- Suporte eficiente

Abaixo, um comparativo das principais alternativas além de Stripe, MercadoPago e PagBank.

---

## 1. **Pagar.me (Stone)**
- **Prós:**
  - Ambiente de testes completo (sandbox)
  - Pix liberado rapidamente
  - Checkout transparente e customizável
  - Boa documentação e suporte
- **Contras:**
  - Aprovação de conta pode demorar
  - Tarifas podem ser um pouco mais altas para pequenos volumes

---

## 2. **Gerencianet**
- **Prós:**
  - Pix liberado rapidamente
  - API moderna e bem documentada
  - Ambiente de testes (sandbox) funcional
  - Suporte nacional
- **Contras:**
  - Processo de aprovação pode ser burocrático
  - Checkout menos “bonito” que Stripe

---

## 3. **Juno (antiga BoletoBancário)**
- **Prós:**
  - Pix, boleto e cartão
  - Sandbox funcional
  - API bem documentada
- **Contras:**
  - Precisa de aprovação para produção
  - Menos conhecida, mas estável

---

## 4. **Asaas**
- **Prós:**
  - Pix, boleto, cartão, carnê
  - API moderna
  - Sandbox funcional
- **Contras:**
  - Foco maior em cobranças recorrentes, mas funciona para e-commerce

---

## 5. **Wirecard/Moip (PagSeguro)**
- **Prós:**
  - Pix, cartão, boleto
  - API robusta
- **Contras:**
  - Suporte e painel podem ser confusos (herança do PagSeguro)

---

## 6. **PayPal Brasil**
- **Prós:**
  - Checkout confiável, fácil de integrar
  - Aceita cartão e saldo PayPal
- **Contras:**
  - Não tem Pix
  - Tarifas mais altas
  - Checkout não é tão customizável

---

## 7. **PicPay Pro**
- **Prós:**
  - Pix, cartão, saldo PicPay
  - API simples
- **Contras:**
  - Foco maior em pagamentos P2P, mas tem solução para e-commerce

---

## **Resumo prático**

Se você quer:
- **Pix rápido + ambiente de testes:**
  - **Pagar.me, Gerencianet, Juno ou Asaas** são as melhores opções.
- **Checkout internacional, cartão e boleto:**
  - **Stripe** (mas Pix só após aprovação manual).
- **Checkout fácil, mas sem Pix:**
  - **PayPal**.

---

Se quiser um comparativo mais detalhado ou exemplos de integração, consulte a documentação oficial de cada gateway ou peça ajuda ao time técnico. 