namespace UserService.Core.Domain.Entities
{
    public class FavoriteQuote
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string QuoteId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public User? User { get; set; }
    }
}