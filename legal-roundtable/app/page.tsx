import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, BookOpen, Scale, Calendar, User, Quote, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Newsletter from '@/components/Newsletter';
import { getLatestArticles, getFeaturedArticles } from '@/services/ArticleService';
import { getAuthorsByIds } from '@/services/AuthorService';
import { categories } from '@/data/categories';
import Link from 'next/link';
import { Article } from '@/types/article';
import { Author } from '@/types/author';

// 擴展 Article 類型以包含 author 資料（僅用於顯示）
type ArticleWithAuthor = Article & { author: Author };

// Server Component - fetch data directly
async function getHomePageData() {
	const [latestArticles, featuredArticles] = await Promise.all([
		getLatestArticles(6),
		getFeaturedArticles(8)
	]);

	// 收集所有唯一的 authorId
	const authorIds = Array.from(
		new Set([...latestArticles, ...featuredArticles].map(article => article.authorId))
	);

	// 批次獲取所有作者資料
	const authorsMap = await getAuthorsByIds(authorIds);

	// 將作者資料附加到文章上
	const latestWithAuthors: ArticleWithAuthor[] = latestArticles.map(article => ({
		...article,
		author: authorsMap.get(article.authorId) || {
			id: article.authorId,
			name: '未知作者',
			description: '',
			avatar: ''
		}
	}));

	// 從 authorsMap 中提取前 8 位作者
	const featuredWriters = Array.from(authorsMap.values()).slice(0, 8);

	return {
		latestArticles: latestWithAuthors,
		featuredWriters
	};
}

export default async function Home() {
	const { latestArticles, featuredWriters } = await getHomePageData();

	return (
		<div className="min-h-screen">
			<main>
				{/* Hero Section */}
				<section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
					<div className="container mx-auto px-4 text-center">
						<div className="max-w-4xl mx-auto space-y-8">
							<div className="space-y-4">
								<h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
									法律專業知識的
									<span className="text-primary"> 交流圓桌</span>
								</h1>
								<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
									匯聚資深法律專家智慧，為法學生與新手律師提供專業指導、判決解析與實務經驗分享
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link href="/blog">
									<Button size="lg" className="text-lg px-8 hover:scale-105 transition-transform">
										閱讀最新文章
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</Link>
								<Link href="/blog#writers">
									<Button
										size="lg"
										variant="outline"
										className="text-lg px-8 hover:scale-105 transition-transform"
									>
										認識作者群
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>

				{/* Latest Articles Section */}
				<section id="articles" className="py-20">
					<div className="container mx-auto px-4">
						<div className="text-center mb-16">
							<div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
								<TrendingUp className="h-4 w-4 text-primary" />
								<span className="text-sm font-medium text-primary">最新發表</span>
							</div>
							<h2 className="text-4xl font-bold text-foreground mb-6">專業法律見解</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								我們的專業作者團隊持續為您帶來最新的法律見解與實務分析
							</p>
						</div>

						{/* Featured Article (First Article) */}
						{latestArticles.length > 0 && (
							<div className="mb-12">
								<Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
									<div className="md:flex">
										<div className="md:w-1/3 bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex items-center justify-center">
											<div className="text-center">
												<Scale className="h-16 w-16 text-primary mx-auto mb-4" />
												<Badge variant="default" className="text-sm">
													精選文章
												</Badge>
											</div>
										</div>
										<div className="md:w-2/3 p-8">
											<div className="flex items-center space-x-4 mb-4">
												<Badge variant="secondary">
													{categories[latestArticles[0].category as keyof typeof categories]?.name || latestArticles[0].category}
												</Badge>
												<span className="text-sm text-muted-foreground flex items-center">
													<Calendar className="h-4 w-4 mr-1" />
													{new Date(latestArticles[0].updatedAt.seconds * 1000).toLocaleDateString('zh-TW')}
												</span>
												<span className="text-sm text-muted-foreground">
													{latestArticles[0].readTime || 5} 分鐘閱讀
												</span>
											</div>
											<Link href={`/blog/${latestArticles[0].id}`}>
												<h3 className="text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors cursor-pointer">
													{latestArticles[0].title}
												</h3>
											</Link>
											<p className="text-muted-foreground mb-6 leading-relaxed">
												{latestArticles[0].excerpt}
											</p>
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-3">
													<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
														{latestArticles[0].author.avatar ? (
															<Image
																src={latestArticles[0].author.avatar}
																alt={latestArticles[0].author.name}
																width={40}
																height={40}
																className="object-cover"
															/>
														) : (
															<User className="h-5 w-5 text-primary" />
														)}
													</div>
													<div>
														<p className="font-semibold text-foreground">
															{latestArticles[0].author.name}
														</p>
														<p className="text-xs text-muted-foreground">
															{latestArticles[0].author.title || '法律專家'}
														</p>
													</div>
												</div>
												<Link href={`/blog/${latestArticles[0].id}`}>
													<Button variant="ghost" className="hover:bg-primary/10">
														閱讀全文
														<ArrowRight className="ml-2 h-4 w-4" />
													</Button>
												</Link>
											</div>
										</div>
									</div>
								</Card>
							</div>
						)}

						{/* Other Articles Grid */}
						{latestArticles.length > 1 && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
								{latestArticles.slice(1).map((article) => (
									<Card
										key={article.id}
										className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-muted/20 hover:bg-muted/40"
									>
										<CardHeader className="pb-4">
											<div className="flex justify-between items-start mb-3">
												<Badge variant="outline" className="bg-background">
													{categories[article.category as keyof typeof categories]?.name || article.category}
												</Badge>
												<span className="text-sm text-muted-foreground">
													{article.readTime || 5} 分鐘閱讀
												</span>
											</div>
											<Link href={`/blog/${article.id}`}>
												<CardTitle className="line-clamp-2 group-hover:text-primary transition-colors leading-snug">
													{article.title}
												</CardTitle>
											</Link>
										</CardHeader>
										<CardContent>
											<CardDescription className="line-clamp-3 mb-6 leading-relaxed">
												{article.excerpt}
											</CardDescription>
											<div className="flex justify-between items-center text-sm">
												<div className="flex items-center space-x-2 text-muted-foreground">
													<div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
														{article.author.avatar ? (
															<Image
																src={article.author.avatar}
																alt={article.author.name}
																width={24}
																height={24}
																className="object-cover"
															/>
														) : (
															<User className="h-3 w-3 text-primary" />
														)}
													</div>
													<span>{article.author.name}</span>
												</div>
												<div className="flex items-center space-x-1 text-muted-foreground">
													<Calendar className="h-3 w-3" />
													<span>{new Date(article.updatedAt.seconds * 1000).toLocaleDateString('zh-TW')}</span>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						)}

						<div className="text-center">
							<Link href="/blog">
								<Button
									variant="outline"
									size="lg"
									className="hover:scale-105 transition-transform"
								>
									查看所有文章
									<BookOpen className="ml-2 h-5 w-5" />
								</Button>
							</Link>
						</div>
					</div>
				</section>

				{/* Writers Section - Dynamic Grid */}
				<section id="writers" className="py-20 bg-muted/30">
					<div className="container mx-auto px-4">
						<div className="text-center mb-16">
							<div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
								<Users className="h-4 w-4 text-primary" />
								<span className="text-sm font-medium text-primary">專業團隊</span>
							</div>
							<h2 className="text-4xl font-bold text-foreground mb-6">法律專家陣容</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								來自不同法律專業領域的資深專家，為您提供最權威的法律見解
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
							{featuredWriters.map((writer) => (
								<div key={writer.id} className="group">
									<div className="bg-background rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-muted/20 hover:border-primary/20 h-full">
										{/* Profile Image */}
										<div className="relative mb-6">
											<div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
												{writer.avatar ? (
													<Image
														src={writer.avatar}
														alt={writer.name}
														width={80}
														height={80}
														className="rounded-full object-cover"
													/>
												) : (
													<User className="h-10 w-10 text-primary" />
												)}
											</div>
										</div>

										{/* Writer Info */}
										<div className="text-center mb-6">
											<h3 className="text-xl font-bold text-foreground mb-2">
												{writer.name}
											</h3>
											<p className="text-primary font-medium mb-3">
												{writer.title || '法律專家'}
											</p>
											
										</div>

										{/* Quote or Description */}
										<div className="relative">
											<Quote className="h-6 w-6 text-primary/30 mb-2" />
											<p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-4">
												{writer.description || '致力於分享法律專業知識與實務經驗'}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* About Section */}
				<section id="about" className="py-20">
					<div className="container mx-auto px-4">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
							{/* Content Side */}
							<div className="space-y-8">
								<div>
									<div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
										<Scale className="h-4 w-4 text-primary" />
										<span className="text-sm font-medium text-primary">關於我們</span>
									</div>
									<h2 className="text-4xl font-bold text-foreground mb-6">
										法律圓桌的使命
									</h2>
									<p className="text-lg text-muted-foreground leading-relaxed">
										我們致力於創建一個專業、開放的法律知識分享平台，為法學生與新手律師提供實用的學習資源與職涯指導。
									</p>
								</div>

								{/* Features */}
								<div className="space-y-6">
									<div className="flex items-start space-x-4">
										<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
											<Scale className="h-6 w-6 text-primary" />
										</div>
										<div>
											<h3 className="font-semibold text-foreground mb-2">
												專業嚴謹
											</h3>
											<p className="text-muted-foreground">
												所有內容都經過專業法律人士審核，確保資訊的準確性與專業性，為讀者提供可信賴的法律知識。
											</p>
										</div>
									</div>

									<div className="flex items-start space-x-4">
										<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
											<Users className="h-6 w-6 text-primary" />
										</div>
										<div>
											<h3 className="font-semibold text-foreground mb-2">
												多元觀點
											</h3>
											<p className="text-muted-foreground">
												來自不同專業領域的資深法律專家，提供多角度的法律見解，幫助讀者建立全面的法律思維。
											</p>
										</div>
									</div>

									<div className="flex items-start space-x-4">
										<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
											<BookOpen className="h-6 w-6 text-primary" />
										</div>
										<div>
											<h3 className="font-semibold text-foreground mb-2">
												實務導向
											</h3>
											<p className="text-muted-foreground">
												專為法學生與新手律師設計，結合理論與實務，提供實用的學習資源與職涯發展建議。
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Image Side */}
							<div className="relative">
								<div className="relative overflow-hidden rounded-2xl shadow-2xl">
									<Image
										src="/img/landing.png"
										alt="法律圓桌"
										width={900}
										height={600}
										className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-500"
									/>
									<div className="absolute inset-0"></div>
								</div>

								{/* Floating Stats */}
								<div className="absolute -bottom-6 -left-6 bg-background rounded-xl p-6 shadow-lg border border-muted/20">
									<div className="flex items-center space-x-4">
										<div className="text-center">
											<div className="text-2xl font-bold text-primary">55+</div>
											<div className="text-xs text-muted-foreground">
												專業文章
											</div>
										</div>
										<div className="w-px h-12 bg-muted"></div>
										<div className="text-center">
											<div className="text-2xl font-bold text-primary">1.2K+</div>
											<div className="text-xs text-muted-foreground">
												每月讀者
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Newsletter Section */}
				<Newsletter />
			</main>
		</div>
	);
}