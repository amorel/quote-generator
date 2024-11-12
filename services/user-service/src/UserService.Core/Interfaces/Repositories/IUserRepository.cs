using UserService.Core.Domain.Entities;

namespace UserService.Core.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(string id);  
        Task<List<User>> GetAllAsync();
        Task<User> CreateAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(string id);  
        Task AddFavoriteQuoteAsync(string userId, string quoteId);  
        Task RemoveFavoriteQuoteAsync(string userId, string quoteId);  
    }
}