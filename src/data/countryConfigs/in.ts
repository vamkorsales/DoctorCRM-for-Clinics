import { TaxationSettings, SecuritySettings, SystemSettings } from '../../types/settings';

export const inTaxationSettings: Partial<TaxationSettings> = {
  taxId: '27AAACI1234F1ZV',
  taxName: 'Goods and Services Tax (GST)',
  defaultTaxRate: 18,
  taxTypes: [
    {
      id: 'TAX-TYPE-001',
      name: 'GST on Medical Services',
      rate: 18,
      type: 'percentage',
      appliesTo: 'services',
      isActive: true
    },
    {
      id: 'TAX-TYPE-002',
      name: 'GST on Medical Supplies',
      rate: 12,
      type: 'percentage',
      appliesTo: 'products',
      isActive: true
    }
  ],
  reportingPeriod: 'monthly',
  taxAuthority: {
    name: 'Central Board of Indirect Taxes and Customs',
    address: 'North Block, New Delhi, 110001',
    phone: '+91-11-2309 5542',
    website: 'https://www.cbic.gov.in/'
  },
  isActive: true
};

export const inSecuritySettings: Partial<SecuritySettings> = {
  compliance: {
    hipaaCompliant: false,
    gdprCompliant: false,
    soxCompliant: false,
    customCompliance: ['DISHA (India Health Data Privacy)']
  }
};

export const inSystemSettings: Partial<SystemSettings> = {
  general: {
    currency: 'INR',
    language: 'en',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    theme: 'light'
  }
}; 