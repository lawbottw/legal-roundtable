import React from 'react';
import { Card } from '@/components/ui/card';
import { Scale, Users, BookOpen } from 'lucide-react';
import Image from 'next/image';

const features = [
	{
		icon: Scale,
		title: '專業嚴謹',
		description: '內容由專業人士撰寫,確保資訊的準確性與權威性。',
	},
	{
		icon: Users,
		title: '多元觀點',
		description: '來自不同專業領域的法律專家,提供多角度的法律見解。',
	},
	{
		icon: BookOpen,
		title: '實務導向',
		description: '結合學說與實務,提供貼近實務的裁判分析。',
	},
];

export function AboutSection() {
	return (
		<section id="about" className="py-20 bg-background px-2 sm:px-4">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
					{/* Image Side */}
					<div className="relative order-2 lg:order-1">
						<div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-border/50">
							<Image
								src="/img/landing.png"
								alt="法律圓桌"
								width={900}
								height={600}
								className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent"></div>
						</div>

						{/* Floating Stats */}
						<div className="absolute -bottom-8 right-0 md:-right-8 bg-background rounded-3xl p-8 shadow-2xl border-2 border-primary/20">
							<div className="flex items-center gap-6">
								<div className="text-center">
									<div className="text-4xl font-bold text-primary mb-1">5+</div>
									<div className="text-xs text-muted-foreground font-medium">專業文章</div>
								</div>
								<div className="w-px h-16 bg-border"></div>
								<div className="text-center">
									<div className="text-4xl font-bold text-primary mb-1">1.0K+</div>
									<div className="text-xs text-muted-foreground font-medium">每月讀者</div>
								</div>
							</div>
						</div>
					</div>

					{/* Content Side */}
					<div className="space-y-4 order-1 lg:order-2">
						<div>
							<div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-2 border border-primary/20">
								<Scale className="h-4 w-4 text-primary" />
								<span className="text-sm font-semibold text-primary">關於我們</span>
							</div>
							<h2 className="text-4xl md:text-5xl mb-2 font-bold text-foreground leading-tight tracking-tight">
								法律圓桌的使命
							</h2>
							<p className="text-xl text-muted-foreground leading-relaxed">
								致力於創建一個專業、開放的法律知識分享平台,為法律系學生、新手律師、一般民眾提供實用的資源與指南。
							</p>
						</div>

						{/* Features */}
						<div className="space-y-6">
							{features.map((feature, index) => {
								const Icon = feature.icon;
								return (
									<Card
										key={index}
										className="flex flex-row items-start space-x-5 px-6 rounded-2xl border-2 border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/20"
									>
										<div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
											<Icon className="h-7 w-7 text-primary" />
										</div>
										<div className="flex flex-col">
											<h3 className="font-bold text-foreground mb-3 text-lg">
												{feature.title}
											</h3>
											<p className="text-muted-foreground leading-relaxed">
												{feature.description}
											</p>
										</div>
									</Card>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
