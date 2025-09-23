import React from 'react';
import { Button } from '@/components/ui/button';

export default function Newsletter() {
	return (
		<section className="py-20 bg-primary/5 mt-8">
			<div className="container mx-auto px-4 text-center">
				<div className="max-w-2xl mx-auto space-y-6">
					<h2 className="text-3xl font-bold text-foreground">
						掌握最新法律資訊
					</h2>
					<p className="text-lg text-muted-foreground">
						訂閱我們的電子報，第一時間獲得最新文章與專業見解
					</p>
					<div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
						<input
							type="email"
							placeholder="輸入您的電子信箱"
							className="flex-1 px-4 py-2 border rounded-md bg-background hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
						/>
						<Button className="whitespace-nowrap hover:scale-105 transition-transform">
							立即訂閱
						</Button>
					</div>
					<p className="text-xs text-muted-foreground">
						我們尊重您的隱私，絕不會將您的資訊分享給第三方
					</p>
				</div>
			</div>
		</section>
	);
}
