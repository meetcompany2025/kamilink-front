import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { ReviewService } from "@/services/reviewService";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Star } from "lucide-react";
import { StarRating } from "./StarRatingProps";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

// Componente de Formulário de Avaliação
interface ReviewFormProps {
  freightId: string;
  onReviewSubmitted: () => void;
}

export const ReviewForm = ({ freightId, onReviewSubmitted }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Atenção",
        description: "Por favor, selecione uma avaliação com as estrelas.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      await ReviewService.create({
        freightId,
        rating,
        comment: comment.trim() || undefined,
      });

      toast({
        title: "Avaliação enviada!",
        description: "Sua avaliação foi registrada com sucesso.",
      });

      setRating(0);
      setComment('');
      onReviewSubmitted();
      
    } catch (error: any) {
      console.error('Erro ao enviar avaliação:', error);
      
      let errorMessage = "Erro ao enviar avaliação. Tente novamente.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Avaliar Serviço
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Como foi sua experiência?
          </label>
          <StarRating 
            rating={rating} 
            onRatingChange={setRating}
            size="lg"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Comentário (opcional)
          </label>
          <Textarea
            placeholder="Conte-nos mais sobre sua experiência com este frete..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || rating === 0}
          className="w-full"
        >
          {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
        </Button>
      </CardContent>
    </Card>
  );
};