import { quotes } from '../../../src/infrastructure/persistence/in-memory/quotes';
import { LegacyQuoteRepository } from '../../../src/repositories/LegacyQuoteRepository';
import { Quote, LegacyQuoteFilters } from '../../../src/types/quote';

describe('LegacyQuoteRepository', () => {
  let repository: LegacyQuoteRepository;

  beforeEach(() => {
    repository = new LegacyQuoteRepository();
  });

  describe('findRandom', () => {
    it('should filter by maxLength', async () => {
      const filters: LegacyQuoteFilters = { maxLength: 20 };
      const result = await repository.findRandom(filters);
      result.forEach((quote: Quote) => {
        expect(quote.content.length).toBeLessThanOrEqual(20);
      });
    });

    it('should filter by minLength', async () => {
      const filters: LegacyQuoteFilters = { minLength: 10 };
      const result = await repository.findRandom(filters);
      result.forEach((quote: Quote) => {
        expect(quote.content.length).toBeGreaterThanOrEqual(10);
      });
    });

    it('should filter by author', async () => {
      const author = quotes[0].author;
      const filters: LegacyQuoteFilters = { author };
      const result = await repository.findRandom(filters);
      result.forEach((quote: Quote) => {
        expect(quote.author).toBe(author);
      });
    });

    it('should filter by tags', async () => {
      const tag = quotes[0].tags[0];
      const filters: LegacyQuoteFilters = { tags: tag };
      const result = await repository.findRandom(filters);
      result.forEach((quote: Quote) => {
        expect(quote.tags).toContain(tag);
      });
    });
  });

  describe('findById', () => {
    it('should find quote by id', async () => {
      const id = quotes[0]._id;
      const result = await repository.findById(id);
      expect(result).toEqual(quotes[0]);
    });

    it('should return null for non-existent id', async () => {
      const result = await repository.findById('nonexistent');
      expect(result).toBeNull();
    });
  });
});