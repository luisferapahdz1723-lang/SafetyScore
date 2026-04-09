import { BusinessOpportunity } from './types';

export const MOCK_OPPORTUNITIES: BusinessOpportunity[] = [
  {
    id: '1',
    name: 'Abarrotes Doña María',
    sector: 'Abarrotes',
    location: 'Puebla, PUE',
    safetyScore: 82,
    roi: 17.3,
    amount: 150000,
    term: 6,
    fundedPercentage: 67,
    status: 'high-demand',
    description: 'Tienda de abarrotes con 15 años de operación en zona residencial de alta densidad.',
    aiDictum: 'Abarrotes Doña María presenta un flujo de caja estable con ventas diarias consistentes de $4,200 MXN durante los últimos 6 meses. Su margen operativo del 32% está por encima del benchmark sectorial de 25% para abarrotes en la zona de Puebla. El destino solicitado (ampliación de inventario) tiene alta correlación con incremento de ventas en negocios similares. Riesgo principal: dependencia de un solo proveedor.'
  },
  {
    id: '2',
    name: 'Farmacia San Rafael',
    sector: 'Farmacia',
    location: 'CDMX',
    safetyScore: 88,
    roi: 15.5,
    amount: 300000,
    term: 12,
    fundedPercentage: 45,
    status: 'new',
    description: 'Farmacia local con servicio 24 horas y consultorio médico integrado.',
    aiDictum: 'Farmacia San Rafael muestra una resiliencia excepcional. El sector farmacéutico en CDMX tiene una volatilidad baja. El crecimiento interanual del 12% valida la necesidad de expansión de inventario de medicamentos genéricos.'
  },
  {
    id: '3',
    name: 'Papelería El Estudiante',
    sector: 'Papelería',
    location: 'Guadalajara, JAL',
    safetyScore: 74,
    roi: 19.2,
    amount: 80000,
    term: 3,
    fundedPercentage: 90,
    status: 'last-day',
    description: 'Papelería frente a zona escolar con alta demanda estacional.',
    aiDictum: 'Negocio con alta estacionalidad. El flujo de caja es cíclico pero predecible. El plazo corto (3 meses) mitiga el riesgo de liquidez. Se recomienda para diversificación de portafolio.'
  },
  {
    id: '4',
    name: 'Taller Mecánico Automotriz',
    sector: 'Servicios',
    location: 'Monterrey, NL',
    safetyScore: 79,
    roi: 18.5,
    amount: 200000,
    term: 9,
    fundedPercentage: 30,
    status: 'new',
    description: 'Taller especializado en transmisiones automáticas con cartera de clientes corporativos.',
    aiDictum: 'La base de clientes corporativos asegura un flujo de ingresos mínimo. El margen de utilidad es alto (45%). El riesgo operativo está vinculado a la retención de técnicos especializados.'
  },
  {
    id: '5',
    name: 'Panadería La Espiga',
    sector: 'Alimentos',
    location: 'Querétaro, QRO',
    safetyScore: 85,
    roi: 16.0,
    amount: 120000,
    term: 6,
    fundedPercentage: 55,
    status: 'high-demand',
    description: 'Panadería artesanal con distribución en cafeterías locales.',
    aiDictum: 'Modelo de negocio híbrido (retail + B2B). La diversificación de canales de venta reduce el riesgo comercial. Excelente historial de pagos a proveedores.'
  },
  {
    id: '6',
    name: 'Ferretería El Martillo',
    sector: 'Construcción',
    location: 'Mérida, YUC',
    safetyScore: 71,
    roi: 21.0,
    amount: 400000,
    term: 12,
    fundedPercentage: 15,
    status: 'new',
    description: 'Ferretería mayorista surtiendo a pequeñas constructoras locales.',
    aiDictum: 'Riesgo moderado debido a la exposición al sector construcción. Sin embargo, el ROI es atractivo y la garantía prendaria (inventario) es sólida.'
  }
];
