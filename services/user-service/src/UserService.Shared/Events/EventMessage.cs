namespace UserService.Shared.Events
{
    public class EventMessage
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public Dictionary<string, object> Data { get; set; } = new();
        public EventMetadata Metadata { get; set; } = new();
    }

    public class EventMetadata
    {
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string Version { get; set; } = "1.0";
        public string Service { get; set; } = string.Empty;
    }
}