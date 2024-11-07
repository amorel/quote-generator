namespace UserService.Core.Domain.Entities
{
    public class UserSettings
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Theme { get; set; } = string.Empty;
        public bool EmailNotifications { get; set; }
        public User? User { get; set; }
    }
}