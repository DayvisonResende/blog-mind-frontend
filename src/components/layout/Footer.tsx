import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './SocialIcons';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Artigos', to: '/artigos' },
  { label: 'Dashboard', to: '/dashboard' },
];

const socials = [
  { label: 'LinkedIn', icon: LinkedinIcon, href: 'https://linkedin.com' },
  { label: 'GitHub', icon: GithubIcon, href: 'https://github.com' },
  { label: 'Twitter', icon: TwitterIcon, href: 'https://twitter.com' },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Seu portal de tecnologia com artigos, tutoriais e novidades do mundo tech.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Navegacao</h3>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Redes Sociais</h3>
          <div className="flex gap-3">
            {socials.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © 2025 TechBlog. Todos os direitos reservados.
      </div>
    </footer>
  );
}
