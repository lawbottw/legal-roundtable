export const categories = {
    'judgment-analysis': {
        id: 'judgment-analysis',
        name: '裁判分析',
        description: '深入分析重要判決案例，解讀法律適用與實務見解',
        image: '/images/categories/judgment.jpg',
        h1: '裁判分析專欄',
    },
    'legal-outreach': {
        id: 'legal-outreach',
        name: '法律普及',
        description: '讓法律知識更容易理解，提升全民法律素養',
        image: '/images/categories/outreach.jpg',
        h1: '法律普及專欄',
    }
} as const;

export type CategoryKey = keyof typeof categories;