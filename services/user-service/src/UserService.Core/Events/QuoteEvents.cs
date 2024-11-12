namespace UserService.Core.Events
{
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
}