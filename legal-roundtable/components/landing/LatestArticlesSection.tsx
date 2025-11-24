import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, BookOpen, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { categories } from '@/data/categories';

interface Article {
	id: string;
	title: string;
	excerpt: string;
	image?: string; // allow undefined
	category: string;
	readTime?: number;
	updatedAt: { seconds: number };
	authorId: string;
	author: {
		id: string;
		name: string;
		description?: string;
		avatar?: string; // allow undefined
		title?: string;
	};
}

interface LatestArticlesSectionProps {
	articles: Article[];
}

export function LatestArticlesSection({ articles }: LatestArticlesSectionProps) {
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

				{articles.length > 0 && (
					<div className="mb-20">
						<Link href={`/blog/${articles[0].category}/${articles[0].id}`}>
							<Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-border/50 hover:border-primary/50 bg-card group cursor-pointer">
								<div className="grid md:grid-cols-5 gap-0">
									{/* Article Image */}
									<div className="md:col-span-2 relative overflow-hidden bg-muted">
										<Image
											src={articles[0].image || "/img/default.png"}
											alt={articles[0].title}
											width={600}
											height={400}
											className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
										<div className="absolute top-6 left-6">
											<Badge className="bg-primary text-primary-foreground shadow-xl px-4 py-1.5 text-sm font-semibold">
												✨ 精選文章
											</Badge>
										</div>
									</div>

									{/* Content */}
									<div className="md:col-span-3 p-10 md:p-12 flex flex-col justify-center">
										<div className="flex items-center gap-4 mb-6 flex-wrap">
											<Badge variant="secondary" className="rounded-full px-4 py-1 text-sm font-medium">
												{categories[articles[0].category as keyof typeof categories]?.name || articles[0].category}
											</Badge>
											<span className="text-sm text-muted-foreground flex items-center font-medium">
												<Calendar className="h-4 w-4 mr-2" />
												{new Date(articles[0].updatedAt.seconds * 1000).toLocaleDateString('zh-TW')}
											</span>
											<span className="text-sm text-muted-foreground font-medium">
												{articles[0].readTime || 5} 分鐘閱讀
											</span>
										</div>

										<h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6 group-hover:text-primary transition-colors leading-tight">
											{articles[0].title}
										</h3>

										<p className="text-muted-foreground mb-10 text-lg leading-relaxed line-clamp-3">
											{articles[0].excerpt}
										</p>

										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-4">
												<Avatar className="w-14 h-14 border-2 border-primary/20 ring-4 ring-primary/5">
													{/* fallback to empty string if undefined */}
													<AvatarImage src={articles[0].author.avatar || ""} alt={articles[0].author.name} />
													<AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
														{articles[0].author.name?.[0] || 'U'}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-bold text-foreground text-lg">
														{articles[0].author.name}
													</p>
													<p className="text-sm text-muted-foreground">
														{articles[0].author.title || '法律專家'}
													</p>
												</div>
											</div>
											<div className="flex items-center text-primary font-semibold group-hover:gap-3 gap-2 transition-all">
												<span>閱讀全文</span>
												<ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
											</div>
										</div>
									</div>
								</div>
							</Card>
						</Link>
					</div>
				)}

				{/* Other Articles Grid */}
				{articles.length > 1 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
						{articles.slice(1).map((article) => (
							<Link key={article.id} href={`/blog/${article.category}/${article.id}`}>
								<Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-border/50 hover:border-primary/50 bg-card overflow-hidden h-full flex flex-col">
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
									</div>

									<CardHeader className="pb-4 pt-6 px-6">
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

									<CardContent className="space-y-4 flex-1 flex flex-col px-6 pb-6">
										<CardDescription className="line-clamp-3 leading-relaxed flex-1 text-base">
											{article.excerpt}
										</CardDescription>

										<div className="flex justify-between items-center pt-4 border-t-2 border-border/50 mt-auto">
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
