export interface Quote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
}

export interface QuoteFilters {
  limit?: number;
  maxLength?: number;
  minLength?: number;
  tags?: string;
  author?: string;
}

export interface LegacyQuoteFilters {
  limit?: number;
  maxLength?: number;
  minLength?: number;
  tags?: string;
  author?: string;
}
