namespace UserService.Shared.Events
{
    public class EventMessage
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public dynamic Data { get; set; } = null!;
        public EventMetadata Metadata { get; set; } = new();
    }

    public class EventMetadata
    {
        public DateTime Timestamp { get; set; }
        public string Version { get; set; } = string.Empty;
        public string Service { get; set; } = string.Empty;
    }
}