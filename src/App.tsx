import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { PainPoints } from './components/PainPoints';
import { WaitlistForm } from './components/WaitlistForm';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#eae6e3]">
      <Header />
      <Hero />
      <Features />
      <PainPoints />
      <WaitlistForm />
      <Footer />
    </div>
  );
}

export default App;
