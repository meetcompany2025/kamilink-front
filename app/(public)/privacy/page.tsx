import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a página inicial
        </Link>
        <h1 className="text-3xl font-bold mt-4">Política de Privacidade</h1>
        <p className="text-muted-foreground">Última atualização: 01 de Janeiro de 2023</p>
      </div>

      <div className="prose prose-slate max-w-none">
        <p>
          A KamiLink está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos,
          usamos, divulgamos e protegemos suas informações pessoais quando você usa nossa plataforma.
        </p>

        <h2>1. Informações que Coletamos</h2>
        <p>
          <strong>1.1. Informações de Cadastro:</strong> Nome, endereço de e-mail, número de telefone, endereço, dados
          da empresa (se aplicável).
          <br />
          <strong>1.2. Informações de Pagamento:</strong> Dados de cartão de crédito, informações bancárias.
          <br />
          <strong>1.3. Informações de Localização:</strong> Dados de GPS, endereços de origem e destino.
          <br />
          <strong>1.4. Informações de Uso:</strong> Como você interage com nossa plataforma, preferências, histórico de
          fretes.
          <br />
          <strong>1.5. Informações do Dispositivo:</strong> Tipo de dispositivo, sistema operacional, endereço IP.
        </p>

        <h2>2. Como Usamos Suas Informações</h2>
        <p>
          <strong>2.1. Fornecer Serviços:</strong> Conectar clientes a transportadores, processar pagamentos, rastrear
          fretes.
          <br />
          <strong>2.2. Melhorar a Plataforma:</strong> Analisar o uso da plataforma, desenvolver novos recursos.
          <br />
          <strong>2.3. Comunicação:</strong> Enviar notificações sobre fretes, atualizações da plataforma, suporte ao
          cliente.
          <br />
          <strong>2.4. Marketing:</strong> Enviar informações sobre promoções, novos serviços (você pode optar por não
          receber).
          <br />
          <strong>2.5. Segurança:</strong> Proteger a plataforma contra fraudes e atividades maliciosas.
        </p>

        <h2>3. Compartilhamento de Informações</h2>
        <p>
          <strong>3.1. Entre Usuários:</strong> Compartilhamos informações necessárias entre clientes e transportadores
          para facilitar os serviços de transporte.
          <br />
          <strong>3.2. Prestadores de Serviços:</strong> Compartilhamos informações com prestadores de serviços que nos
          ajudam a operar a plataforma (processadores de pagamento, serviços de hospedagem).
          <br />
          <strong>3.3. Requisitos Legais:</strong> Podemos divulgar informações quando exigido por lei ou para proteger
          nossos direitos.
        </p>

        <h2>4. Segurança de Dados</h2>
        <p>
          4.1. Implementamos medidas técnicas e organizacionais para proteger suas informações contra acesso não
          autorizado, alteração, divulgação ou destruição.
          <br />
          4.2. Nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro, mas nos esforçamos
          para usar meios comercialmente aceitáveis para proteger suas informações pessoais.
        </p>

        <h2>5. Seus Direitos</h2>
        <p>
          <strong>5.1. Acesso:</strong> Você pode solicitar acesso às suas informações pessoais que coletamos.
          <br />
          <strong>5.2. Correção:</strong> Você pode solicitar a correção de informações imprecisas ou incompletas.
          <br />
          <strong>5.3. Exclusão:</strong> Você pode solicitar a exclusão de suas informações pessoais em determinadas
          circunstâncias.
          <br />
          <strong>5.4. Restrição:</strong> Você pode solicitar a restrição do processamento de suas informações
          pessoais.
          <br />
          <strong>5.5. Portabilidade:</strong> Você pode solicitar a transferência de suas informações pessoais para
          outro serviço.
        </p>

        <h2>6. Cookies e Tecnologias Semelhantes</h2>
        <p>
          6.1. Usamos cookies e tecnologias semelhantes para melhorar sua experiência, entender como você usa nossa
          plataforma e personalizar nossos serviços.
          <br />
          6.2. Você pode configurar seu navegador para recusar todos os cookies ou para indicar quando um cookie está
          sendo enviado. No entanto, alguns recursos da plataforma podem não funcionar corretamente sem cookies.
        </p>

        <h2>7. Retenção de Dados</h2>
        <p>
          7.1. Mantemos suas informações pessoais pelo tempo necessário para fornecer os serviços solicitados e cumprir
          nossas obrigações legais.
          <br />
          7.2. Quando não precisarmos mais de suas informações pessoais, as excluiremos ou anonimizaremos.
        </p>

        <h2>8. Crianças</h2>
        <p>
          8.1. Nossa plataforma não se destina a crianças menores de 18 anos.
          <br />
          8.2. Não coletamos intencionalmente informações pessoais de crianças menores de 18 anos. Se você acredita que
          coletamos informações de uma criança, entre em contato conosco imediatamente.
        </p>

        <h2>9. Alterações nesta Política</h2>
        <p>
          9.1. Podemos atualizar esta Política de Privacidade periodicamente.
          <br />
          9.2. Notificaremos você sobre alterações significativas publicando a nova Política de Privacidade em nossa
          plataforma ou enviando uma notificação.
        </p>

        <h2>10. Contato</h2>
        <p>
          10.1. Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco em:
          <br />
          Email: privacy@kamilink.co.ao
          <br />
          Endereço: Avenida 4 de Fevereiro, 32, Luanda, Angola
        </p>

        <p className="mt-8">
          Ao usar a plataforma KamiLink, você reconhece que leu, entendeu e concorda com esta Política de Privacidade.
        </p>
      </div>
    </div>
  )
}
