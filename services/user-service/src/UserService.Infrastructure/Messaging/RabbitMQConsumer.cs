using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using UserService.Shared.Events;
using UserService.Core.Interfaces.Services;

namespace UserService.Infrastructure.Messaging
{
    public class RabbitMQConsumer : BackgroundService
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;
        private readonly IUserService _userService;
        private readonly ILogger<RabbitMQConsumer> _logger;

        public RabbitMQConsumer(
            IOptions<RabbitMQConfiguration> options,
            IUserService userService,
            ILogger<RabbitMQConsumer> logger)
        {
            _logger = logger;
            _userService = userService;

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
        }

        private void SetupQueues()
        {
            _channel.QueueDeclare("user_events", true, false, false);
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var consumer = new EventingBasicConsumer(_channel);
            
            consumer.Received += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                try
                {
                    await ProcessMessage(message);
                    _channel.BasicAck(ea.DeliveryTag, false);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing message: {Message}", message);
                    _channel.BasicNack(ea.DeliveryTag, false, true);
                }
            };

            _channel.BasicConsume("user_events", false, consumer);

            return Task.CompletedTask;
        }

        private async Task ProcessMessage(string message)
        {
            try 
            {
                var eventMessage = JsonSerializer.Deserialize<EventMessage>(message);
                if (eventMessage == null)
                {
                    _logger.LogWarning("Failed to deserialize message: {Message}", message);
                    return;
                }

                // TODO: Implement message processing based on event type
                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing message: {Message}", message);
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