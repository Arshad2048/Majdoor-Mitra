import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../Card/Card';
import Skeleton from './Skeleton';
import bgImg from '../../../assets/auth-bg.png';

const AuthSkeleton = ({ type = 'login' }) => {
    const { t } = useTranslation();
    
    const isRegister = type === 'register';
    const isForgot = type === 'forgot';
    const isUpdate = type === 'update';

    return (
        <div className={isRegister ? "register-page auth-page" : isForgot ? "forgot-password-page auth-page" : isUpdate ? "update-password-page auth-page" : "login-page auth-page"}>
            <img src={bgImg} alt="Background" className="login-bg auth-bg" />
            <div className={isRegister ? "register-container auth-container" : isForgot || isUpdate ? "login-container auth-container" : "login-container auth-container"}>
                <Card 
                    className="auth-card-premium" 
                    style={{ position: isForgot ? 'relative' : 'static' }}
                >
                    {isForgot && (
                        <Skeleton variant="circle" width="40px" height="40px" style={{ position: 'absolute', top: '24px', left: '24px', backgroundColor: '#F0F2F5' }} />
                    )}
                    
                    <div className="auth-header" style={{ textAlign: (isForgot || isUpdate) ? 'center' : 'left' }}>
                        <Skeleton 
                            variant="text" 
                            width={isRegister ? "180px" : isForgot || isUpdate ? "220px" : "160px"} 
                            height="2.2rem" 
                            style={{ marginBottom: '8px', margin: (isForgot || isUpdate) ? '0 auto' : '0' }} 
                        />
                        <Skeleton 
                            variant="text" 
                            width={isRegister ? "280px" : isForgot || isUpdate ? "260px" : "240px"} 
                            height="1.1rem" 
                            style={{ marginBottom: '32px', margin: (isForgot || isUpdate) ? '0 auto' : '0' }} 
                        />
                    </div>
                    
                    <div className="auth-form">
                        {isRegister && (
                            <div className="role-selector" style={{ marginBottom: '24px', backgroundColor: '#F0F2F5', padding: '6px', borderRadius: '12px', display: 'flex', gap: '4px' }}>
                                <Skeleton variant="rect" height="44px" style={{ flex: 1, borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }} />
                                <Skeleton variant="rect" height="44px" style={{ flex: 1, borderRadius: '8px', backgroundColor: 'transparent' }} />
                                <Skeleton variant="rect" height="44px" style={{ flex: 1, borderRadius: '8px', backgroundColor: 'transparent' }} />
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {isRegister ? (
                                <>
                                    <Skeleton variant="rect" width="100%" height="56px" style={{ borderRadius: '12px', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }} />
                                    <Skeleton variant="rect" width="100%" height="56px" style={{ borderRadius: '12px', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }} />
                                    <Skeleton variant="rect" width="100%" height="56px" style={{ borderRadius: '12px', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }} />
                                    <Skeleton variant="rect" width="100%" height="56px" style={{ borderRadius: '12px', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }} />
                                    <Skeleton variant="rect" width="100%" height="56px" style={{ borderRadius: '12px', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }} />
                                    <Skeleton variant="rect" width="100%" height="56px" style={{ borderRadius: '12px', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }} />
                                </>
                            ) : isUpdate ? (
                                <>
                                    <div style={{ marginBottom: '4px' }}>
                                        <Skeleton variant="rect" width="100%" height="56px" style={{ borderRadius: '12px', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0', marginBottom: '12px' }} />
                                        <div style={{ display: 'flex', gap: '4px', padding: '0 4px' }}>
                                            {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="rect" height="4px" style={{ flex: 1, borderRadius: '2px', backgroundColor: '#E2E8F0' }} />)}
                                        </div>
                                    </div>
                                    <Skeleton variant="rect" width="100%" height="56px" style={{ borderRadius: '12px', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }} />
                                </>
                            ) : (
                                <>
                                    <Skeleton variant="rect" width="100%" height="56px" style={{ borderRadius: '12px', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }} />
                                    <Skeleton variant="rect" width="100%" height="56px" style={{ borderRadius: '12px', backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }} />
                                </>
                            )}
                            
                            {!isRegister && !isForgot && !isUpdate && (
                                <div className="auth-remember-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-8px', marginBottom: '8px' }}>
                                    <Skeleton variant="text" width="120px" height="1rem" />
                                    <Skeleton variant="text" width="100px" height="1rem" />
                                </div>
                            )}

                            <Skeleton variant="rect" width="100%" height="56px" style={{ borderRadius: '12px', marginTop: isRegister ? '12px' : '10px', backgroundColor: '#1A3B2A', opacity: 0.6 }} />
                        </div>
                    </div>

                    {!isRegister && (
                        <div className="auth-switch" style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
                            <Skeleton variant="text" width="200px" height="1.1rem" />
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default AuthSkeleton;
