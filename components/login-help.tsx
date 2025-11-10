import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"

export function LoginHelp() {
  return (
    <Card className="p-4 mt-4">
      <h3 className="text-lg font-medium mb-2">Precisa de ajuda para fazer login?</h3>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Não consigo fazer login</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">Se você não consegue fazer login, verifique:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Se o email e senha estão corretos</li>
              <li>Se você confirmou seu email após o registro</li>
              <li>Se o Caps Lock está ativado</li>
              <li>Se você está usando o email correto</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Esqueci minha senha</AccordionTrigger>
          <AccordionContent>
            <p>
              Se você esqueceu sua senha, clique em "Esqueceu a senha?" abaixo do campo de senha e siga as instruções
              para redefinir sua senha.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Não recebi o email de confirmação</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">Se você não recebeu o email de confirmação:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verifique sua pasta de spam ou lixo eletrônico</li>
              <li>Aguarde alguns minutos, pois o email pode demorar para chegar</li>
              <li>Tente se registrar novamente com o mesmo email</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}
