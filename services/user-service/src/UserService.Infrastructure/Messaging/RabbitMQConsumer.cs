using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

namespace UserService.Infrastructure.Messaging
{
    public class RabbitMQConsumer : BackgroundService
    {
        private readonly ILogger<RabbitMQConsumer> _logger;
        private readonly IOptions<RabbitMQConfiguration> _options;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private IConnection? _connection;
        private IModel? _channel;
        private bool _initialized;

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
            _initialized = false;
        }

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Starting RabbitMQ Consumer...");
            await base.StartAsync(cancellationToken);
        }

        private bool InitializeRabbitMQ()
        {
            try
            {
                _logger.LogInformation("Initializing RabbitMQ connection with host: {Host}", _options.Value.Host);

                var factory = new ConnectionFactory
                {
                    HostName = _options.Value.Host,
                    UserName = _options.Value.Username,
                    Password = _options.Value.Password,
                    AutomaticRecoveryEnabled = true,
                    RequestedHeartbeat = TimeSpan.FromSeconds(30)
                };

                _connection = factory.CreateConnection();
                _channel = _connection.CreateModel();

                SetupQueues();
                SetupQueueBindings().Wait();

                _initialized = true;
                _logger.LogInformation("RabbitMQ Consumer initialized successfully");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize RabbitMQ - will retry later");
                return false;
            }
        }

        private void SetupQueues()
        {
            if (_channel == null) return;

            try
            {
                _logger.LogInformation("Setting up queues and exchanges...");

                // Exchange principal
                _channel.ExchangeDeclare(
                    exchange: "quote.events.exchange",
                    type: "topic",
                    durable: true
                );

                // Queue principale
                _channel.QueueDeclare(
                    queue: _options.Value.QueueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: new Dictionary<string, object>
                    {
                    { "x-message-ttl", 86400000 } // 24h TTL
                    }
                );

                // Binding
                _channel.QueueBind(
                    queue: _options.Value.QueueName,
                    exchange: "quote.events.exchange",
                    routingKey: "quote.#"
                );

                _logger.LogInformation("Queues and exchanges setup completed");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to setup queues and exchanges");
                throw;
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                if (!_initialized || _channel?.IsOpen != true)
                {
                    if (!InitializeRabbitMQ())
                    {
                        _logger.LogWarning("Failed to initialize RabbitMQ, retrying in 10 seconds...");
                        await Task.Delay(10000, stoppingToken);
                        continue;
                    }
                }

                try
                {
                    var consumer = new EventingBasicConsumer(_channel);
                    consumer.Received += async (model, ea) =>
                    {
                        var body = ea.Body.ToArray();
                        var message = Encoding.UTF8.GetString(body);

                        try
                        {
                            await ProcessMessage(message);
                            _channel?.BasicAck(ea.DeliveryTag, false);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Error processing message");
                            _channel?.BasicNack(ea.DeliveryTag, false, true);
                        }
                    };

                    _channel?.BasicConsume(
                        queue: _options.Value.QueueName,
                        autoAck: false,
                        consumer: consumer);

                    await Task.Delay(Timeout.Infinite, stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in RabbitMQ consumer");
                    _initialized = false;
                    await Task.Delay(5000, stoppingToken);
                }
            }
        }

        private async Task ProcessMessage(string message)
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var messageHandler = scope.ServiceProvider.GetRequiredService<IMessageHandlerService>();
            await messageHandler.HandleMessage(message);
        }

        private async Task SetupQueueBindings()
        {
            if (_channel == null) return;

            try
            {
                _channel.QueueBind(
                    queue: _options.Value.QueueName,
                    exchange: "quote.events.exchange",
                    routingKey: "quote.favorited");

                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting up queue bindings");
                throw;
            }
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Stopping RabbitMQ Consumer...");

            try
            {
                _channel?.Close();
                _connection?.Close();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error closing RabbitMQ connections");
            }

            await base.StopAsync(cancellationToken);
        }

        public override void Dispose()
        {
            _channel?.Dispose();
            _connection?.Dispose();
            base.Dispose();
        }
    }
}