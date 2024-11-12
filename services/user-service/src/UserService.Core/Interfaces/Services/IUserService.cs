using UserService.Core.Domain.Entities;

namespace UserService.Core.Interfaces.Services
{
    public interface IUserService
    {
        Task<User?> GetUserByIdAsync(string id);
        Task<List<User>> GetAllUsersAsync();
        Task<User> CreateUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(string id);
    }
}