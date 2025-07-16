import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { TaxationSettings, SecuritySettings, SystemSettings } from '../types/settings';

interface CountryConfig {
  taxation?: Partial<TaxationSettings>;
  security?: Partial<SecuritySettings>;
  system?: Partial<SystemSettings>;
}

interface CountryConfigContextType {
  country: string;
  setCountry: (country: string) => void;
  config: CountryConfig | null;
  loading: boolean;
  error: string | null;
}

const CountryConfigContext = createContext<CountryConfigContextType | undefined>(undefined);

export const CountryConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [country, setCountry] = useState('us');
  const [config, setConfig] = useState<CountryConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    async function loadConfig() {
      try {
        let countryConfig: CountryConfig = {};
        switch (country) {
          case 'us': {
            const us = await import('../data/countryConfigs/us');
            countryConfig = {
              taxation: us.usTaxationSettings,
              security: us.usSecuritySettings,
              system: us.usSystemSettings,
            };
            break;
          }
          case 'in': {
            const ind = await import('../data/countryConfigs/in');
            countryConfig = {
              taxation: ind.inTaxationSettings,
              security: ind.inSecuritySettings,
              system: ind.inSystemSettings,
            };
            break;
          }
          // Add more countries as needed
          default:
            countryConfig = {};
        }
        if (isMounted) {
          setConfig(countryConfig);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load country config');
          setConfig(null);
          setLoading(false);
        }
      }
    }
    loadConfig();
    return () => {
      isMounted = false;
    };
  }, [country]);

  return (
    <CountryConfigContext.Provider value={{ country, setCountry, config, loading, error }}>
      {children}
    </CountryConfigContext.Provider>
  );
};

export const useCountryConfig = () => {
  const context = useContext(CountryConfigContext);
  if (!context) {
    throw new Error('useCountryConfig must be used within a CountryConfigProvider');
  }
  return context;
}; 