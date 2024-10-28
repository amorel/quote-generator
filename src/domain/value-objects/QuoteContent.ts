export default class QuoteContent {
    private constructor(private readonly value: string) {}

    public static create(content: string): QuoteContent {
        if (!content || content.trim().length === 0) {
            throw new Error('Quote content cannot be empty');
        }
        if (content.length > 500) {
            throw new Error('Quote content cannot exceed 500 characters');
        }
        return new QuoteContent(content.trim());
    }

    public getValue(): string {
        return this.value;
    }

    public getLength(): number {
        return this.value.length;
    }
}
