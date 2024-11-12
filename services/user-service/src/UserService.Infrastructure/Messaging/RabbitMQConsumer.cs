using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using UserService.Core.Interfaces.Repositories;
using UserService.Shared.Events;

namespace UserService.Infrastructure.Messaging
{
    // Ajout des classes d'événements
    public class QuoteFavoritedEvent
    {
        public string UserId { get; set; } = string.Empty;
        public string QuoteId { get; set; } = string.Empty;
        public long Timestamp { get; set; }
    }

    public class QuoteUnfavoritedEvent
    {
        public string UserId { get; set; } = string.Empty;
        public string QuoteId { get; set; } = string.Empty;
        public long Timestamp { get; set; }
    }

    public class RabbitMQConsumer : BackgroundService
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<RabbitMQConsumer> _logger;
        private readonly IOptions<RabbitMQConfiguration> _options;
        private readonly IServiceScopeFactory _serviceScopeFactory;
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

        public RabbitMQConsumer(
            IOptions<RabbitMQConfiguration> options,
            IServiceScopeFactory serviceScopeFactory,
            ILogger<RabbitMQConsumer> logger)
        {
            _options = options;
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;

            try
            {
                var factory = new ConnectionFactory
                {
                    HostName = options.Value.Host,
                    UserName = options.Value.Username,
                    Password = options.Value.Password
                };

                _connection = factory.CreateConnection();
                _channel = _connection.CreateModel();

                SetupQueues();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize RabbitMQ consumer");
                throw;
            }

            try
            {
                SetupQueueBindings().Wait();
                _logger.LogInformation("RabbitMQ Consumer initialized successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize RabbitMQ Consumer");
                throw;
            }
        }

        private void SetupQueues()
        {
            try
            {
                _logger.LogInformation("Declaring queue: {QueueName}", _options.Value.QueueName);

                // Déclarer d'abord l'exchange DLX
                _channel.ExchangeDeclare(
                    exchange: "dlx",
                    type: "topic",
                    durable: true
                );

                // Déclarer l'exchange principal
                _channel.ExchangeDeclare(
                    exchange: "quote.events.exchange",
                    type: "topic",
                    durable: true
                );

                // Déclarer la queue sans les arguments DLX pour commencer
                _channel.QueueDeclare(
                    queue: _options.Value.QueueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null  // Retiré les arguments DLX pour le moment
                );

                // Binding avec l'exchange des quotes
                _channel.QueueBind(
                    queue: _options.Value.QueueName,
                    exchange: "quote.events.exchange",
                    routingKey: "quote.#"  // Pour capturer tous les événements quote
                );

                _logger.LogInformation("Queue setup completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to setup queues");
                throw;
            }
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Starting RabbitMQ consumer...");

            var consumer = new EventingBasicConsumer(_channel);
            string queueName = _options.Value.QueueName;

            consumer.Received += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                _logger.LogInformation("Received message: {RoutingKey}", ea.RoutingKey);

                try
                {
                    await ProcessMessage(message);
                    _channel.BasicAck(ea.DeliveryTag, false);
                    _logger.LogInformation("Message processed successfully");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing message: {Message}", message);
                    _channel.BasicNack(ea.DeliveryTag, false, true);
                }
            };

            _channel.BasicConsume(
                queue: queueName,
                autoAck: false,
                consumer: consumer);

            _logger.LogInformation("Consumer registered for queue: {QueueName}", queueName);

            return Task.CompletedTask;
        }

        private async Task ProcessMessage(string message)
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var messageHandler = scope.ServiceProvider.GetRequiredService<IMessageHandlerService>();
            await messageHandler.HandleMessage(message);
        }

        private async Task SetupQueueBindings()
        {
            try
            {
                _channel.ExchangeDeclare(
                    exchange: "quote.events.exchange",
                    type: "topic",
                    durable: true);

                _channel.QueueDeclare(
                    queue: _options.Value.QueueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false);

                _channel.QueueBind(
                    queue: _options.Value.QueueName,
                    exchange: "quote.events.exchange",
                    routingKey: "quote.favorited");

                _logger.LogInformation($"Queue {_options.Value.QueueName} bound to exchange quote.events.exchange");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting up queue bindings");
                throw;
            }
        }

        public override void Dispose()
        {
            _channel?.Dispose();
            _connection?.Dispose();
            base.Dispose();
        }
    }
}