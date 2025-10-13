import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, Home } from "lucide-react";
import { notFound } from "next/navigation";
import { categories } from "@/data/categories";
import { getArticlesByCategoryWithAuthor } from "@/services/ArticleService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function getCategory(categoryId: string) {
	const category = categories[categoryId as keyof typeof categories];
	return category || null;
}

export default async function CategoryPage({
	params,
}: {
	params: Promise<{ category: string }>;
}) {
	const { category } = await params;

	const categoryInfo = getCategory(category);

	if (!categoryInfo) {
		notFound();
	}

	const posts = await getArticlesByCategoryWithAuthor(category, 30);

	// Generate structured data
	const structuredData = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "BreadcrumbList",
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: "首頁",
						item: "https://easy-law.net",
					},
					{
						"@type": "ListItem",
						position: 2,
						name: "法律知識專欄",
						item: "https://easy-law.net/blog",
					},
					{
						"@type": "ListItem",
						position: 3,
						name: categoryInfo.name,
						item: `https://easy-law.net/blog/${categoryInfo.id}`,
					},
				],
			},
			{
				"@type": "CollectionPage",
				"@id": `https://easy-law.net/blog/${categoryInfo.id}/#webpage`,
				url: `https://easy-law.net/blog/${categoryInfo.id}`,
				name: categoryInfo.h1,
				description: categoryInfo.description,
				isPartOf: {
					"@type": "WebSite",
					url: "https://easy-law.net",
					name: "EasyLaw 法律圓桌",
				},
				inLanguage: "zh-TW",
				primaryImageOfPage: {
					"@type": "ImageObject",
					url: `https://easy-law.net${categoryInfo.image}`,
					width: 1200,
					height: 630,
				},
			},
		],
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData),
				}}
			/>
			
			{/* Hero Section with Background Image */}
			<div className="relative bg-primary/5 border-b border-border">
				<div className="absolute inset-0" />
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
					{/* Breadcrumb */}
					<nav
						className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
						aria-label="breadcrumb"
					>
						<Link
							href="/"
							className="flex items-center gap-1 hover:text-primary transition-colors"
						>
							<Home className="w-4 h-4" />
							<span>首頁</span>
						</Link>
						<ChevronRight className="w-4 h-4" />
						<Link
							href="/blog"
							className="hover:text-primary transition-colors"
						>
							法律專欄
						</Link>
						<ChevronRight className="w-4 h-4" />
						<span className="text-foreground font-medium">{categoryInfo.name}</span>
					</nav>

					{/* Category Header */}
					<header className="text-center max-w-3xl mx-auto">
						<h1 className="mb-4 bg-gradient-to-r from-primary to-primary/30 bg-clip-text text-transparent">
							{categoryInfo.h1}
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
							{categoryInfo.description}
						</p>
					</header>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Articles Grid */}
				{posts.length > 0 ? (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
						{posts.map((post) => (
							<Link key={post.id} href={`/blog/${category}/${post.id}`}>
								<Card className="h-full shadow-none hover:border-primary/50 transition-all duration-300 group rounded-md flex flex-col">
									<CardHeader className="space-y-3">
										<div className="flex items-start justify-between gap-2">
											<Badge variant="secondary" className="text-xs">
												{categoryInfo.name}
											</Badge>
											<span className="text-xs text-muted-foreground">
												{post.readTime} 分鐘閱讀
											</span>
										</div>
										<CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
											{post.title}
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4 flex flex-col flex-grow">
										<CardDescription className="line-clamp-3 flex-grow">
											{post.excerpt}
										</CardDescription>
										<div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
											<span className="font-medium flex items-center gap-2">
												<Avatar className="w-6 h-6">
													<AvatarImage
														src={post.author.avatar}
														alt={post.author.name}
													/>
													<AvatarFallback>
														{post.author.name?.[0]}
													</AvatarFallback>
												</Avatar>
												{post.author.name}
											</span>
											<time dateTime={post.updatedAt.toDate().toISOString()}>
												{post.updatedAt.toDate().toLocaleDateString('zh-TW')}
											</time>
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				) : (
					<div className="text-center py-16">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
							<span className="text-3xl">📝</span>
						</div>
						<h3 className="text-xl font-semibold mb-2">目前沒有文章</h3>
						<p className="text-muted-foreground mb-6">
							這個分類下還沒有發布文章，敬請期待
						</p>
					</div>
				)}

				{/* Navigation */}
				<nav className="flex flex-col sm:flex-row gap-4 justify-center items-center border-t border-border pt-8">
					<Link href="/blog">
						<Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
							<ArrowLeft className="w-4 h-4" />
							返回專欄首頁
						</Button>
					</Link>
					<Link href="/">
						<Button variant="ghost" size="lg" className="gap-2 w-full sm:w-auto">
							<Home className="w-4 h-4" />
							返回首頁
						</Button>
					</Link>
				</nav>
			</div>
		</div>
	);
}