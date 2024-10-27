import { QuoteService } from '../../../src/services/quote.service';
import { QuoteRepository } from '../../../src/repositories/quote.repository';
import { NotFoundError, ValidationError } from '../../../src/errors';
import { Quote } from '../../../src/types/quote';

describe('QuoteService', () => {
  let quoteService: QuoteService;
  let mockRepository: jest.Mocked<QuoteRepository>;

  const mockQuotes: Quote[] = [
    {
      _id: '1',
      content: 'Test quote 1',
      author: 'Author 1',
      tags: ['test']
    },
    {
      _id: '2',
      content: 'Test quote 2',
      author: 'Author 2',
      tags: ['test', 'motivation']
    }
  ];

  beforeEach(() => {
    mockRepository = {
      findRandom: jest.fn(),
      findById: jest.fn()
    } as any;

    quoteService = new QuoteService(mockRepository);
  });

  describe('getRandomQuotes', () => {
    it('should return random quotes with valid filters', async () => {
      mockRepository.findRandom.mockResolvedValue(mockQuotes);

      const result = await quoteService.getRandomQuotes({ limit: 1 });
      expect(result).toHaveLength(1);
      expect(mockRepository.findRandom).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid limit', async () => {
      await expect(quoteService.getRandomQuotes({ limit: 51 }))
        .rejects
        .toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid length constraints', async () => {
      await expect(quoteService.getRandomQuotes({
        minLength: 100,
        maxLength: 50
      }))
        .rejects
        .toThrow(ValidationError);
    });

    it('should throw NotFoundError when no quotes found', async () => {
      mockRepository.findRandom.mockResolvedValue([]);

      await expect(quoteService.getRandomQuotes({}))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('getQuoteById', () => {
    it('should return quote by id', async () => {
      mockRepository.findById.mockResolvedValue(mockQuotes[0]);

      const result = await quoteService.getQuoteById('1');
      expect(result).toEqual(mockQuotes[0]);
    });

    it('should throw NotFoundError for non-existent quote', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(quoteService.getQuoteById('999'))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should throw ValidationError for empty id', async () => {
      await expect(quoteService.getQuoteById(''))
        .rejects
        .toThrow(ValidationError);
    });
  });
});