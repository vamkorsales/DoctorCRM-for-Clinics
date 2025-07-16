import { TaxationSettings, SecuritySettings, SystemSettings } from '../../types/settings';

export const usTaxationSettings: Partial<TaxationSettings> = {
  taxId: '12-3456789',
  taxName: 'Medical Services Tax',
  defaultTaxRate: 8.5,
  taxTypes: [
    {
      id: 'TAX-TYPE-001',
      name: 'Medical Services Tax',
      rate: 8.5,
      type: 'percentage',
      appliesTo: 'services',
      isActive: true
    },
    {
      id: 'TAX-TYPE-002',
      name: 'Medical Supplies Tax',
      rate: 6.25,
      type: 'percentage',
      appliesTo: 'products',
      isActive: true
    }
  ],
  reportingPeriod: 'quarterly',
  taxAuthority: {
    name: 'IRS',
    address: '1111 Constitution Ave NW, Washington, DC 20224',
    phone: '(800) 829-1040',
    website: 'https://www.irs.gov/'
  },
  isActive: true
};

export const usSecuritySettings: Partial<SecuritySettings> = {
  compliance: {
    hipaaCompliant: true,
    gdprCompliant: false,
    soxCompliant: false,
    customCompliance: []
  }
};

export const usSystemSettings: Partial<SystemSettings> = {
  general: {
    currency: 'USD',
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    theme: 'light'
  }
}; 