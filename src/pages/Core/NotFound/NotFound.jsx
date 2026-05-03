import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';
import NotFoundSkeleton from '../../../components/ui/Skeleton/NotFoundSkeleton';

import gif404 from '../../../assets/not-found-glitch.gif';
import './NotFound.css';


const NotFound = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 450);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <NotFoundSkeleton />;

    return (
        <div className="notfound-wrapper core-fade-in">
            <div className="notfound-bg-text">404</div>
            
            <div className="notfound-content">
                <h1 className="notfound-title text-focus-in">
                    {t('notFound.creativeTitle') || "You've Lost Your Way"}
                </h1>
                
                <p className="notfound-description">
                    {t('notFound.creativeDesc') || "The page you're looking for has vanished into the digital void. Let's get you back to familiar ground."}
                </p>
                
                <div className="notfound-buttons">
                    <Link to="/" className="btn-404 btn-primary-404">
                        <Home size={20} style={{ marginRight: '10px' }} />
                        {t('notFound.backHome') || 'Take Me Home'}
                    </Link>
                    
                    <button 
                        onClick={() => window.history.back()} 
                        className="btn-404 btn-secondary-404"
                    >
                        <ArrowLeft size={20} style={{ marginRight: '10px' }} />
                        {t('notFound.goBack') || 'Go Back'}
                    </button>
                </div>
            </div>

            <div className="notfound-visual scale-up-center">
                <img src={gif404} alt="404 Illustration" className="notfound-gif" />
            </div>
        </div>
    );
};

export default NotFound;
