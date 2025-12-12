namespace EduStats.Infrastructure.Messaging;

public sealed class RabbitMqOptions
{
    public const string SectionName = "MessageBroker";
    public string HostName { get; set; } = "rabbitmq";
    public int Port { get; set; } = 5672;
    public string UserName { get; set; } = "guest";
    public string Password { get; set; } = "guest";
    public string VirtualHost { get; set; } = "/";
}
