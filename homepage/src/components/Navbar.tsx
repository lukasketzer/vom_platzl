import { Link } from './custom-shadcn/Link';
import { FaGithub } from "react-icons/fa";
import { SiDevpost } from "react-icons/si";
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const languages = [
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
];

function Navbar() {
    const { t, i18n } = useTranslation();
    const [langOpen, setLangOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return(
    <div className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
            <div className='display-flex '>
                <img src="/logo.png" alt="Logo" className="w-8 h-8 inline mr-2" />
                <Link to="/" className="text-xl font-bold hover:text-orange-500">Vom Platzl</Link>
            </div>
            <nav className="space-x-4 flex items-center">
                <Link to="/" className="text-gray-700 hover:text-orange-500">{t('nav.home')}</Link>
                <Link to="/download" className="text-gray-700 hover:text-orange-500">{t('nav.download')}</Link>
                <Link to="/about" className="text-gray-700 hover:text-orange-500">{t('nav.about')}</Link>
                <Link to="https://devpost.com/software/vom-platzl" className="text-gray-700 hover:text-orange-500"><SiDevpost className="w-5 h-5 inline mr-1" /></Link>
                <Link to="https://github.com/davidholzwarth/vom_platzl" className="text-gray-700 hover:text-orange-500"><FaGithub className="w-5 h-5 inline mr-1" /></Link>

                {/* Language dropdown */}
                <div className="relative ml-2" ref={dropdownRef}>
                    <button
                        onClick={() => setLangOpen(!langOpen)}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-sm font-semibold rounded-md border border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-colors cursor-pointer"
                    >
                        <span>{currentLang.flag}</span>
                        <span>{currentLang.code.toUpperCase()}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {langOpen && (
                        <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer ${
                                        i18n.language === lang.code
                                            ? 'bg-orange-50 text-orange-600 font-semibold'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <span>{lang.flag}</span>
                                    <span>{lang.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </nav>
        </div>
    </div>)
}

export default Navbar;