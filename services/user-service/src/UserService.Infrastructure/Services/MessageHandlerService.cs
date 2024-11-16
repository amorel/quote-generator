using System.Text.Json;
using Microsoft.Extensions.Logging;
using UserService.Core.Events;
using UserService.Core.Interfaces.Repositories;
using UserService.Core.Metrics;
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
        if (message.Contains("quote.favorited"))
        {
            UserMetrics.UserFavoritesTotal.Inc();
        }

        _logger.LogInformation("[MESSAGE_HANDLER] Raw message received: {Message}", message);

        try
        {
            var eventMessage = JsonDocument.Parse(message);
            var root = eventMessage.RootElement;

            var type = root.GetProperty("type").GetString();

            _logger.LogInformation("[MESSAGE_HANDLER] Processing event type: {Type}", type);

            if (type == "quote.favorited")
            {
                var data = root.GetProperty("data");
                var quoteId = data.GetProperty("quoteId").GetString();
                var userId = data.GetProperty("userId").GetString();

                _logger.LogInformation("[MESSAGE_HANDLER] Processing favorite request: QuoteId={QuoteId}, UserId={UserId}",
                    quoteId, userId);

                if (quoteId != null && userId != null)
                {
                    try
                    {
                        await _userRepository.AddFavoriteQuoteAsync(userId, quoteId);
                        _logger.LogInformation("[MESSAGE_HANDLER] Successfully added favorite for user {UserId}", userId);
                        LogFavoriteAdded(_logger, quoteId, userId, null);
                    }
                    catch (InvalidOperationException ex)
                    {
                        _logger.LogWarning("[MESSAGE_HANDLER] Unable to add favorite: {Message}", ex.Message);
                        // Ne pas relancer l'exception car c'est une erreur "attendue"
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "[MESSAGE_HANDLER] Failed to add favorite. UserId: {UserId}, QuoteId: {QuoteId}",
                            userId, quoteId);
                        throw;
                    }
                }
                else
                {
                    _logger.LogWarning("[MESSAGE_HANDLER] Invalid message data: QuoteId or UserId is null");
                }
            }
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "[MESSAGE_HANDLER] Failed to parse message: {Message}", message);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[MESSAGE_HANDLER] Unexpected error processing message");
            throw;
        }
    }
}