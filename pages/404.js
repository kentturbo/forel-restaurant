// pages/404.js
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Страница не найдена</h2>
          <p className="text-gray-600 mb-8">
            К сожалению, запрашиваемая страница не существует.
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;