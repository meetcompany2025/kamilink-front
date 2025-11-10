import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a página inicial
        </Link>
        <h1 className="text-3xl font-bold mt-4">Termos e Condições</h1>
        <p className="text-muted-foreground">Última atualização: 01 de Janeiro de 2023</p>
      </div>

      <div className="prose prose-slate max-w-none">
        <p>
          Bem-vindo à KamiLink. Estes Termos e Condições regem o uso da plataforma KamiLink, incluindo o site,
          aplicativo móvel e todos os serviços relacionados. Ao acessar ou usar a plataforma KamiLink, você concorda com
          estes termos. Se você não concordar com estes termos, por favor, não use a plataforma.
        </p>

        <h2>1. Definições</h2>
        <p>
          <strong>"KamiLink"</strong> refere-se à plataforma de logística que conecta clientes a transportadores.
          <br />
          <strong>"Usuário"</strong> refere-se a qualquer pessoa que acesse ou use a plataforma KamiLink.
          <br />
          <strong>"Cliente"</strong> refere-se a qualquer pessoa física ou jurídica que solicite serviços de transporte
          através da plataforma.
          <br />
          <strong>"Transportador"</strong> refere-se a qualquer pessoa física ou jurídica que ofereça serviços de
          transporte através da plataforma.
        </p>

        <h2>2. Cadastro e Conta</h2>
        <p>
          2.1. Para usar a plataforma KamiLink, você deve criar uma conta fornecendo informações precisas e completas.
          <br />
          2.2. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades
          que ocorrem em sua conta.
          <br />
          2.3. Você concorda em notificar imediatamente a KamiLink sobre qualquer uso não autorizado de sua conta ou
          qualquer outra violação de segurança.
        </p>

        <h2>3. Serviços</h2>
        <p>
          3.1. A KamiLink oferece uma plataforma que conecta clientes a transportadores para a contratação de serviços
          de transporte de cargas.
          <br />
          3.2. A KamiLink não é uma empresa de transporte e não fornece serviços de transporte diretamente.
          <br />
          3.3. A KamiLink não garante a disponibilidade, qualidade ou adequação dos serviços oferecidos pelos
          transportadores.
        </p>

        <h2>4. Responsabilidades do Cliente</h2>
        <p>
          4.1. O cliente é responsável por fornecer informações precisas e completas sobre a carga a ser transportada.
          <br />
          4.2. O cliente é responsável por garantir que a carga esteja devidamente embalada e pronta para transporte.
          <br />
          4.3. O cliente é responsável por pagar pelos serviços contratados de acordo com os termos acordados.
        </p>

        <h2>5. Responsabilidades do Transportador</h2>
        <p>
          5.1. O transportador é responsável por fornecer informações precisas e completas sobre seus serviços e
          veículos.
          <br />
          5.2. O transportador é responsável por cumprir todas as leis e regulamentos aplicáveis ao transporte de
          cargas.
          <br />
          5.3. O transportador é responsável por transportar a carga de forma segura e eficiente, de acordo com os
          termos acordados.
        </p>

        <h2>6. Pagamentos</h2>
        <p>
          6.1. A KamiLink cobra uma taxa de serviço por cada transação realizada através da plataforma.
          <br />
          6.2. Os preços dos serviços de transporte são definidos pelos transportadores.
          <br />
          6.3. Os pagamentos são processados através da plataforma KamiLink e estão sujeitos aos termos e condições do
          processador de pagamentos.
        </p>

        <h2>7. Cancelamentos e Reembolsos</h2>
        <p>
          7.1. As políticas de cancelamento e reembolso variam de acordo com o transportador e o tipo de serviço.
          <br />
          7.2. Em caso de cancelamento, a KamiLink pode reter a taxa de serviço.
        </p>

        <h2>8. Limitação de Responsabilidade</h2>
        <p>
          8.1. A KamiLink não é responsável por quaisquer danos diretos, indiretos, incidentais, especiais ou
          consequenciais resultantes do uso ou da incapacidade de usar a plataforma.
          <br />
          8.2. A KamiLink não é responsável por quaisquer danos ou perdas resultantes de transações entre clientes e
          transportadores.
        </p>

        <h2>9. Alterações nos Termos</h2>
        <p>
          9.1. A KamiLink reserva-se o direito de modificar estes Termos e Condições a qualquer momento.
          <br />
          9.2. As alterações entrarão em vigor imediatamente após a publicação dos termos atualizados na plataforma.
          <br />
          9.3. O uso continuado da plataforma após a publicação das alterações constitui aceitação dos novos termos.
        </p>

        <h2>10. Lei Aplicável</h2>
        <p>
          10.1. Estes Termos e Condições são regidos pelas leis de Angola.
          <br />
          10.2. Qualquer disputa relacionada a estes termos será resolvida pelos tribunais de Angola.
        </p>

        <p className="mt-8">
          Ao usar a plataforma KamiLink, você reconhece que leu, entendeu e concorda com estes Termos e Condições.
        </p>
      </div>
    </div>
  )
}
