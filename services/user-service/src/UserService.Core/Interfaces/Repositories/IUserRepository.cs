using UserService.Core.Domain.Entities;

namespace UserService.Core.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(Guid id);
        Task<List<User>> GetAllAsync();
        Task<User> CreateAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(Guid id);
        Task AddFavoriteQuoteAsync(Guid userId, string quoteId);
        Task RemoveFavoriteQuoteAsync(Guid userId, string quoteId);
    }
}