import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { PainPoints } from './components/PainPoints';
import { WaitlistForm } from './components/WaitlistForm';
import { Footer } from './components/Footer';
import AnalyticsPanel from './components/AnalyticsPanel';

function App() {
  return (
    <div className="min-h-screen bg-[#eae6e3]">
      <Header />
      <Hero />
      <WaitlistForm />
      <Features />
      <PainPoints />
      <Footer />
      {/* Dev-only analytics summary panel (renders only in Vite DEV) */}
      <AnalyticsPanel />
    </div>
  );
}

export default App;
