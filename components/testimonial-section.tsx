import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { StarIcon } from "lucide-react"

export default function TestimonialSection() {
  return (
    <section className="py-16 px-4 md:px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">O que nossos usuários dizem</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            name="Carlos Silva"
            role="Gerente de Logística, TechCorp"
            image="/placeholder.svg?height=100&width=100"
            rating={5}
            testimonial="A KamiLink transformou nossa logística. Reduzimos custos em 25% e melhoramos a eficiência das entregas. A plataforma é intuitiva e o suporte é excelente."
          />
          <TestimonialCard
            name="Mariana Santos"
            role="Caminhoneira Autônoma"
            image="/placeholder.svg?height=100&width=100"
            rating={5}
            testimonial="Desde que comecei a usar a KamiLink, aumentei minha renda em 30%. Consigo encontrar fretes próximos da minha localização e o pagamento é sempre pontual."
          />
          <TestimonialCard
            name="Roberto Almeida"
            role="Proprietário, Distribuidora Almeida"
            image="/placeholder.svg?height=100&width=100"
            rating={4}
            testimonial="A plataforma nos permitiu expandir nossos negócios para regiões que antes não conseguíamos atender. O rastreamento em tempo real dá tranquilidade aos nossos clientes."
          />
        </div>
      </div>
    </section>
  )
}

interface TestimonialCardProps {
  name: string
  role: string
  image: string
  rating: number
  testimonial: string
}

function TestimonialCard({ name, role, image, rating, testimonial }: TestimonialCardProps) {
  return (
    <Card className="border-none shadow-md dark:bg-slate-800 dark:shadow-slate-900/30">
      <CardContent className="pt-6">
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
            />
          ))}
        </div>
        <p className="mb-6 text-muted-foreground dark:text-gray-400">{testimonial}</p>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={image || "/placeholder.svg"} alt={name} />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground dark:text-gray-400">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
