import { useEffect, useState } from 'react';
import { fetchRecentThreads } from '../../services/threadService.js';
import ThreadPage from './ThreadPage.jsx';
import ThreadList from '../../components/ThreadList/ThreadList.jsx';
import { Card, Container } from 'react-bootstrap';
import './Home.css';

export default function Home() {
  const [recentThreads, setRecentThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchRecentThreads()
      .then((threads) => {
        if (!cancelled) {
          setRecentThreads(threads);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Failed to load recent threads:', error);
          setLoadError(
            'Unable to load recent threads. Please try again later.',
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (selectedThread) {
    return (
      <ThreadPage
        thread={selectedThread}
        goBack={() => setSelectedThread(null)}
      />
    );
  }

  return (
    <Container className="home-container">
      <Card className="home-card shadow-lg border-0 rounded-4 p-4">
        <h1 className="home-title mb-4 display-6 fw-semibold border-bottom pb-2">
          🧵 Recent Threads
        </h1>
        {loadError ? (
          <Card.Text role="alert">{loadError}</Card.Text>
        ) : (
          <ThreadList threads={recentThreads} onSelect={setSelectedThread} />
        )}
      </Card>
    </Container>
  );
}
