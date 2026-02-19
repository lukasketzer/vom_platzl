import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white py-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3">Vom Platzl</h3>
            {/* <p className="text-gray-400">{t('footer.tagline')}</p> */}
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t('footer.links')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-orange-400">{t('nav.home')}</a></li>
              <li><a href="/download" className="hover:text-orange-400">{t('nav.download')}</a></li>
              <li><a href="/about" className="hover:text-orange-400">{t('nav.about')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t('footer.contact')}</h4>
            <a href="mailto:info@vom-platzl.de" className="text-gray-400 hover:text-orange-400">info@vom-platzl.de</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;