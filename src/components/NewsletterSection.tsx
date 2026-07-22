import { useState, type FormEvent } from 'react';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { newsletterService } from '@/services/newsletter.service';
import type { NormalizedError } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await newsletterService.subscribe(email);
      toast.success(
        result.alreadySubscribed ? 'Você já estava inscrito!' : 'Inscrição realizada com sucesso!',
      );
      setEmail('');
    } catch (error) {
      toast.error((error as NormalizedError).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-xl border bg-card px-6 py-10 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-md border">
          <Mail className="size-6 text-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Newsletter Semanal</h2>
        <p className="text-sm text-muted-foreground">
          Receba os melhores artigos de tecnologia diretamente no seu email. Sem spam, apenas
          conteúdo de qualidade.
        </p>
        <form onSubmit={onSubmit} className="mt-2 flex w-full gap-2">
          <Input
            type="email"
            required
            aria-label="Seu e-mail para a newsletter"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Inscrever'}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground">
          Mais de 10.000 desenvolvedores já recebem nossa newsletter
        </p>
      </div>
    </section>
  );
}
