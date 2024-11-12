namespace UserService.Core.Domain.Entities
{
    public class UserSettings
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Theme { get; set; } = string.Empty;
        public bool EmailNotifications { get; set; }
        public User? User { get; set; }
    }
}