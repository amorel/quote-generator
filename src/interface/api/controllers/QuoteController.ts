import { FastifyRequest, FastifyReply } from 'fastify';
import { GetRandomQuotesUseCase } from '../../../application/use-cases/quotes/GetRandomQuotes';
import { QuoteFiltersVO } from '../../../domain/value-objects/QuoteFilters';
import { ValidationError, NotFoundError } from '../../../errors';

// Interface pour typer la query
interface QuoteQuerystring {
    limit?: number;
    maxLength?: number;
    minLength?: number;
    tags?: string;
    author?: string;
}

// Type pour la requête Fastify
type QuoteRequest = FastifyRequest<{
    Querystring: QuoteQuerystring;
}>;

export class QuoteController {
    constructor(private readonly getRandomQuotesUseCase: GetRandomQuotesUseCase) {}

    async getRandomQuotes(request: QuoteRequest, reply: FastifyReply) {
        try {
            const filters = QuoteFiltersVO.create({
                limit: request.query.limit,
                maxLength: request.query.maxLength,
                minLength: request.query.minLength,
                tags: request.query.tags,
                author: request.query.author
            });
            
            const quotes = await this.getRandomQuotesUseCase.execute(filters);
            return reply.send(quotes);
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                return reply.status(400).send({
                    status: 'error',
                    message: error.message
                });
            }

            if (error instanceof NotFoundError) {
                return reply.status(404).send({
                    status: 'error',
                    message: error.message
                });
            }

            const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
            return reply.status(500).send({
                status: 'error',
                message: errorMessage
            });
        }
    }
}