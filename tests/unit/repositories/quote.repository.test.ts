import { QuoteRepository } from '../../../src/repositories/quote.repository';
import { quotes } from '../../../src/data/quotes';

describe('QuoteRepository', () => {
  let repository: QuoteRepository;

  beforeEach(() => {
    repository = new QuoteRepository();
  });

  describe('findRandom', () => {
    it('should filter by maxLength', async () => {
      const result = await repository.findRandom({ maxLength: 20 });
      result.forEach(quote => {
        expect(quote.content.length).toBeLessThanOrEqual(20);
      });
    });

    it('should filter by minLength', async () => {
      const result = await repository.findRandom({ minLength: 10 });
      result.forEach(quote => {
        expect(quote.content.length).toBeGreaterThanOrEqual(10);
      });
    });

    it('should filter by author', async () => {
      const author = quotes[0].author;
      const result = await repository.findRandom({ author });
      result.forEach(quote => {
        expect(quote.author).toBe(author);
      });
    });

    it('should filter by tags', async () => {
      const tags = quotes[0].tags[0];
      const result = await repository.findRandom({ tags });
      result.forEach(quote => {
        expect(quote.tags).toContain(tags);
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