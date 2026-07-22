import { useEffect, useState, type KeyboardEvent } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { toast } from 'sonner';
import { articleSchema, type ArticleForm } from '@/lib/validations/article';
import { articleService } from '@/services/article.service';
import type { NormalizedError } from '@/services/api';
import { useAsync } from '@/hooks/useAsync';
import { calculateReadingTime, countWords } from '@/lib/reading';
import { resolveImageUrl } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FullScreenLoader } from '@/components/common/Loader';

const MAX_CONTENT = 8000;
const MAX_SUMMARY = 120;

export function ArticleFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | undefined>();
  const [loadingArticle, setLoadingArticle] = useState(isEdit);

  const { data: categories } = useAsync(() => articleService.categories(), []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: { title: '', summary: '', category: '', content: '' },
  });

  const content = useWatch({ control, name: 'content' }) ?? '';
  const summary = useWatch({ control, name: 'summary' }) ?? '';

  // Modo edicao: carrega o artigo e preenche o formulario.
  useEffect(() => {
    if (!id) return;
    let active = true;
    articleService
      .getById(id)
      .then((article) => {
        if (!active) return;
        reset({
          title: article.title,
          summary: article.summary,
          category: article.category,
          content: article.content,
        });
        setTags(article.tags);
        setCoverPreview(resolveImageUrl(article.coverImage));
      })
      .catch((e) => toast.error((e as NormalizedError).message))
      .finally(() => active && setLoadingArticle(false));
    return () => {
      active = false;
    };
  }, [id, reset]);

  const addTag = () => {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setTags((prev) => [...prev, value]);
    }
    setTagInput('');
  };

  const onTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const onCoverChange = (file: File | null) => {
    setCoverFile(file);
    setCoverPreview(file ? URL.createObjectURL(file) : undefined);
  };

  const onSubmit = async (data: ArticleForm) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('summary', data.summary);
    formData.append('category', data.category);
    formData.append('content', data.content);
    formData.append('tags', tags.join(','));
    if (coverFile) formData.append('coverImage', coverFile);

    try {
      const article = isEdit
        ? await articleService.update(id!, formData)
        : await articleService.create(formData);
      toast.success(isEdit ? 'Artigo atualizado!' : 'Artigo publicado!');
      navigate(`/artigos/${article.id}`);
    } catch (e) {
      toast.error((e as NormalizedError).message);
    }
  };

  if (loadingArticle) return <FullScreenLoader />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        to="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar ao Dashboard
      </Link>

      <h1 className="text-3xl font-bold">{isEdit ? 'Editar Artigo' : 'Criar Novo Artigo'}</h1>
      <p className="mb-8 text-muted-foreground">
        {isEdit
          ? 'Atualize as informações do seu artigo'
          : 'Compartilhe seu conhecimento com a comunidade'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border bg-card p-6" noValidate>
        {/* Titulo */}
        <div className="space-y-2">
          <Label htmlFor="title">Título do Artigo *</Label>
          <Input id="title" {...register('title')} />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        {/* Resumo */}
        <div className="space-y-2">
          <Label htmlFor="summary">Resumo *</Label>
          <Textarea id="summary" rows={2} maxLength={MAX_SUMMARY} {...register('summary')} />
          <div className="flex justify-between text-xs text-muted-foreground">
            {errors.summary ? (
              <span className="text-destructive">{errors.summary.message}</span>
            ) : (
              <span />
            )}
            <span>
              {summary.length}/{MAX_SUMMARY} caracteres
            </span>
          </div>
        </div>

        {/* Categoria */}
        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
        </div>

        {/* Imagem de capa */}
        <div className="space-y-2">
          <Label htmlFor="cover">Imagem de Capa</Label>
          <Input
            id="cover"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => onCoverChange(e.target.files?.[0] ?? null)}
          />
          {coverPreview && (
            <img
              src={coverPreview}
              alt="Previa da capa"
              className="mt-2 aspect-video w-full rounded-md object-cover"
            />
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onTagKeyDown}
              placeholder="Adicione uma tag e pressione Enter"
            />
            <Button type="button" variant="outline" onClick={addTag}>
              Adicionar
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                    aria-label={`Remover ${tag}`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Conteudo */}
        <div className="space-y-2">
          <Label htmlFor="content">Conteúdo do Artigo *</Label>
          <Textarea id="content" rows={14} maxLength={MAX_CONTENT} className="font-mono text-sm" {...register('content')} />
          <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
            {errors.content ? (
              <span className="text-destructive">{errors.content.message}</span>
            ) : (
              <span />
            )}
            <span>
              {content.length}/{MAX_CONTENT} caracteres • {countWords(content)} palavras •{' '}
              {calculateReadingTime(content)} minutos de leitura
            </span>
          </div>
        </div>

        {/* Acoes */}
        <div className="flex justify-start gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Publicar Artigo'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
