import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import BasePage from './screens/BasePage';
import { DevPanelProvider } from '@local/devpanel';

function PageLayout({ children, activeItem, showBack }: {
  children: React.ReactNode;
  activeItem?: string;
  showBack?: boolean;
}) {
  return (
    <DevPanelProvider>
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-light-base-bg-alt-primary)' }}>
      <Sidebar activeItem={activeItem} />
      <div style={{ marginLeft: 248, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header showBack={showBack} />
        <main style={{ marginTop: 'var(--gap-56)', padding: 'var(--gap-40) 52px var(--gap-64)' }}>
          {children}
        </main>
      </div>
    </div>
    </DevPanelProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/base" element={
          <PageLayout activeItem="">
            <BasePage />
          </PageLayout>
        } />

      </Routes>
    </BrowserRouter>
  );
}

function Index() {
  return (
    <div style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h2>AlfaBank — Screens</h2>
      <ul>
        <li><Link to="/base">Base Page</Link></li>

      </ul>
    </div>
  );
}
