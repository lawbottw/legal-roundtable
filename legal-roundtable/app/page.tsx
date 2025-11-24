import React from 'react';
import { getLatestArticles } from '@/services/ArticleService';
import { getAuthorsByIds } from '@/services/AuthorService';
import Script from 'next/script';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { LatestArticlesSection } from '@/components/landing/LatestArticlesSection';
import { WritersSection } from '@/components/landing/WritersSection';
import { AboutSection } from '@/components/landing/AboutSection';

// Server Component - fetch data directly
async function getHomePageData() {
	// 只抓取最新 4 篇文章
	const latestArticles = await getLatestArticles(4);

	// 收集所有唯一的 authorId
	const authorIds = Array.from(
		new Set(latestArticles.map(article => article.authorId))
	);

	// 批次獲取所有作者資料
	const authorsMap = await getAuthorsByIds(authorIds);

	// 將作者資料附加到文章上
	const latestWithAuthors = latestArticles.map(article => ({
		...article,
		author: authorsMap.get(article.authorId) || {
			id: article.authorId,
			name: '未知作者',
			description: '',
			avatar: '',
			title: ''
		}
	}));

	// 從 authorsMap 中提取作者作為特色寫手
	const featuredWriters = Array.from(authorsMap.values()).slice(0, 8);

	return {
		latestArticles: latestWithAuthors,
		featuredWriters
	};
}

export default async function Home() {
	const { latestArticles, featuredWriters } = await getHomePageData();

	// Generate structured data for breadcrumb
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "首頁",
				item: "https://lawtable.org",
			},
		],
	};

	return (
		<div className="min-h-screen">
			<Script
				id="structured-data"
				type="application/ld+json"
				strategy="beforeInteractive"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData)
				}}
			/>
			<main>
				<HeroSection />
				<FeaturesSection />
				<LatestArticlesSection articles={latestArticles} />
				<WritersSection writers={featuredWriters} />
				<AboutSection />
			</main>
		</div>
	);
}
