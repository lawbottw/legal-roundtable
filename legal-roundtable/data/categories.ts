export const categories = {
    'judgment-analysis': {
        id: 'judgment-analysis',
        name: '裁判分析',
        description: '深度分析大法庭、具價值裁判或其他重點裁判，分享最新實務見解',
        image: '/images/categories/judgment.jpg',
        h1: '裁判分析專欄',
    },
    'legal-outreach': {
        id: 'legal-outreach',
        name: '法律普及',
        description: '讓法律知識更簡單易懂、更貼近生活',
        image: '/images/categories/outreach.jpg',
        h1: '法律普及專欄',
    }
} as const;

export type CategoryKey = keyof typeof categories;