namespace UserService.Core.Domain.Entities
{
    public class FavoriteQuote
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string QuoteId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public User? User { get; set; }
    }
}