import { AppProvider } from './provider';
import { AppLayout } from '../components/layout/AppLayout';
import { AuthGuard } from '../components/auth/AuthGuard';

/**
 * Root application component
 */
function App() {
  return (
    <AppProvider>
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    </AppProvider>
  );
}

export default App;
