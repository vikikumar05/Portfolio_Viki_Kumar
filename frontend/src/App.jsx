import Navbar from './components/Navbar';
import Cursor from './components/Cursor';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Pipeline from './sections/Pipeline';
import Background from './components/Background';
import TouchWaterEffect from './components/TouchWaterEffect';
import GithubSection from './sections/GithubSection';
import Contact from './sections/Contact';
import useTheme from './hooks/useTheme';
export default function App() {
  const [theme, toggle] = useTheme();
  return (<>
    <div className="bg" aria-hidden="true" /><Background />
    <TouchWaterEffect />
    <Cursor />
    <Navbar theme={theme} toggle={toggle} />
    <main><Hero /><About /><Projects /><Skills /><Pipeline /><GithubSection /><Contact /></main>
    <Footer />
  </>);
}
