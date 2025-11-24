import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, Award, FileText } from 'lucide-react';

export function FeaturesSection() {
	return (
		<section className="py-20 bg-muted/30">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
					<Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
						<CardContent className="p-8 text-center">
							<div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
								<Shield className="h-7 w-7 text-primary" />
							</div>
							<h3 className="font-bold text-lg mb-2">專業可靠</h3>
							<p className="text-sm text-muted-foreground">資深法律專家撰寫，內容嚴謹準確</p>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
						<CardContent className="p-8 text-center">
							<div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
								<Zap className="h-7 w-7 text-primary" />
							</div>
							<h3 className="font-bold text-lg mb-2">即時更新</h3>
							<p className="text-sm text-muted-foreground">持續追蹤最新法律動態與判例</p>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
						<CardContent className="p-8 text-center">
							<div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
								<Award className="h-7 w-7 text-primary" />
							</div>
							<h3 className="font-bold text-lg mb-2">實務導向</h3>
							<p className="text-sm text-muted-foreground">結合理論與實務的深度分析</p>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
						<CardContent className="p-8 text-center">
							<div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
								<FileText className="h-7 w-7 text-primary" />
							</div>
							<h3 className="font-bold text-lg mb-2">易於理解</h3>
							<p className="text-sm text-muted-foreground">複雜概念簡明化，深入淺出</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
