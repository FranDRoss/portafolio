import "@/app/i18n/i18n";
import { HelmetProvider } from 'react-helmet-async';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <HelmetProvider>{children}</HelmetProvider>;
}
