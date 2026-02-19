import { Link } from '../components/custom-shadcn/Link';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-16 text-center flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold mb-4 text-orange-500">404</h1>
        <p className="text-xl mb-4 text-gray-700">{t('notFound.title')}</p>
        <Link to="/" className="text-orange-500 hover:text-orange-600 font-semibold">
          {t('notFound.backHome')}
        </Link>
      </div>
      <Footer />
    </div>
  );
}
