using System.Text;
using RabbitMQ.Client;
using Microsoft.Extensions.Configuration;
using UserService.Core.Interfaces;

namespace UserService.Infrastructure.Messaging
{
    public interface IMessageBusClient
    {
        void PublishMessage(string message, string routingKey);
    }

    public class RabbitMQClient : IMessageBusClient, IDisposable
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;

        public RabbitMQClient(IConfiguration configuration)
        {
            var factory = new ConnectionFactory
            {
                HostName = configuration["RabbitMQ:Host"],
                UserName = configuration["RabbitMQ:Username"],
                Password = configuration["RabbitMQ:Password"]
            };

            try
            {
                _connection = factory.CreateConnection();
                _channel = _connection.CreateModel();
            }
            catch (Exception ex)
            {
                // Log the error or handle it appropriately
                throw new Exception("Could not connect to RabbitMQ", ex);
            }
        }

        public void PublishMessage(string message, string routingKey)
        {
            if (_channel.IsClosed)
            {
                throw new InvalidOperationException("RabbitMQ channel is closed");
            }

            var body = Encoding.UTF8.GetBytes(message);

            _channel.BasicPublish(
                exchange: "",
                routingKey: routingKey,
                basicProperties: null,
                body: body);
        }

        public void Dispose()
        {
            if (_channel?.IsOpen ?? false)
            {
                _channel?.Close();
                _channel?.Dispose();
            }

            if (_connection?.IsOpen ?? false)
            {
                _connection?.Close();
                _connection?.Dispose();
            }
        }
    }
}