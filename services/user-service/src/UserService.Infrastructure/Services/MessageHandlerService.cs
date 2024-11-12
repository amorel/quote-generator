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

                _logger.LogInformation("[MESSAGE_HANDLER] Adding favorite: QuoteId={QuoteId}, UserId={UserId}",
                    quoteId, userId);

                if (quoteId != null && userId != null)
                {
                    await _userRepository.AddFavoriteQuoteAsync(userId, quoteId);
                    _logger.LogInformation("[MESSAGE_HANDLER] Successfully added favorite");
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[MESSAGE_HANDLER] Error processing message");
            throw;
        }
    }
}