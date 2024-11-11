using Microsoft.Extensions.Logging;
using UserService.Core.Interfaces;
using UserService.Core.Interfaces.Repositories;
using UserService.Shared.Events;
using System;
using System.Threading.Tasks;

namespace UserService.Infrastructure.Messaging
{
    public class QuoteEventHandler : IEventHandler
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<QuoteEventHandler> _logger;

        public QuoteEventHandler(IUserRepository userRepository, ILogger<QuoteEventHandler> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task HandleAsync(EventMessage eventMessage)
        {
            switch (eventMessage.Type)
            {
                case "quote.favorited":
                    await HandleQuoteFavorited(eventMessage.Data);
                    break;
                case "quote.unfavorited":
                    await HandleQuoteUnfavorited(eventMessage.Data);
                    break;
                default:
                    _logger.LogWarning("Unhandled event type: {EventType}", eventMessage.Type);
                    break;
            }
        }

        private async Task HandleQuoteFavorited(dynamic data)
        {
            try 
            {
                var userId = data.userId.ToString();
                var quoteId = data.quoteId.ToString();
                
                await _userRepository.AddFavoriteQuoteAsync(Guid.Parse(userId), quoteId);
                _logger.LogInformation($"Added favorite quote {quoteId} for user {userId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error handling quote favorited event");
                throw;
            }
        }

        private async Task HandleQuoteUnfavorited(dynamic data)
        {
            try 
            {
                var userId = data.userId.ToString();
                var quoteId = data.quoteId.ToString();
                
                await _userRepository.RemoveFavoriteQuoteAsync(Guid.Parse(userId), quoteId);
                _logger.LogInformation($"Removed favorite quote {quoteId} for user {userId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error handling quote unfavorited event");
                throw;
            }
        }
    }
}