import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDreamStore } from '@/store/dreamStore';
import { Layout } from '@/components/Layout';
import Home from '@/pages/Home';
import RecordDream from '@/pages/RecordDream';
import DreamList from '@/pages/DreamList';
import Visualize from '@/pages/Visualize';
import SeriesList from '@/pages/SeriesList';
import SeriesDetail from '@/pages/SeriesDetail';
import RandomReverie from '@/pages/RandomReverie';
import Export from '@/pages/Export';

export default function App() {
  const { initializeData, isInitialized } = useDreamStore();

  useEffect(() => {
    if (!isInitialized) {
      initializeData();
    }
  }, [isInitialized, initializeData]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-dream-primary to-dream-secondary flex items-center justify-center animate-pulse">
            <span className="text-3xl">🌙</span>
          </div>
          <p className="text-white/60">正在进入梦境世界...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/record" element={<RecordDream />} />
          <Route path="/record/:id" element={<RecordDream />} />
          <Route path="/dreams" element={<DreamList />} />
          <Route path="/visualize" element={<Visualize />} />
          <Route path="/series" element={<SeriesList />} />
          <Route path="/series/:id" element={<SeriesDetail />} />
          <Route path="/reverie" element={<RandomReverie />} />
          <Route path="/export" element={<Export />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
}
