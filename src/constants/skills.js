import { 
    Wrench, Zap, Paintbrush, Hammer, HardHat, Trash2, Utensils, 
    Shield, Truck, Palmtree, Baby, Droplets, Thermometer, 
    Scissors, Crop, Package, Construction, Layers, Drill, 
    Container, Tractor, User, HelpCircle, Flame, Grid, Maximize,
    Smartphone, Search, MapPin, Pipette, Ghost
} from 'lucide-react';

export const SKILL_CATEGORIES = {
    CONSTRUCTION: 'construction',
    MAINTENANCE: 'maintenance',
    LOGISTICS: 'logistics',
    DOMESTIC: 'domestic',
    AGRICULTURE: 'agriculture',
    EMERGENCY: 'emergency'
};

export const SKILLS = [
    // Construction & Civil
    { id: 'mason', category: SKILL_CATEGORIES.CONSTRUCTION, icon: HardHat, color: '#E53E3E' },
    { id: 'carpenter', category: SKILL_CATEGORIES.CONSTRUCTION, icon: Hammer, color: '#D69E2E' },
    { id: 'bar_bender', category: SKILL_CATEGORIES.CONSTRUCTION, icon: Layers, color: '#4A5568' },
    { id: 'electrician', category: SKILL_CATEGORIES.CONSTRUCTION, icon: Zap, color: '#ECC94B' },
    { id: 'plumber', category: SKILL_CATEGORIES.CONSTRUCTION, icon: Wrench, color: '#3182CE' },
    { id: 'painter', category: SKILL_CATEGORIES.CONSTRUCTION, icon: Paintbrush, color: '#9F7AEA' },
    { id: 'welder', category: SKILL_CATEGORIES.CONSTRUCTION, icon: Flame, color: '#F6AD55' },
    { id: 'fabricator', category: SKILL_CATEGORIES.CONSTRUCTION, icon: Grid, color: '#4FD1C5' },
    { id: 'tiler', category: SKILL_CATEGORIES.CONSTRUCTION, icon: Maximize, color: '#F687B3' },
    { id: 'pop_mistri', category: SKILL_CATEGORIES.CONSTRUCTION, icon: Layers, color: '#CBD5E0' },
    { id: 'aluminum_fabricator', category: SKILL_CATEGORIES.CONSTRUCTION, icon: Grid, color: '#718096' },
    { id: 'glass_cutter', category: SKILL_CATEGORIES.CONSTRUCTION, icon: Scissors, color: '#A0AEC0' },
    { id: 'scaffolder', category: SKILL_CATEGORIES.CONSTRUCTION, icon: Construction, color: '#FC8181' },
    { id: 'helper', category: SKILL_CATEGORIES.CONSTRUCTION, icon: HelpCircle, color: '#A0AEC0' },

    // Maintenance & Services
    { id: 'ac_repair', category: SKILL_CATEGORIES.MAINTENANCE, icon: Thermometer, color: '#4299E1' },
    { id: 'appliances_repair', category: SKILL_CATEGORIES.MAINTENANCE, icon: Smartphone, color: '#48BB78' },
    { id: 'ro_service', category: SKILL_CATEGORIES.MAINTENANCE, icon: Droplets, color: '#00B5D8' },
    { id: 'pest_control', category: SKILL_CATEGORIES.MAINTENANCE, icon: Ghost, color: '#718096' },
    { id: 'gardener', category: SKILL_CATEGORIES.MAINTENANCE, icon: Palmtree, color: '#38A169' },
    { id: 'roofer', category: SKILL_CATEGORIES.MAINTENANCE, icon: Layers, color: '#805AD5' },
    { id: 'solar_installer', category: SKILL_CATEGORIES.MAINTENANCE, icon: Zap, color: '#D69E2E' },

    // Logistics & Heavy Work
    { id: 'loader', category: SKILL_CATEGORIES.LOGISTICS, icon: Package, color: '#B7791F' },
    { id: 'truck_driver', category: SKILL_CATEGORIES.LOGISTICS, icon: Truck, color: '#2D3748' },
    { id: 'jcb_operator', category: SKILL_CATEGORIES.LOGISTICS, icon: Drill, color: '#D69E2E' },
    { id: 'forklift_operator', category: SKILL_CATEGORIES.LOGISTICS, icon: Container, color: '#4A5568' },
    { id: 'packer_mover', category: SKILL_CATEGORIES.LOGISTICS, icon: Package, color: '#3182CE' },

    // Household & Domestic
    { id: 'cook', category: SKILL_CATEGORIES.DOMESTIC, icon: Utensils, color: '#F6AD55' },
    { id: 'cleaner', category: SKILL_CATEGORIES.DOMESTIC, icon: Trash2, color: '#E2E8F0' },
    { id: 'security_guard', category: SKILL_CATEGORIES.DOMESTIC, icon: Shield, color: '#2D3748' },
    { id: 'watchman', category: SKILL_CATEGORIES.DOMESTIC, icon: Shield, color: '#4A5568' },
    { id: 'nanny', category: SKILL_CATEGORIES.DOMESTIC, icon: Baby, color: '#F687B3' },
    { id: 'caretaker', category: SKILL_CATEGORIES.DOMESTIC, icon: User, color: '#48BB78' },
    { id: 'car_driver', category: SKILL_CATEGORIES.DOMESTIC, icon: Truck, color: '#718096' },

    // Agriculture
    { id: 'farm_labor', category: SKILL_CATEGORIES.AGRICULTURE, icon: Crop, color: '#38A169' },
    { id: 'tractor_driver', category: SKILL_CATEGORIES.AGRICULTURE, icon: Tractor, color: '#B7791F' },
    { id: 'dairy_worker', category: SKILL_CATEGORIES.AGRICULTURE, icon: Droplets, color: '#E2E8F0' },

    // Event & Commercial
    { id: 'delivery_boy', category: SKILL_CATEGORIES.LOGISTICS, icon: Package, color: '#3182CE' },
    { id: 'catering_helper', category: SKILL_CATEGORIES.DOMESTIC, icon: Utensils, color: '#F6AD55' },
    { id: 'waiter', category: SKILL_CATEGORIES.DOMESTIC, icon: Utensils, color: '#A0AEC0' }
];

export const getSkillById = (id) => SKILLS.find(s => s.id === id);

export const SKILL_LABELS = {
    plumber: 'Plumber', electrician: 'Electrician', carpenter: 'Carpenter',
    mason: 'Mason', painter: 'Painter', welder: 'Welder', helper: 'Helper / Labour',
    contractor: 'Contractor', tiler: 'Tiler', ac_technician: 'AC Technician',
    driver: 'Driver', cleaner: 'Cleaner', gardener: 'Gardener',
    security: 'Security Guard', cook: 'Cook',
};
