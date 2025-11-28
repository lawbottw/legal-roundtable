import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { categories } from '@/data/categories';

interface Article {
	id: string;
	title: string;
	excerpt: string;
	image?: string;
	category: string;
	readTime?: number;
	updatedAt: { seconds: number };
	authorId: string;
	featured?: boolean; // 新增精選標記
	author: {
		id: string;
		name: string;
		description?: string;
		avatar?: string;
		title?: string;
	};
}

interface LatestArticlesSectionProps {
	articles: Article[];
}

export function LatestArticlesSection({ articles }: LatestArticlesSectionProps) {
	// 優先使用精選文章，不足時補充最新文章
	const featuredArticles = articles.filter(a => a.featured);
	const nonFeaturedArticles = articles.filter(a => !a.featured);
	const displayArticles = [...featuredArticles, ...nonFeaturedArticles].slice(0, 4);

	return (
		<section id="articles" className="py-28 sm:px-8 md:px-16 bg-background">
			<div className="container mx-auto px-4">
				<div className="text-center mb-20">
					<div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-6 border border-primary/20">
						<TrendingUp className="h-4 w-4 text-primary" />
						<span className="text-sm font-semibold text-primary">最新發表</span>
					</div>
					<h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">深度見解 × 實務觀點</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
						讓專業知識更可近、更可懂、更可用
					</p>
				</div>

				{/* Articles Grid */}
				{displayArticles.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
						{displayArticles.slice(0, 3).map((article) => (
							<Link key={article.id} href={`/blog/${article.category}/${article.id}`}>
								<Card className="pt-0 group hover:shadow-2xl transition-all duration-300 border-2 border-border/50 hover:border-primary/50">
									{/* Image Section */}
									<div className="relative h-56 overflow-hidden bg-muted">
										<Image
											src={article.image || "/img/default.png"}
											alt={article.title}
											width={400}
											height={200}
											className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
										{article.featured && (
											<div className="absolute top-4 left-4">
												<Badge className="bg-primary text-primary-foreground shadow-xl px-3 py-1 text-xs font-semibold">
													✨ 精選
												</Badge>
											</div>
										)}
									</div>

									<CardHeader>
										<div className="flex justify-between items-center mb-4">
											<Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium border-2">
												{categories[article.category as keyof typeof categories]?.name || article.category}
											</Badge>
											<span className="text-xs text-muted-foreground font-semibold">
												{article.readTime || 5} min
											</span>
										</div>
										<CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-xl leading-snug font-bold">
											{article.title}
										</CardTitle>
									</CardHeader>

									<CardContent className="space-y-2">
										<CardDescription className="line-clamp-3 leading-relaxed flex-1 text-base">
											{article.excerpt}
										</CardDescription>

										<div className="flex justify-between items-center pt-2 border-t-2 border-border/50 mt-auto">
											<div className="flex items-center space-x-3">
												<Avatar className="w-10 h-10 border-2 border-primary/10">
													<AvatarImage src={article.author.avatar || ""} alt={article.author.name} />
													<AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
														{article.author.name?.[0] || ''}
													</AvatarFallback>
												</Avatar>
												<span className="text-sm font-semibold">
													{article.author.name}
												</span>
											</div>
											<div className="flex items-center space-x-1.5 text-xs text-muted-foreground font-medium">
												<Calendar className="h-3.5 w-3.5" />
												<span>{new Date(article.updatedAt.seconds * 1000).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}</span>
											</div>
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
						{/* md 時顯示第 4 篇 */}
						{displayArticles[3] && (
							<Link href={`/blog/${displayArticles[3].category}/${displayArticles[3].id}`} className="hidden md:block lg:hidden">
								<Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-border/50 hover:border-primary/50 bg-card overflow-hidden h-full flex flex-col">
									<div className="relative h-56 overflow-hidden bg-muted">
										<Image
											src={displayArticles[3].image || "/img/default.png"}
											alt={displayArticles[3].title}
											width={400}
											height={200}
											className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
										/>
										{displayArticles[3].featured && (
											<div className="absolute top-4 left-4">
												<Badge className="bg-primary text-primary-foreground shadow-xl px-3 py-1 text-xs font-semibold">
													✨ 精選
												</Badge>
											</div>
										)}
									</div>
									<CardHeader className="pb-4 pt-6 px-6">
										<div className="flex justify-between items-center mb-4">
											<Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium border-2">
												{categories[displayArticles[3].category as keyof typeof categories]?.name || displayArticles[3].category}
											</Badge>
											<span className="text-xs text-muted-foreground font-semibold">
												{displayArticles[3].readTime || 5} min
											</span>
										</div>
										<CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-xl leading-snug font-bold">
											{displayArticles[3].title}
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4 flex-1 flex flex-col px-6 pb-6">
										<CardDescription className="line-clamp-3 leading-relaxed flex-1 text-base">
											{displayArticles[3].excerpt}
										</CardDescription>
										<div className="flex justify-between items-center pt-4 border-t-2 border-border/50 mt-auto">
											<div className="flex items-center space-x-3">
												<Avatar className="w-10 h-10 border-2 border-primary/10">
													<AvatarImage src={displayArticles[3].author.avatar || ""} alt={displayArticles[3].author.name} />
													<AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
														{displayArticles[3].author.name?.[0] || ''}
													</AvatarFallback>
												</Avatar>
												<span className="text-sm font-semibold">{displayArticles[3].author.name}</span>
											</div>
											<div className="flex items-center space-x-1.5 text-xs text-muted-foreground font-medium">
												<Calendar className="h-3.5 w-3.5" />
												<span>{new Date(displayArticles[3].updatedAt.seconds * 1000).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}</span>
											</div>
										</div>
									</CardContent>
								</Card>
							</Link>
						)}
					</div>
				)}

				<div className="text-center">
					<Link href="/blog">
						<Button
							variant="outline"
							size="lg"
							className="rounded-2xl hover:shadow-xl transition-all hover:scale-105 px-10 py-6 text-lg border-2 font-semibold"
						>
							查看所有文章
							<BookOpen className="ml-3 h-5 w-5" />
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
