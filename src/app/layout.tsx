import './globals.css';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import { OnboardingProvider } from '@/context/OnboardingContext';
import OnboardingWidget from '@/components/OnboardingWidget';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Wiki Engenharia MedCof',
  description: 'Portal Interno da Engenharia MedCof',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.variable} font-sans flex min-h-screen bg-background text-foreground overflow-x-hidden relative`}>
        <OnboardingProvider>
          <Sidebar />
          <main className="flex-1 p-8 pb-32 overflow-y-auto w-full">
            <div className="max-w-7xl mx-auto">
              {children}
              <footer className="mt-16 pt-8 pb-12 border-t border-border text-center text-sm text-gray-500">
                MedCof Engenharia | Atualizado continuamente
              </footer>
            </div>
          </main>
          <OnboardingWidget />
        </OnboardingProvider>
      </body>
    </html>
  );
}
