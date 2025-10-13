import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, BookOpen, Scale, Calendar, Quote, TrendingUp, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { getLatestArticles } from '@/services/ArticleService';
import { getAuthorsByIds } from '@/services/AuthorService';
import { categories } from '@/data/categories';
import Link from 'next/link';
import { Article } from '@/types/article';
import { Author } from '@/types/author';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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

	return (
		<div className="min-h-screen">
			<main>
				{/* Hero Section - 優化漸層與動畫 */}
				<section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 py-24 overflow-hidden">
					{/* 背景裝飾 */}
					<div className="absolute inset-0 overflow-hidden">
						<div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
						<div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
					</div>

					<div className="container mx-auto px-4 text-center relative z-10">
						<div className="max-w-4xl mx-auto space-y-8">
							<div className="space-y-6">
								<div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
									<Sparkles className="h-4 w-4 text-primary" />
									<span className="text-sm font-medium text-primary">法律知識交流平台</span>
								</div>
								
								<h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight tracking-tight">
									法律專業知識的
									<span className="text-primary block mt-2">交流圓桌</span>
								</h1>
								
								<p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
									匯聚法律智慧，推動專業知識的公開與共享
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
								<Link href="/blog">
									<Button size="lg" className="text-lg px-10 py-6 rounded-xl hover:shadow-lg transition-all hover:scale-105">
										閱讀文章
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</Link>
								<Link href="/author">
									<Button
										size="lg"
										variant="outline"
										className="text-lg px-10 py-6 rounded-xl hover:shadow-lg transition-all hover:scale-105"
									>
										認識作者群
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>

				{/* Latest Articles Section - 優化布局 */}
				<section id="articles" className="py-24 sm:px-8 md:px-16 bg-background">
					<div className="container mx-auto px-4">
						<div className="text-center mb-16">
							<div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
								<TrendingUp className="h-4 w-4 text-primary" />
								<span className="text-sm font-medium text-primary">最新發表</span>
							</div>
							<h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">深度見解 × 實務觀點</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								讓專業知識更可近、更可懂、更可用
							</p>
						</div>

						{latestArticles.length > 0 && (
							<div className="mb-16">
								<Link href={`/blog/${latestArticles[0].category}/${latestArticles[0].id}`}>
									<Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-card group cursor-pointer py-0">
										<div className="grid md:grid-cols-5 gap-0">
											{/* Article Image - 優化顯示 */}
											<div className="md:col-span-2 relative overflow-hidden bg-muted">
												<Image
													src={latestArticles[0].image || "/img/default.png"}
													alt={latestArticles[0].title}
													width={600}
													height={400}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
												/>
												<div className="absolute top-4 left-4">
													<Badge className="bg-primary text-primary-foreground shadow-lg">
														精選文章
													</Badge>
												</div>
											</div>

											{/* Content */}
											<div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
												<div className="flex items-center gap-3 mb-4 flex-wrap">
													<Badge variant="secondary" className="rounded-full">
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

												<h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
													{latestArticles[0].title}
												</h3>

												<p className="text-muted-foreground mb-8 text-lg leading-relaxed line-clamp-3">
													{latestArticles[0].excerpt}
												</p>

												<div className="flex items-center justify-between">
													<div className="flex items-center space-x-3">
														<Avatar className="w-12 h-12 border-2 border-muted">
															<AvatarImage src={latestArticles[0].author.avatar} alt={latestArticles[0].author.name} />
															<AvatarFallback className="bg-primary/10 text-primary font-semibold">
																{latestArticles[0].author.name?.[0] || 'U'}
															</AvatarFallback>
														</Avatar>
														<div>
															<p className="font-semibold text-foreground">
																{latestArticles[0].author.name}
															</p>
														</div>
													</div>
													<div className="flex items-center text-primary">
														<span className="mr-2">閱讀全文</span>
														<ArrowRight className="h-5 w-5" />
													</div>
												</div>
											</div>
										</div>
									</Card>
								</Link>
							</div>
						)}

						{/* Other Articles Grid - 優化卡片設計 */}
						{latestArticles.length > 1 && (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
								{latestArticles.slice(1).map((article) => (
									<Link key={article.id} href={`/blog/${article.category}/${article.id}`}>
										<Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border border-border/50 hover:border-primary/50 bg-card overflow-hidden h-full flex flex-col">
											{/* Image Section */}
											<div className="relative h-48 overflow-hidden bg-muted">
												<Image
													src={article.image || "/img/default.png"}
													alt={article.title}
													width={400}
													height={200}
													className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
											</div>

											<CardHeader className="pb-3">
												<div className="flex justify-between items-center mb-3">
													<Badge variant="outline" className="rounded-full">
														{categories[article.category as keyof typeof categories]?.name || article.category}
													</Badge>
													<span className="text-xs text-muted-foreground">
														{article.readTime || 5} min
													</span>
												</div>
												<CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-xl leading-snug">
													{article.title}
												</CardTitle>
											</CardHeader>

											<CardContent className="space-y-4 flex-1 flex flex-col">
												<CardDescription className="line-clamp-2 leading-relaxed flex-1">
													{article.excerpt}
												</CardDescription>

												<div className="flex justify-between items-center pt-4 border-t border-border/50 mt-auto">
													<div className="flex items-center space-x-2">
														<Avatar className="w-8 h-8">
															<AvatarImage src={article.author.avatar} alt={article.author.name} />
															<AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
																{article.author.name?.[0] || ''}
															</AvatarFallback>
														</Avatar>
														<span className="text-sm font-medium">
															{article.author.name}
														</span>
													</div>
													<div className="flex items-center space-x-1 text-xs text-muted-foreground">
														<Calendar className="h-3 w-3" />
														<span>{new Date(article.updatedAt.seconds * 1000).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}</span>
													</div>
												</div>
											</CardContent>
										</Card>
									</Link>
								))}
							</div>
						)}

						<div className="text-center">
							<Link href="/blog">
								<Button
									variant="outline"
									size="lg"
									className="rounded-full hover:shadow-lg transition-all hover:scale-105 px-8"
								>
									查看所有文章
									<BookOpen className="ml-2 h-5 w-5" />
								</Button>
							</Link>
						</div>
					</div>
				</section>

				{/* Writers Section - 優化設計 */}
				<section id="writers" className="py-24 sm:px-8 md:px-16 bg-muted/30">
					<div className="container mx-auto px-4">
						<div className="text-center mb-16">
							<div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
								<Users className="h-4 w-4 text-primary" />
								<span className="text-sm font-medium text-primary">專業團隊</span>
							</div>
							<h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">法律專家陣容</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								來自不同法律專業領域的資深專家
							</p>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
							{featuredWriters.map((writer) => (
								<div key={writer.id} className="group">
									<div className="bg-background rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/50 h-full flex flex-col items-center text-center">
										{/* Profile Image */}
										<Link href={`/author/${writer.id}`}>
											<Avatar className="w-24 h-24 mb-6 group-hover:scale-110 transition-transform duration-300 cursor-pointer border-4 border-muted">
												<AvatarImage src={writer.avatar} alt={writer.name} />
												<AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
													{writer.name?.[0] || 'U'}
												</AvatarFallback>
											</Avatar>
										</Link>

										{/* Writer Info */}
										<div className="mb-4">
											<Link href={`/author/${writer.id}`}>
												<h3 className="text-xl font-bold text-foreground mb-2 hover:text-primary cursor-pointer transition-colors">
													{writer.name}
												</h3>
											</Link>
											<p className="text-primary font-medium text-sm">
												{writer.title || '法律人士'}
											</p>
										</div>

										{/* Quote */}
										<div className="relative mt-auto">
											<Quote className="h-5 w-5 text-primary/20 mb-2 mx-auto" />
											<p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
												{writer.description || '致力於分享法律專業知識與實務經驗'}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* About Section - 優化布局 */}
				<section id="about" className="py-24 bg-background px-2 sm:px-4">
					<div className="container mx-auto px-4">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
							{/* Image Side - 移到左側 */}
							<div className="relative order-2 lg:order-1">
								<div className="relative overflow-hidden rounded-3xl shadow-2xl">
									<Image
										src="/img/landing.png"
										alt="法律圓桌"
										width={900}
										height={600}
										className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
								</div>

								{/* Floating Stats */}
								<div className="absolute -bottom-6 -right-6 bg-background rounded-2xl p-6 shadow-xl border border-border/50">
									<div className="flex items-center gap-6">
										<div className="text-center">
											<div className="text-3xl font-bold text-primary">5+</div>
											<div className="text-xs text-muted-foreground mt-1">專業文章</div>
										</div>
										<div className="w-px h-12 bg-border"></div>
										<div className="text-center">
											<div className="text-3xl font-bold text-primary">1.0K+</div>
											<div className="text-xs text-muted-foreground mt-1">每月讀者</div>
										</div>
									</div>
								</div>
							</div>

							{/* Content Side */}
							<div className="space-y-8 order-1 lg:order-2">
								<div>
									<div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
										<Scale className="h-4 w-4 text-primary" />
										<span className="text-sm font-medium text-primary">關於我們</span>
									</div>
									<h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
										法律圓桌的使命
									</h2>
									<p className="text-lg text-muted-foreground leading-relaxed">
										致力於創建一個專業、開放的法律知識分享平台，為法律系學生、新手律師、一般民眾提供實用的資源與指南。
									</p>
								</div>

								{/* Features */}
								<div className="space-y-6">
									<div className="flex items-start space-x-4 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
										<div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
											<Scale className="h-6 w-6 text-primary" />
										</div>
										<div>
											<h3 className="font-bold text-foreground mb-2 text-lg">專業嚴謹</h3>
											<p className="text-muted-foreground leading-relaxed">
												內容由專業人士撰寫，確保資訊的準確性與權威性。
											</p>
										</div>
									</div>

									<div className="flex items-start space-x-4 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
										<div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
											<Users className="h-6 w-6 text-primary" />
										</div>
										<div>
											<h3 className="font-bold text-foreground mb-2 text-lg">多元觀點</h3>
											<p className="text-muted-foreground leading-relaxed">
												來自不同專業領域的法律專家，提供多角度的法律見解。
											</p>
										</div>
									</div>

									<div className="flex items-start space-x-4 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
										<div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
											<BookOpen className="h-6 w-6 text-primary" />
										</div>
										<div>
											<h3 className="font-bold text-foreground mb-2 text-lg">實務導向</h3>
											<p className="text-muted-foreground leading-relaxed">
												結合學說與實務，提供貼近實務的裁判分析。
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
