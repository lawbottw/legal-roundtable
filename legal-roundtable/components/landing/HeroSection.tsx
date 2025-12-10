import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
	return (
		<section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 py-32 overflow-hidden">
			{/* 動態背景裝飾 */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
			</div>

			{/* 網格背景 */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

			<div className="container mx-auto px-4 text-center relative z-10">
				<div className="max-w-5xl mx-auto space-y-10">
					<div className="space-y-8">
						<div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-6 border border-primary/20">
							<Sparkles className="h-4 w-4 text-primary animate-pulse" />
							<span className="text-sm font-semibold text-primary">台灣首屈一指的法律知識平台</span>
						</div>
						
						<h1 className="text-6xl md:text-8xl font-bold text-foreground leading-tight tracking-tight">
							法律專業知識的
							<span className="text-primary text-5xl block mt-4 bg-clip-textbg-gradient-to-r from-primary to-primary/60">交流圓桌</span>
						</h1>
						
						<p className="text-xl md:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
							匯聚法律智慧，推動專業知識的公開與共享
						</p>

						{/* 統計數據 */}
						<div className="flex flex-wrap justify-center gap-8 pt-8">
							<div className="text-center">
								<div className="text-4xl md:text-5xl font-bold text-primary mb-2">5+</div>
								<div className="text-sm text-muted-foreground">專業文章</div>
							</div>
							<div className="w-px h-16 bg-border hidden sm:block"></div>
							<div className="text-center">
								<div className="text-4xl md:text-5xl font-bold text-primary mb-2">3+</div>
								<div className="text-sm text-muted-foreground">專業作者</div>
							</div>
							<div className="w-px h-16 bg-border hidden sm:block"></div>
							<div className="text-center">
								<div className="text-4xl md:text-5xl font-bold text-primary mb-2">1K+</div>
								<div className="text-sm text-muted-foreground">每月讀者</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
						<Link href="/blog">
							<Button size="lg" className="text-lg px-12 py-7 rounded-2xl hover:shadow-2xl transition-all hover:scale-105 group">
								開始閱讀
								<ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
							</Button>
						</Link>
						<Link href="/author">
							<Button
								size="lg"
								variant="outline"
								className="text-lg px-12 py-7 rounded-2xl hover:shadow-xl transition-all hover:scale-105 border-2"
							>
								認識作者群
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
