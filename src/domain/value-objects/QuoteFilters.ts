export class QuoteFiltersVO  {
    private constructor(
        private readonly _limit: number = 1,
        private readonly _maxLength: number | undefined = undefined,
        private readonly _minLength: number | undefined = undefined,
        private readonly _tags: string[] | undefined = undefined,
        private readonly _author: string | undefined = undefined
    ) {
        this.validate();
    }

    static create(params: {
        limit?: number;
        maxLength?: number;
        minLength?: number;
        tags?: string;
        author?: string;
    }): QuoteFiltersVO {
        return new QuoteFiltersVO(
            params.limit || 1,
            params.maxLength,
            params.minLength,
            params.tags?.split(',').map(tag => tag.trim()),
            params.author
        );
    }

    private validate(): void {
        if (this._limit < 1 || this._limit > 50) {
            throw new Error('La limite doit être comprise entre 1 et 50');
        }

        if (this._minLength !== undefined && this._minLength < 0) {
            throw new Error('La longueur minimale doit être positive');
        }

        if (this._maxLength !== undefined && this._maxLength < 0) {
            throw new Error('La longueur maximale doit être positive');
        }

        if (this._minLength !== undefined && 
            this._maxLength !== undefined && 
            this._minLength > this._maxLength) {
            throw new Error('La longueur minimale ne peut pas être supérieure à la longueur maximale');
        }
    }

    // Getters
    get limit(): number {
        return this._limit;
    }

    get maxLength(): number | undefined {
        return this._maxLength;
    }

    get minLength(): number | undefined {
        return this._minLength;
    }

    get tags(): string[] | undefined {
        return this._tags ? [...this._tags] : undefined;
    }

    get author(): string | undefined {
        return this._author;
    }

    // Méthodes utilitaires
    public hasLengthFilter(): boolean {
        return this._maxLength !== undefined || this._minLength !== undefined;
    }

    public hasTagFilter(): boolean {
        return this._tags !== undefined && this._tags.length > 0;
    }

    public hasAuthorFilter(): boolean {
        return this._author !== undefined;
    }

    // Pour le débogage
    toString(): string {
        return JSON.stringify({
            limit: this._limit,
            maxLength: this._maxLength,
            minLength: this._minLength,
            tags: this._tags,
            author: this._author
        }, null, 2);
    }

    // Pour comparer deux instances de QuoteFilters
    equals(other: QuoteFiltersVO ): boolean {
        return this.toString() === other.toString();
    }

    // Clone avec modifications partielles
    with(modifications: Partial<{
        limit: number;
        maxLength: number;
        minLength: number;
        tags: string[];
        author: string;
    }>): QuoteFiltersVO  {
        return new QuoteFiltersVO (
            modifications.limit ?? this._limit,
            modifications.maxLength ?? this._maxLength,
            modifications.minLength ?? this._minLength,
            modifications.tags ?? this._tags,
            modifications.author ?? this._author
        );
    }
}