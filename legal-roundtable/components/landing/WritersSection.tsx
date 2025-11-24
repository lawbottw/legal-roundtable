import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Quote } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Writer {
	id: string;
	name: string;
	title?: string;
	description?: string;
	avatar?: string; // allow undefined
}

interface WritersSectionProps {
	writers: Writer[];
}

export function WritersSection({ writers }: WritersSectionProps) {
	return (
		<section id="writers" className="py-28 sm:px-8 md:px-16 bg-gradient-to-b from-muted/30 to-background">
			<div className="container mx-auto px-4">
				<div className="text-center mb-20">
					<div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-6 border border-primary/20">
						<Users className="h-4 w-4 text-primary" />
						<span className="text-sm font-semibold text-primary">專業團隊</span>
					</div>
					<h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">法律專家陣容</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
						來自不同法律專業領域的資深專家
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
					{writers.map((writer) => (
						<div key={writer.id} className="group">
							<Card className="bg-background rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-border/50 hover:border-primary/50 h-full flex flex-col items-center text-center overflow-hidden relative">
								{/* 背景裝飾 */}
								<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								
								<div className="relative z-10 w-full">
									{/* Profile Image */}
									<Link href={`/author/${writer.id}`}>
										<Avatar className="w-28 h-28 mb-6 group-hover:scale-110 transition-transform duration-300 cursor-pointer border-4 border-primary/20 ring-4 ring-primary/5 mx-auto">
											{/* fallback to empty string if undefined */}
											<AvatarImage src={writer.avatar || ""} alt={writer.name} />
											<AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
												{writer.name?.[0] || 'U'}
											</AvatarFallback>
										</Avatar>
									</Link>

									{/* Writer Info */}
									<div className="mb-6">
										<Link href={`/author/${writer.id}`}>
											<h3 className="text-xl font-bold text-foreground mb-2 hover:text-primary cursor-pointer transition-colors">
												{writer.name}
											</h3>
										</Link>
										<Badge variant="secondary" className="px-3 py-1 text-xs font-medium">
											{writer.title || '法律人士'}
										</Badge>
									</div>

									{/* Quote */}
									<div className="relative mt-auto">
										<Quote className="h-6 w-6 text-primary/20 mb-3 mx-auto" />
										<p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
											{writer.description || '致力於分享法律專業知識與實務經驗'}
										</p>
									</div>
								</div>
							</Card>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
