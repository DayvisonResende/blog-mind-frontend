import { useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, Mail, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { profileSchema, type ProfileForm } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
import type { NormalizedError } from '@/services/api';
import { resolveImageUrl } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR');
}

export function SettingsPage() {
  const { user, updateUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    resolveImageUrl(user?.avatar ?? null),
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      bio: user?.bio ?? '',
    },
  });

  const bio = useWatch({ control, name: 'bio' }) ?? '';

  const onAvatarPick = (file: File | null) => {
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: ProfileForm) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('bio', data.bio);
      if (avatarFile) formData.append('avatar', avatarFile);

      const updated = await authService.updateProfile(formData);
      updateUser(updated);
      setAvatarFile(null);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error((error as NormalizedError).message);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        to="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar ao Dashboard
      </Link>

      <h1 className="text-3xl font-bold">Configurações do Perfil</h1>
      <p className="mb-8 text-muted-foreground">Gerencie suas informações pessoais</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border bg-card p-6">
        <div className="flex flex-col items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => onAvatarPick(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Alterar foto de perfil"
            className="group relative rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Avatar className="size-24">
              <AvatarImage src={avatarPreview} alt={user.name} />
              <AvatarFallback className="text-xl">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <Camera className="size-6 text-white" />
            </span>
          </button>
          <div className="text-center">
            <p className="text-sm font-medium">Foto de Perfil</p>
            <p className="text-xs text-muted-foreground">Clique na foto para alterar</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <UserIcon className="size-4" /> Nome Completo
          </Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="size-4" /> Email
          </Label>
          <Input id="email" value={user.email} disabled readOnly />
          <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" rows={4} {...register('bio')} />
          <div className="flex justify-between text-xs text-muted-foreground">
            {errors.bio ? (
              <span className="text-destructive">{errors.bio.message}</span>
            ) : (
              <span />
            )}
            <span>{bio.length}/500 caracteres</span>
          </div>
        </div>

        <div className="space-y-3 border-t pt-4">
          <h3 className="text-sm font-semibold">Informações da conta</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Tipo de conta</p>
              <p className="font-medium capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Membro desde</p>
              <p className="font-medium">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </form>
    </div>
  );
}
