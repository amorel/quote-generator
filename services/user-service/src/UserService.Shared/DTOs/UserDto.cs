namespace UserService.Shared.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public UserSettingsDto? Settings { get; set; }
    }

    public class UserSettingsDto
    {
        public string Theme { get; set; } = "light";
        public bool EmailNotifications { get; set; } = true;
    }

    public class CreateUserDto
    {
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    public class UpdateUserDto
    {
        public string? Email { get; set; }
        public string? Username { get; set; }
        public string? Role { get; set; }
    }
}