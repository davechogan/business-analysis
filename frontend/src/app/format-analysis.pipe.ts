import { Pipe, PipeTransform } from '@angular/core';

interface FormattedSection {
  title: string;
  content: string[];
  subsections?: {
    title: string;
    content: string[];
  }[];
  chartData?: any;
}

@Pipe({
  name: 'formatAnalysis',
  standalone: true
})
export class FormatAnalysisPipe implements PipeTransform {
  transform(text: string | undefined): FormattedSection[] {
    if (!text) return [];

    // Simply split by double newlines to preserve paragraphs
    const paragraphs = text.split('\n\n')
      .map(p => p.trim())
      .filter(p => p);

    // Create a single section with all content
    const section: FormattedSection = {
      title: 'Analysis',
      content: paragraphs,
      subsections: []
    };

    // Extract chart data if present
    section.chartData = this.extractChartData(text);

    return [section];
  }

  private extractChartData(text: string) {
    const data: any = {
      marketShares: [],
      revenueProjections: [],
      costBreakdown: []
    };

    // Extract market share percentages
    const marketShareRegex = /(\w+(?:\s+\w+)*)\s*:\s*(\d+(?:\.\d+)?%)/g;
    let marketMatch;
    while ((marketMatch = marketShareRegex.exec(text)) !== null) {
      data.marketShares.push({
        company: marketMatch[1],
        share: parseFloat(marketMatch[2])
      });
    }

    // Extract revenue numbers with years
    const revenueRegex = /Year\s*(\d+)\s*:\s*\$\s*(\d+(?:\.\d+)?(?:K|M|B)?)/gi;
    let revenueMatch;
    while ((revenueMatch = revenueRegex.exec(text)) !== null) {
      data.revenueProjections.push({
        year: `Year ${revenueMatch[1]}`,
        amount: this.parseAmount(revenueMatch[2])
      });
    }

    // Extract cost breakdown
    const costRegex = /(\w+(?:\s+\w+)*)\s*cost\s*:\s*\$\s*(\d+(?:\.\d+)?(?:K|M|B)?)/gi;
    let costMatch;
    while ((costMatch = costRegex.exec(text)) !== null) {
      data.costBreakdown.push({
        category: costMatch[1],
        amount: this.parseAmount(costMatch[2])
      });
    }

    return data;
  }

  private parseAmount(str: string): number {
    const num = parseFloat(str.replace(/[$,]/g, ''));
    if (str.includes('B')) return num * 1000000000;
    if (str.includes('M')) return num * 1000000;
    if (str.includes('K')) return num * 1000;
    return num;
  }
} 