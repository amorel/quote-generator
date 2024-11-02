export interface QuoteDTO {
  _id: string;
  content: string;
  author: string;
  tags: string[];
}

export interface CreateQuoteDTO {
  content: string;
  author: string;
  tags: string[];
}

export interface UpdateQuoteDTO {
  content?: string;
  author?: string;
  tags?: string[];
}

export interface Quote {
  id: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
