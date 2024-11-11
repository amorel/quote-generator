using System.Text.Json;
using Microsoft.Extensions.Logging;
using UserService.Core.Events;
using UserService.Core.Interfaces.Repositories;
using UserService.Shared.Events;

public interface IMessageHandlerService
{
    Task HandleMessage(string message);
}

public class MessageHandlerService : IMessageHandlerService
{
    private readonly IUserRepository _userRepository;
    private readonly ILogger<MessageHandlerService> _logger;

    private static readonly Action<ILogger, string, string, Exception?> LogFavoriteAdded =
        LoggerMessage.Define<string, string>(
            LogLevel.Information,
            new EventId(1, nameof(LogFavoriteAdded)),
            "Added favorite quote {QuoteId} for user {UserId}");

    private static readonly Action<ILogger, string, string, Exception?> LogFavoriteRemoved =
        LoggerMessage.Define<string, string>(
            LogLevel.Information,
            new EventId(2, nameof(LogFavoriteRemoved)),
            "Removed favorite quote {QuoteId} for user {UserId}");

    public MessageHandlerService(
        IUserRepository userRepository,
        ILogger<MessageHandlerService> logger)
    {
        _userRepository = userRepository;
        _logger = logger;
    }

    public async Task HandleMessage(string message)
    {
        try
        {
            var eventMessage = JsonSerializer.Deserialize<EventMessage>(message);
            if (eventMessage == null)
            {
                _logger.LogWarning("Failed to deserialize message: {Message}", message);
                return;
            }

            switch (eventMessage.Type)
            {
                case "quote.favorited":
                    {
                        var data = JsonSerializer.Deserialize<QuoteFavoritedEvent>(
                            eventMessage.Data.ToString() ?? "{}"
                        );
                        if (data != null)
                        {
                            await _userRepository.AddFavoriteQuoteAsync(
                                Guid.Parse(data.UserId),
                                data.QuoteId
                            );
                            LogFavoriteAdded(_logger, data.QuoteId, data.UserId, null);
                        }
                        break;
                    }

                case "quote.unfavorited":
                    {
                        var data = JsonSerializer.Deserialize<QuoteUnfavoritedEvent>(
                            eventMessage.Data.ToString() ?? "{}"
                        );
                        if (data != null)
                        {
                            await _userRepository.RemoveFavoriteQuoteAsync(
                                Guid.Parse(data.UserId),
                                data.QuoteId
                            );
                            LogFavoriteRemoved(_logger, data.QuoteId, data.UserId, null);
                        }
                        break;
                    }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing message: {Message}", message);
            throw;
        }
    }
}